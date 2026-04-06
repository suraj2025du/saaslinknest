import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { links, teamMembers, profiles } from '@/lib/schema';
import { eq, and, desc } from 'drizzle-orm';
import { canEditProfile, getTeamMembership } from '@/lib/team';

/**
 * Resolve the effective user ID for link operations.
 * If the user is a team member with editor role, returns the profile owner's userId.
 * Otherwise returns the current session user's ID.
 */
async function resolveLinkUserId(sessionUserId: number): Promise<{ userId: number; isTeamEditor: boolean }> {
  // First check if the user owns a profile
  const ownProfile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, sessionUserId),
  });

  if (ownProfile) {
    return { userId: sessionUserId, isTeamEditor: false };
  }

  // Check if user is a team editor
  const teamMembership = await db.query.teamMembers.findFirst({
    where: and(
      eq(teamMembers.userId, sessionUserId),
      eq(teamMembers.status, 'active'),
    ),
  });

  if (teamMembership && (teamMembership.role === 'editor' || teamMembership.role === 'owner')) {
    const teamProfile = await db.query.profiles.findFirst({
      where: eq(profiles.id, teamMembership.profileId),
    });
    if (teamProfile) {
      return { userId: teamProfile.userId, isTeamEditor: true };
    }
  }

  return { userId: sessionUserId, isTeamEditor: false };
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await resolveLinkUserId(session.id as number);

    const userLinks = await db.query.links.findMany({
      where: eq(links.userId, userId),
      orderBy: [desc(links.position), desc(links.createdAt)],
    });

    // Annotate each link with a scheduling status for the owner
    const now = new Date();
    const annotatedLinks = userLinks.map((link) => {
      const { scheduledAt, scheduledEndAt } = link;
      let scheduleStatus: 'active' | 'scheduled' | 'expired' | null = null;

      if (scheduledAt) {
        const start = new Date(scheduledAt);
        const end = scheduledEndAt ? new Date(scheduledEndAt) : null;

        if (now < start) {
          scheduleStatus = 'scheduled';
        } else if (end && now > end) {
          scheduleStatus = 'expired';
        } else {
          scheduleStatus = 'active';
        }
      }

      return { ...link, scheduleStatus };
    });

    return NextResponse.json(annotatedLinks);
  } catch (error) {
    console.error('Failed to fetch links:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, isTeamEditor } = await resolveLinkUserId(session.id as number);

    const body = await req.json();
    const { title, url, visible, scheduledAt, scheduledEndAt } = body;

    if (!title || !url) {
      return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 });
    }

    // Validate schedule dates if provided
    if (scheduledAt && isNaN(new Date(scheduledAt).getTime())) {
      return NextResponse.json({ error: 'Invalid scheduledAt date format' }, { status: 400 });
    }
    if (scheduledEndAt && isNaN(new Date(scheduledEndAt).getTime())) {
      return NextResponse.json({ error: 'Invalid scheduledEndAt date format' }, { status: 400 });
    }
    if (scheduledAt && scheduledEndAt && new Date(scheduledEndAt) <= new Date(scheduledAt)) {
      return NextResponse.json({ error: 'scheduledEndAt must be after scheduledAt' }, { status: 400 });
    }

    const newLink = await db.insert(links).values({
      userId,
      title,
      url,
      visible: visible ?? true,
      position: 0, // Default position
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      scheduledEndAt: scheduledEndAt ? new Date(scheduledEndAt) : undefined,
    });

    return NextResponse.json({ success: true, id: newLink[0].insertId });
  } catch (error) {
    console.error('Failed to create link:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
