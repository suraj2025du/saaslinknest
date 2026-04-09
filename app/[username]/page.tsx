import { Metadata } from 'next';
import { db } from '@/lib/db';
import { profiles, links, users } from '@/lib/schema';
import { eq, and, isNull, or, lte, gt } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import PublicProfileClient from '@/components/public/PublicProfileClient';

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;

  // Prevent generic file requests (like favicon.ico, .png, etc) from hitting the database
  if (username.includes('.')) {
    return { title: 'Profile Not Found' };
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.username, username),
  });

  if (!profile) return { title: 'Profile Not Found' };

  const user = await db.query.users.findFirst({
    where: eq(users.id, profile.userId),
  });

  const name = user?.name || username;
  const title = profile.seoTitle || `${name} | LinkNest`;
  const description = profile.seoDescription || profile.bio || `Check out ${name}'s links on LinkNest.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [profile.avatar || 'https://picsum.photos/seed/linknest-og/1200/630'],
      type: 'profile',
      username,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [profile.avatar || 'https://picsum.photos/seed/linknest-og/1200/630'],
    },
    keywords: profile.seoKeywords || 'link-in-bio, creator, smart links',
  };
}

export default async function PublicProfile({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  // Prevent generic file requests (like favicon.ico, .png, etc) from hitting the database
  if (username.includes('.')) {
    notFound();
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.username, username),
  });

  if (!profile) notFound();

  const now = new Date();

  // Filter links by scheduling: only show links within their scheduled window
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

  const user = await db.query.users.findFirst({
    where: eq(users.id, profile.userId),
  });

  const data = {
    profile: {
      ...profile,
      name: user?.name || username,
    },
    links: userLinks.map(link => ({
      ...link,
      password: link.password ? true : null, // Only send boolean indicating protected
    })),
  };

  return <PublicProfileClient profile={data.profile} links={data.links} />;
}
