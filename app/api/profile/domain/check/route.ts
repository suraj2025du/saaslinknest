import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { profiles } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import dns from 'dns';
import { promisify } from 'util';

const resolveTxt = promisify(dns.resolveTxt);

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, session.id as number),
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    if (!profile.customDomain || !profile.domainVerificationToken) {
      return NextResponse.json({
        verified: false,
        domain: profile.customDomain || null,
        message: 'No domain configured',
      });
    }

    const domain = profile.customDomain;
    const expectedToken = profile.domainVerificationToken;

    try {
      // Query TXT records for _linknest.domain
      const txtRecords = await resolveTxt(`_linknest.${domain}`);

      // Flatten the TXT records (each record is an array of strings)
      const flatRecords = txtRecords.map((record) => record.join(''));

      // Check if any record matches our verification token
      const isVerified = flatRecords.some((record) => record === expectedToken);

      if (isVerified) {
        // Update the profile to mark as verified
        await db
          .update(profiles)
          .set({
            customDomainVerified: true,
            updatedAt: new Date(),
          })
          .where(eq(profiles.userId, session.id as number));

        return NextResponse.json({
          verified: true,
          domain,
          message: 'Domain verified successfully',
        });
      }

      return NextResponse.json({
        verified: false,
        domain,
        message: 'TXT record not found or does not match',
        expectedRecord: `_linknest.${domain}`,
        expectedValue: expectedToken,
        foundRecords: flatRecords.length > 0 ? flatRecords : null,
      });
    } catch (dnsError: any) {
      // DNS lookup failed (record doesn't exist or DNS error)
      return NextResponse.json({
        verified: false,
        domain,
        message: 'TXT record not found. Please add the DNS record and try again.',
        expectedRecord: `_linknest.${domain}`,
        expectedValue: expectedToken,
      });
    }
  } catch (error) {
    console.error('Domain check error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
