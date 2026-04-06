import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { teamMembers, profiles } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { findTeamMemberByToken } from '@/lib/team';

// POST - Accept an invite using token (for authenticated users)
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { token } = body;

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Invite token is required' }, { status: 400 });
    }

    // Find the invite
    const invite = await findTeamMemberByToken(token);
    if (!invite) {
      return NextResponse.json({ error: 'Invalid or expired invite token' }, { status: 404 });
    }

    // Check if the invite was sent to this user's email
    if (invite.email !== session.email) {
      return NextResponse.json({ error: 'This invite is not for your account' }, { status: 403 });
    }

    // Accept the invite
    await db.update(teamMembers)
      .set({
        status: 'active',
        userId: session.userId as number,
        acceptedAt: new Date(),
        inviteToken: null,
      })
      .where(eq(teamMembers.id, invite.id));

    // Get profile info for redirect
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, invite.profileId),
    });

    return NextResponse.json({
      success: true,
      message: 'Invite accepted successfully',
      profile: {
        id: profile?.id,
        username: profile?.username,
      },
    });
  } catch (error) {
    console.error('Accept invite error:', error);
    return NextResponse.json({ error: 'Failed to accept invite' }, { status: 500 });
  }
}

// GET - Check invite validity (for the accept page)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const invite = await findTeamMemberByToken(token);
    if (!invite) {
      return NextResponse.json({ error: 'Invalid or expired invite' }, { status: 404 });
    }

    // Get profile info
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, invite.profileId),
    });

    const session = await getSession();
    const isLoggedIn = !!session;
    const isCorrectEmail = isLoggedIn && session.email === invite.email;

    return NextResponse.json({
      valid: true,
      email: invite.email,
      role: invite.role,
      profileName: profile?.username || 'LinkNest Profile',
      isLoggedIn,
      isCorrectEmail,
    });
  } catch (error) {
    console.error('Check invite error:', error);
    return NextResponse.json({ error: 'Failed to check invite' }, { status: 500 });
  }
}
