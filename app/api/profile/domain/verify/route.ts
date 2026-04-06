import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { profiles } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { domain } = body;

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    // Validate domain format
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
    if (!domainRegex.test(domain)) {
      return NextResponse.json({ error: 'Invalid domain format' }, { status: 400 });
    }

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, session.userId as number),
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Generate a unique verification token
    const verificationToken = randomBytes(16).toString('hex');

    // Save the token and domain to the profile
    await db
      .update(profiles)
      .set({
        customDomain: domain,
        customDomainVerified: false,
        domainVerificationToken: verificationToken,
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, session.userId as number));

    return NextResponse.json({
      success: true,
      verificationToken,
      recordName: `_linknest.${domain}`,
      recordType: 'TXT',
      recordValue: verificationToken,
    });
  } catch (error) {
    console.error('Domain verification setup error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
