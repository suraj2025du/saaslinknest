import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getIP, rateLimit } from '@/lib/rate-limit';
import crypto from 'crypto';
import { sendEmail, passwordResetEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const ip = await getIP();
    const { success } = await rateLimit(ip, 3); // 3 attempts per minute

    if (!success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // We return success even if user doesn't exist for security (prevent email enumeration)
    if (!user) {
      return NextResponse.json({ success: true });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    await db.update(users)
      .set({ resetToken, resetTokenExpiry })
      .where(eq(users.id, user.id));

    // Send real reset email
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;
    const { subject, html, text } = passwordResetEmail(user.name || email.split('@')[0], resetUrl);
    await sendEmail({ to: email, subject, html, text });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Forgot password error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
