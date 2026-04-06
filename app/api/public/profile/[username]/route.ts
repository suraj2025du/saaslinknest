import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { profiles, links, users } from '@/lib/schema';
import { eq, and, isNull, or, lte, gt } from 'drizzle-orm';

export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params;

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.username, username),
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const now = new Date();

    // Fetch visible links that respect scheduling:
    // - visible = true
    // - AND (scheduledAt IS NULL OR scheduledAt <= now)
    // - AND (scheduledEndAt IS NULL OR scheduledEndAt > now)
    const userLinks = await db.query.links.findMany({
      where: and(
        eq(links.userId, profile.userId),
        eq(links.visible, true),
        or(
          isNull(links.scheduledAt),
          lte(links.scheduledAt, now)
        ),
        or(
          isNull(links.scheduledEndAt),
          gt(links.scheduledEndAt, now)
        )
      ),
      orderBy: [links.position],
    });

    // Get user info
    const user = await db.query.users.findFirst({
      where: eq(users.id, profile.userId),
    });

    // Return links with password field (only indicating if protected, not the hash)
    const sanitizedLinks = userLinks.map(link => ({
      ...link,
      password: link.password ? true : null, // Only send boolean indicating protected
    }));

    return NextResponse.json({
      profile: {
        ...profile,
        name: user?.name || username,
      },
      links: sanitizedLinks,
    });
  } catch (error) {
    console.error('Failed to fetch public profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
