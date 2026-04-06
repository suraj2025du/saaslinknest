import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { teamMembers, profiles, users } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import {
  canManageTeam,
  getCurrentUserProfile,
  getTeamMembersWithUsers,
  findTeamMemberByUserId,
} from '@/lib/team';

const VALID_ROLES = ['owner', 'editor', 'viewer'] as const;

// GET - List all team members
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

    // Get all members (including pending invites)
    const members = await db.query.teamMembers.findMany({
      where: eq(teamMembers.profileId, userProfile.id),
    });

    // Enrich with user data
    const enrichedMembers = await Promise.all(
      members.map(async (member) => {
        let userData = null;
        if (member.userId) {
          userData = await db.query.users.findFirst({
            where: eq(users.id, member.userId as number),
            columns: {
              id: true,
              name: true,
              email: true,
              emailVerified: true,
            },
          });
        }
        return {
          ...member,
          user: userData,
        };
      })
    );

    return NextResponse.json({ members: enrichedMembers });
  } catch (error) {
    console.error('Get team members error:', error);
    return NextResponse.json({ error: 'Failed to get team members' }, { status: 500 });
  }
}

// PATCH - Update a team member's role
export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { memberId, role } = body;

    if (!memberId) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
    }

    if (!role || !VALID_ROLES.includes(role as any)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const userProfile = await getCurrentUserProfile(session.userId as number);
    if (!userProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Only owner can manage team
    const canManage = await canManageTeam(userProfile.id, session.userId as number);
    if (!canManage) {
      return NextResponse.json({ error: 'Only the profile owner can manage team members' }, { status: 403 });
    }

    // Find the member
    const member = await db.query.teamMembers.findFirst({
      where: and(
        eq(teamMembers.id, memberId),
        eq(teamMembers.profileId, userProfile.id)
      ),
    });

    if (!member) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    // Cannot change owner role
    if (member.role === 'owner') {
      return NextResponse.json({ error: 'Cannot change the owner role' }, { status: 400 });
    }

    // Cannot set role to owner (only transfer ownership, which is a different flow)
    if (role === 'owner') {
      return NextResponse.json({ error: 'Cannot assign owner role. Use transfer ownership instead.' }, { status: 400 });
    }

    await db.update(teamMembers)
      .set({
        role: role as 'editor' | 'viewer',
      })
      .where(eq(teamMembers.id, memberId));

    return NextResponse.json({
      success: true,
      message: 'Role updated successfully',
    });
  } catch (error) {
    console.error('Update team member error:', error);
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 });
  }
}

// DELETE - Remove a team member
export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get('memberId');

    if (!memberId) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
    }

    const userProfile = await getCurrentUserProfile(session.userId as number);
    if (!userProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Only owner can manage team
    const canManage = await canManageTeam(userProfile.id, session.userId as number);
    if (!canManage) {
      return NextResponse.json({ error: 'Only the profile owner can manage team members' }, { status: 403 });
    }

    // Find the member
    const member = await db.query.teamMembers.findFirst({
      where: and(
        eq(teamMembers.id, parseInt(memberId)),
        eq(teamMembers.profileId, userProfile.id)
      ),
    });

    if (!member) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    // Cannot remove owner
    if (member.role === 'owner') {
      return NextResponse.json({ error: 'Cannot remove the profile owner' }, { status: 400 });
    }

    // Set status to revoked instead of deleting
    await db.update(teamMembers)
      .set({
        status: 'revoked',
      })
      .where(eq(teamMembers.id, member.id));

    return NextResponse.json({
      success: true,
      message: 'Team member removed successfully',
    });
  } catch (error) {
    console.error('Remove team member error:', error);
    return NextResponse.json({ error: 'Failed to remove team member' }, { status: 500 });
  }
}
