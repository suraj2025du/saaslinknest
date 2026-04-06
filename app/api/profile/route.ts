import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { profiles, teamMembers } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { canEditProfile } from '@/lib/team';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, bio, avatar, username, customDomain } = body;

    // Backend validation for name
    if (name && (name.length < 2 || name.length > 50)) {
      return NextResponse.json({ error: 'Display name must be between 2 and 50 characters' }, { status: 400 });
    }

    // Backend validation for username
    if (username) {
      const usernameRegex = /^[a-zA-Z0-9._]+$/;
      if (username.length < 3 || username.length > 30) {
        return NextResponse.json({ error: 'Username must be between 3 and 30 characters' }, { status: 400 });
      }
      if (!usernameRegex.test(username)) {
        return NextResponse.json({ error: 'Invalid username format' }, { status: 400 });
      }
    }

    // Backend validation for bio
    if (bio && bio.length > 160) {
      return NextResponse.json({ error: 'Bio must be less than 160 characters' }, { status: 400 });
    }

    // Backend validation for customDomain
    if (customDomain) {
      const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
      if (!domainRegex.test(customDomain)) {
        return NextResponse.json({ error: 'Invalid domain format' }, { status: 400 });
      }
    }

    // Check if profile exists
    let existingProfile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, session.userId as number),
    });

    // If no profile owned by user, check team access
    if (!existingProfile) {
      // Check if user is a team member with edit access on any profile
      const teamMembership = await db.query.teamMembers.findFirst({
        where: and(
          eq(teamMembers.userId, session.userId as number),
          eq(teamMembers.status, 'active'),
        ),
      });

      if (teamMembership) {
        const canEdit = await canEditProfile(session.userId as number, teamMembership.profileId);
        if (canEdit) {
          const teamProfile = await db.query.profiles.findFirst({
            where: eq(profiles.id, teamMembership.profileId),
          });
          if (teamProfile) {
            existingProfile = teamProfile;
          }
        }
      }
    }

    if (!existingProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Check edit permission (owner or editor)
    const hasEditAccess = session.id === existingProfile.userId ||
      await canEditProfile(session.userId as number, existingProfile.id);

    if (!hasEditAccess) {
      return NextResponse.json({ error: 'You do not have permission to edit this profile' }, { status: 403 });
    }

    await db.update(profiles)
      .set({
        bio: bio ?? existingProfile.bio,
        avatar: avatar ?? existingProfile.avatar,
        username: username ?? existingProfile.username,
        customDomain: customDomain ?? existingProfile.customDomain,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, existingProfile.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
