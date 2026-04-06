import { db } from '@/lib/db';
import { analytics, users } from '@/lib/schema';
import { eq, count, and } from 'drizzle-orm';
import { sendEmail, milestoneEmail } from '@/lib/email';

export const MILESTONES = [
  { views: 100, label: 'First 100 Views!' },
  { views: 500, label: '500 Views Milestone!' },
  { views: 1000, label: '1,000 Views - Rising Star!' },
  { views: 5000, label: '5,000 Views - Superstar!' },
  { views: 10000, label: '10,000 Views - Influencer!' },
  { views: 50000, label: '50,000 Views - Legend!' },
] as const;

// Simple in-memory tracking for already-sent milestones (per process)
// Key: "userId:milestoneViews", Value: true
const sentMilestones = new Set<string>();

/**
 * Count total views for a user
 */
async function getUserViewCount(userId: number): Promise<number> {
  const result = await db
    .select({ count: count() })
    .from(analytics)
    .where(and(eq(analytics.userId, userId), eq(analytics.eventType, 'view')));

  return result[0]?.count || 0;
}

/**
 * Check if a user has hit any milestones based on current view count.
 * Returns the milestone reached, or null if none or already sent.
 */
export async function checkMilestones(
  userId: number,
  currentViews?: number
): Promise<{ views: number; label: string } | null> {
  const viewCount = currentViews ?? (await getUserViewCount(userId));

  for (const milestone of MILESTONES) {
    if (viewCount >= milestone.views) {
      const key = `${userId}:${milestone.views}`;
      // Skip if already sent
      if (sentMilestones.has(key)) {
        continue;
      }
      return milestone;
    }
  }

  return null;
}

/**
 * Send a milestone email to the user
 */
export async function sendMilestoneEmail(
  userId: number,
  milestone: { views: number; label: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    const userResult = await db
      .select({ name: users.name, email: users.email })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userResult.length === 0 || !userResult[0].email) {
      return { success: false, error: 'User not found or no email' };
    }

    const { name, email } = userResult[0];
    const emailTemplate = milestoneEmail(name || 'User', milestone.label);

    const result = await sendEmail({
      to: email,
      ...emailTemplate,
    });

    if (result.success) {
      // Mark as sent
      sentMilestones.add(`${userId}:${milestone.views}`);
    }

    return result;
  } catch (error) {
    console.error('Failed to send milestone email:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Track a milestone in analytics (log it as a special event)
 */
export async function trackMilestone(
  userId: number,
  milestone: { views: number; label: string }
): Promise<void> {
  try {
    // Log the milestone as a custom event in analytics
    await db.insert(analytics).values({
      userId,
      eventType: 'view' as any, // We'll use a note in referrer to mark it
      referrer: `milestone:${milestone.label}`,
      sessionId: `milestone_${milestone.views}`,
    });
  } catch (error) {
    console.error('Failed to track milestone:', error);
  }
}
