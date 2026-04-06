import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, profiles } from '@/lib/schema';
import { hashPassword, setSession } from '@/lib/auth';
import { signupSchema } from '@/lib/validation';
import { eq } from 'drizzle-orm';
import { rateLimit, getIP } from '@/lib/rate-limit';
import { sendEmail, welcomeEmail, emailVerificationEmail } from '@/lib/email';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
  try {
    const ip = await getIP();
    const { success } = await rateLimit(ip, 3); // 3 attempts per minute

    if (!success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = await req.json();
    const { email, password, name } = signupSchema.parse(body);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const emailVerificationToken = randomUUID();

    const [result] = await db.insert(users).values({
      email,
      password: hashedPassword,
      name,
      loginMethod: 'email',
      role: 'user',
      emailVerificationToken,
    });

    const userId = result.insertId;
    await setSession({ userId, email, role: 'user' });

    // Send welcome email (fire and forget)
    const { subject, html, text } = welcomeEmail(name || email.split('@')[0]);
    sendEmail({ to: email, subject, html, text }).catch(err =>
      console.error('Failed to send welcome email:', err)
    );

    // Send email verification (fire and forget)
    const verificationUrl = `${process.env.APP_URL}/api/auth/verify-email?token=${emailVerificationToken}`;
    const { subject: verifySubject, html: verifyHtml, text: verifyText } = emailVerificationEmail(verificationUrl);
    sendEmail({ to: email, subject: verifySubject, html: verifyHtml, text: verifyText }).catch(err =>
      console.error('Failed to send verification email:', err)
    );

    return NextResponse.json({ success: true, userId });
  } catch (error: any) {
    console.error('Signup error:', error);
    if (error.code === 'ETIMEDOUT' || error.message?.includes('ETIMEDOUT')) {
      return NextResponse.json({
        error: 'Database connection timeout. Please check your database firewall/allowlist settings.'
      }, { status: 503 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
