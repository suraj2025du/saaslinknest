import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { profiles, teamMembers } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

/**
 * GET /api/team/profile-access?profileId=123
 * 
 * Checks if the current user has team access to the given profile.
 * Returns the user's role and permissions for that profile.
 */
export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get('profileId');

    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
    }

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, parseInt(profileId)),
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Check if user is the owner
    const isOwner = profile.userId === session.userId;

    if (isOwner) {
      return NextResponse.json({
        hasAccess: true,
        role: 'owner',
        isOwner: true,
        canEdit: true,
        canManageTeam: true,
        profile: {
          id: profile.id,
          username: profile.username,
        },
      });
    }

    // Check team membership
    const membership = await db.query.teamMembers.findFirst({
      where: and(
        eq(teamMembers.profileId, profile.id),
        eq(teamMembers.userId, session.userId as number),
        eq(teamMembers.status, 'active' as any),
      ),
    });

    if (!membership) {
      return NextResponse.json({
        hasAccess: false,
        role: null,
        isOwner: false,
        canEdit: false,
        canManageTeam: false,
      });
    }

    const canEdit = membership.role === 'editor' || membership.role === 'owner';
    const canManageTeam = membership.role === 'owner';

    return NextResponse.json({
      hasAccess: true,
      role: membership.role,
      isOwner: false,
      canEdit,
      canManageTeam,
      profile: {
        id: profile.id,
        username: profile.username,
      },
    });
  } catch (error) {
    console.error('Profile access check error:', error);
    return NextResponse.json({ error: 'Failed to check profile access' }, { status: 500 });
  }
}
