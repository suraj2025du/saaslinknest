import { NextResponse } from 'next/server';
import { getSession, hashPassword } from '@/lib/auth';
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

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, url, visible, position, scheduledAt, scheduledEndAt, password } = body;

    // Validate schedule dates if provided
    if (scheduledAt !== undefined && scheduledAt !== null && isNaN(new Date(scheduledAt).getTime())) {
      return NextResponse.json({ error: 'Invalid scheduledAt date format' }, { status: 400 });
    }
    if (scheduledEndAt !== undefined && scheduledEndAt !== null && isNaN(new Date(scheduledEndAt).getTime())) {
      return NextResponse.json({ error: 'Invalid scheduledEndAt date format' }, { status: 400 });
    }
    if (scheduledAt && scheduledEndAt && new Date(scheduledEndAt) <= new Date(scheduledAt)) {
      return NextResponse.json({ error: 'scheduledEndAt must be after scheduledAt' }, { status: 400 });
    }

    // Hash password if provided
    let hashedPassword: string | undefined = undefined;
    if (password !== undefined) {
      if (password === null) {
        hashedPassword = null as any; // Remove password
      } else if (typeof password === 'string' && password.length > 0) {
        hashedPassword = await hashPassword(password);
      }
    }

    const linkUserId = await resolveLinkUserId(session.userId as number);

    const result = await db.update(links)
      .set({
        title: title ?? undefined,
        url: url ?? undefined,
        visible: visible ?? undefined,
        position: position ?? undefined,
        password: hashedPassword,
        scheduledAt: scheduledAt !== undefined ? (scheduledAt ? new Date(scheduledAt) : null) : undefined,
        scheduledEndAt: scheduledEndAt !== undefined ? (scheduledEndAt ? new Date(scheduledEndAt) : null) : undefined,
        updatedAt: new Date(),
      })
      .where(and(
        eq(links.id, parseInt(id)),
        eq(links.userId, linkUserId)
      ));

    if (result[0].affectedRows === 0) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update link:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const linkUserId = await resolveLinkUserId(session.userId as number);

    const result = await db.delete(links)
      .where(and(
        eq(links.id, parseInt(id)),
        eq(links.userId, linkUserId)
      ));

    if (result[0].affectedRows === 0) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete link:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
