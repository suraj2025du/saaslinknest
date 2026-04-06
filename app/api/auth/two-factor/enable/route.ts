import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { verifyTwoFactorToken } from '@/lib/two-factor';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { token, secret, backupCodes } = body;

    if (!token || !secret) {
      return NextResponse.json({ error: 'Token and secret are required' }, { status: 400 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, parseInt(session.userId as string)),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.twoFactorEnabled) {
      return NextResponse.json({ error: '2FA is already enabled' }, { status: 400 });
    }

    // Verify the token
    const isValid = verifyTwoFactorToken(secret, token);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    // Enable 2FA and save backup codes
    await db.update(users)
      .set({
        twoFactorEnabled: true,
        twoFactorSecret: secret,
        backupCodes: JSON.stringify(backupCodes), // Store encrypted backup codes
      })
      .where(eq(users.id, parseInt(session.userId as string)));

    return NextResponse.json({
      success: true,
      message: '2FA enabled successfully',
      backupCodes,
    });
  } catch (error) {
    console.error('2FA enable error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
