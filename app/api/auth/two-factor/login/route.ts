import { NextResponse } from 'next/server';
import { verifyToken, setSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { verifyTwoFactorToken } from '@/lib/two-factor';
import { decryptSecret } from '@/lib/encryption';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tempToken, token } = body;

    if (!tempToken || !token) {
      return NextResponse.json({ error: 'Temporary token and 2FA token are required' }, { status: 400 });
    }

    // Verify the temporary token
    const payload = await verifyToken(tempToken);
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid or expired temporary token' }, { status: 401 });
    }

    if (!payload.requires2FA) {
      return NextResponse.json({ error: '2FA verification not required' }, { status: 400 });
    }

    // Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.id, parseInt(payload.userId as string)),
    });

    if (!user || !user.twoFactorSecret) {
      return NextResponse.json({ error: 'User not found or 2FA not enabled' }, { status: 404 });
    }

    // Decrypt stored secret before verification (SECURITY FIX C3)
    const decryptedSecret = decryptSecret(user.twoFactorSecret);
    const isValid = verifyTwoFactorToken(decryptedSecret, token);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid 2FA code' }, { status: 400 });
    }

    // Set full session
    await setSession({ userId: user.id, email: user.email, role: user.role });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
    console.error('2FA login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
