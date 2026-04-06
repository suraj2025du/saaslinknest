import { db } from '@/lib/db';
import { teamMembers, profiles, users } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { sendEmail, teamInviteEmail } from '@/lib/email';
import crypto from 'crypto';

export type TeamRole = 'owner' | 'editor' | 'viewer';
export type TeamStatus = 'pending' | 'active' | 'revoked';

/**
 * Generate a cryptographically secure random invite token
 */
export function generateInviteToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Get the current user's team membership for a given profile
 */
export async function getTeamMembership(userId: number, profileId: number) {
  const membership = await db.query.teamMembers.findFirst({
    where: and(
      eq(teamMembers.userId, userId),
      eq(teamMembers.profileId, profileId),
      eq(teamMembers.status, 'active')
    ),
  });
  return membership || null;
}

/**
 * Check if a user has a specific role (or higher) for a profile
 * Role hierarchy: owner > editor > viewer
 */
export function hasRole(userRole: TeamRole | undefined, requiredRole: TeamRole): boolean {
  if (!userRole) return false;
  const hierarchy: Record<TeamRole, number> = { viewer: 0, editor: 1, owner: 2 };
  return hierarchy[userRole] >= hierarchy[requiredRole];
}

/**
 * Get team members for a profile (only active), with user info
 */
export async function getTeamMembersWithUsers(profileId: number) {
  const members = await db.query.teamMembers.findMany({
    where: and(
      eq(teamMembers.profileId, profileId),
      eq(teamMembers.status, 'active')
    ),
  });

  // Enrich with user data
  const enriched = await Promise.all(
    members.map(async (member) => {
      let userData = null;
      if (member.userId) {
        userData = await db.query.users.findFirst({
          where: eq(users.id, member.userId as number),
        });
      }
      return {
        ...member,
        user: userData,
      };
    })
  );

  return enriched;
}

/**
 * Get all team members including pending invites
 */
export async function getAllTeamMembers(profileId: number) {
  return db.query.teamMembers.findMany({
    where: eq(teamMembers.profileId, profileId),
  });
}

/**
 * Send an invite email to a team member
 */
export async function sendTeamInviteEmail(email: string, inviterName: string, profileName: string, acceptUrl: string) {
  const emailData = teamInviteEmail(inviterName, profileName, acceptUrl);
  return sendEmail({
    to: email,
    subject: emailData.subject,
    html: emailData.html,
    text: emailData.text,
  });
}

/**
 * Check if the current user can manage team members for a profile
 * Only owners can manage team members
 */
export async function canManageTeam(profileId: number, userId: number): Promise<boolean> {
  const membership = await getTeamMembership(userId, profileId);
  return membership?.role === 'owner';
}

/**
 * Get the profile that the current user owns (for team management)
 */
export async function getCurrentUserProfile(userId: number) {
  return db.query.profiles.findFirst({
    where: eq(profiles.userId, userId),
  });
}

/**
 * Find an existing invite by email for a profile
 */
export async function findExistingInvite(profileId: number, email: string) {
  return db.query.teamMembers.findFirst({
    where: and(
      eq(teamMembers.profileId, profileId),
      eq(teamMembers.email, email),
      eq(teamMembers.status, 'pending')
    ),
  });
}

/**
 * Find a team member by userId for a profile
 */
export async function findTeamMemberByUserId(profileId: number, userId: number) {
  return db.query.teamMembers.findFirst({
    where: and(
      eq(teamMembers.profileId, profileId),
      eq(teamMembers.userId, userId),
    ),
  });
}

/**
 * Find a team member by invite token
 */
export async function findTeamMemberByToken(token: string) {
  return db.query.teamMembers.findFirst({
    where: and(
      eq(teamMembers.inviteToken, token),
      eq(teamMembers.status, 'pending')
    ),
  });
}

/**
 * Check if a user has access to edit a profile (owner or editor)
 */
export async function canEditProfile(userId: number, profileId: number): Promise<boolean> {
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, profileId),
  });

  if (!profile) return false;

  // The owner always has access
  if (userId === profile.userId) return true;

  // Check team membership
  const membership = await getTeamMembership(userId, profileId);
  return membership !== null && hasRole(membership.role as TeamRole | undefined, 'editor');
}
