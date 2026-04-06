import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { links, teamMembers, profiles } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Resolve the effective user ID for link operations.
 */
async function resolveLinkUserId(sessionUserId: number): Promise<number> {
  const ownProfile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, sessionUserId),
  });

  if (ownProfile) {
    return sessionUserId;
  }

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
      return teamProfile.userId;
    }
  }

  return sessionUserId;
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderedIds } = await req.json();

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const linkUserId = await resolveLinkUserId(session.userId as number);

    // Update positions in a transaction
    await db.transaction(async (tx) => {
      for (let i = 0; i < orderedIds.length; i++) {
        await tx.update(links)
          .set({ position: i })
          .where(and(
            eq(links.id, orderedIds[i]),
            eq(links.userId, linkUserId)
          ));
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to reorder links:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
