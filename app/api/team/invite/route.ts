import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { teamMembers, profiles, users } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import {
  generateInviteToken,
  canManageTeam,
  getCurrentUserProfile,
  sendTeamInviteEmail,
  findExistingInvite,
  findTeamMemberByUserId,
} from '@/lib/team';

const VALID_ROLES = ['editor', 'viewer'] as const;

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { email, role } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validate role
    if (!role || !VALID_ROLES.includes(role as any)) {
      return NextResponse.json({ error: 'Role must be either "editor" or "viewer"' }, { status: 400 });
    }

    // Get the user's profile (the one they own)
    const userProfile = await getCurrentUserProfile(session.userId as number);
    if (!userProfile) {
      return NextResponse.json({ error: 'Profile not found. Create a profile first.' }, { status: 404 });
    }

    // Check if user can manage team (must be owner)
    const canManage = await canManageTeam(userProfile.id, session.userId as number);
    if (!canManage) {
      return NextResponse.json({ error: 'Only the profile owner can manage team members' }, { status: 403 });
    }

    // Check if trying to invite the owner themselves
    if (email === session.email) {
      return NextResponse.json({ error: 'You cannot invite yourself' }, { status: 400 });
    }

    // Check if user already exists with this email
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // If user exists, check if they're already a team member
    if (existingUser) {
      const existingMember = await findTeamMemberByUserId(userProfile.id, existingUser.id);
      if (existingMember) {
        if (existingMember.status === 'active') {
          return NextResponse.json({ error: 'This user is already a team member' }, { status: 400 });
        }
        if (existingMember.status === 'revoked') {
          // Reactivate the revoked member
          await db.update(teamMembers)
            .set({
              status: 'active',
              role: role as 'editor' | 'viewer',
              acceptedAt: new Date(),
              inviteToken: null,
            })
            .where(eq(teamMembers.id, existingMember.id));

          return NextResponse.json({
            success: true,
            message: 'Team member reactivated',
            member: { id: existingMember.id, email, role, status: 'active' },
          });
        }
      }
    }

    // Check for existing pending invite
    const existingInvite = await findExistingInvite(userProfile.id, email);
    if (existingInvite) {
      return NextResponse.json({ error: 'A pending invite already exists for this email' }, { status: 400 });
    }

    // Generate invite token
    const inviteToken = generateInviteToken();

    // Create team member entry
    const userId = existingUser ? existingUser.id : null;
    const [newMember] = await db.insert(teamMembers).values({
      profileId: userProfile.id,
      userId,
      email,
      role: role as 'editor' | 'viewer',
      status: 'pending',
      inviteToken,
      invitedAt: new Date(),
    }).$returningId();

    // Send invite email
    const acceptUrl = `${process.env.APP_URL || 'http://localhost:3000'}/team/accept?token=${inviteToken}`;
    const profileName = userProfile.username || userProfile.bio?.slice(0, 30) || 'LinkNest Profile';
    const inviterName = session.name as string || (session.email as string)?.split('@')[0] || 'A LinkNest user';

    await sendTeamInviteEmail(email, inviterName, profileName, acceptUrl);

    return NextResponse.json({
      success: true,
      message: 'Invite sent successfully',
      invite: {
        id: newMember.id,
        email,
        role,
        status: 'pending',
      },
    });
  } catch (error) {
    console.error('Team invite error:', error);
    return NextResponse.json({ error: 'Failed to send invite' }, { status: 500 });
  }
}
