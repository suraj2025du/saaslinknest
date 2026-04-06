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
    const {
      theme,
      backgroundColor,
      gradientColor1,
      gradientColor2,
      gradientDirection,
      buttonStyle,
      fontFamily
    } = body;

    const existingProfile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, session.userId as number),
    });

    // If no profile owned by user, check team access
    let profile = existingProfile;
    if (!existingProfile) {
      const teamMembership = await db.query.teamMembers.findFirst({
        where: and(
          eq(teamMembers.userId, session.userId as number),
          eq(teamMembers.status, 'active'),
        ),
      });

      if (teamMembership) {
        const canEdit = await canEditProfile(session.userId as number, teamMembership.profileId);
        if (canEdit) {
          profile = await db.query.profiles.findFirst({
            where: eq(profiles.id, teamMembership.profileId),
          });
        }
      }
    }

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Check edit permission (owner or editor)
    const hasEditAccess = session.id === profile.userId ||
      await canEditProfile(session.userId as number, profile.id);

    if (!hasEditAccess) {
      return NextResponse.json({ error: 'You do not have permission to edit this profile' }, { status: 403 });
    }

    await db.update(profiles)
      .set({
        theme: theme ?? profile.theme,
        backgroundColor: backgroundColor ?? profile.backgroundColor,
        gradientColor1: gradientColor1 ?? profile.gradientColor1,
        gradientColor2: gradientColor2 ?? profile.gradientColor2,
        gradientDirection: gradientDirection ?? profile.gradientDirection,
        buttonStyle: buttonStyle ?? profile.buttonStyle,
        fontFamily: fontFamily ?? profile.fontFamily,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, profile.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Appearance update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
