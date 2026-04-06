import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { teamMembers } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { canManageTeam, getCurrentUserProfile } from '@/lib/team';

// GET - Get pending invites
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userProfile = await getCurrentUserProfile(session.userId as number);
    if (!userProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Only owner can view invites
    const canManage = await canManageTeam(userProfile.id, session.userId as number);
    if (!canManage) {
      return NextResponse.json({ error: 'Only the profile owner can view invites' }, { status: 403 });
    }

    const invites = await db.query.teamMembers.findMany({
      where: eq(teamMembers.status, 'pending' as any),
    });

    // Filter to only this profile's invites
    const profileInvites = invites.filter(invite => invite.profileId === userProfile.id);

    return NextResponse.json({ invites: profileInvites });
  } catch (error) {
    console.error('Get pending invites error:', error);
    return NextResponse.json({ error: 'Failed to get pending invites' }, { status: 500 });
  }
}

// DELETE - Revoke a pending invite
export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const inviteId = searchParams.get('inviteId');

    if (!inviteId) {
      return NextResponse.json({ error: 'Invite ID is required' }, { status: 400 });
    }

    const userProfile = await getCurrentUserProfile(session.userId as number);
    if (!userProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Only owner can revoke invites
    const canManage = await canManageTeam(userProfile.id, session.userId as number);
    if (!canManage) {
      return NextResponse.json({ error: 'Only the profile owner can revoke invites' }, { status: 403 });
    }

    const invite = await db.query.teamMembers.findFirst({
      where: eq(teamMembers.id, parseInt(inviteId)),
    });

    if (!invite) {
      return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
    }

    if (invite.profileId !== userProfile.id) {
      return NextResponse.json({ error: 'Invite does not belong to your profile' }, { status: 403 });
    }

    if (invite.status !== 'pending') {
      return NextResponse.json({ error: 'Invite is not pending' }, { status: 400 });
    }

    await db.update(teamMembers)
      .set({
        status: 'revoked',
      })
      .where(eq(teamMembers.id, invite.id));

    return NextResponse.json({
      success: true,
      message: 'Invite revoked successfully',
    });
  } catch (error) {
    console.error('Revoke invite error:', error);
    return NextResponse.json({ error: 'Failed to revoke invite' }, { status: 500 });
  }
}
