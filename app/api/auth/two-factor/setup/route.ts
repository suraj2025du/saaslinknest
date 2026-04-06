import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { generateTwoFactorSecret, generateQRCode, generateBackupCodes } from '@/lib/two-factor';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // Generate new secret and QR code
    const { secret, otpauthUrl } = generateTwoFactorSecret();
    const qrCode = await generateQRCode(otpauthUrl);
    const backupCodes = generateBackupCodes();

    // Temporarily store the secret and backup codes (they'll be saved after verification)
    // In production, you'd use Redis or similar for temporary storage
    // For now, we'll return them and save after verification
    return NextResponse.json({
      secret,
      qrCode,
      backupCodes,
      message: 'Scan the QR code and enter the verification code to enable 2FA',
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
