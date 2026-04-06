import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { profiles } from '@/lib/schema';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://linkne.st';

  // Static routes always available
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];

  // Try to fetch profiles, but don't fail if database is unavailable
  let profileUrls: MetadataRoute.Sitemap = [];
  try {
    const allProfiles = await db.query.profiles.findMany({
      columns: {
        username: true,
        updatedAt: true,
      },
    });

    profileUrls = allProfiles.map((profile) => ({
      url: `${baseUrl}/${profile.username}`,
      lastModified: profile.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    // Database not available during build - return static routes only
    console.warn('Could not fetch profiles for sitemap (database unavailable during build)');
  }

  return [...staticRoutes, ...profileUrls];
}
