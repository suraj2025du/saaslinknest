import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { comparePassword, setSession } from '@/lib/auth';
import { loginSchema } from '@/lib/validation';
import { eq } from 'drizzle-orm';
import { rateLimit, getIP } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    const ip = await getIP();
    const { success, error } = await rateLimit(ip, 5); // 5 attempts per minute

    if (!success) {
      return NextResponse.json({ error }, { status: 429 });
    }

    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      // Return a temporary token that requires 2FA verification
      const { signToken } = await import('@/lib/auth');
      const tempToken = await signToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        requires2FA: true
      });

      return NextResponse.json({
        success: true,
        requires2FA: true,
        tempToken,
        message: '2FA verification required'
      });
    }

    await setSession({ userId: user.id, email: user.email, role: user.role });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.code === 'ETIMEDOUT' || error.message?.includes('ETIMEDOUT')) {
      return NextResponse.json({
        error: 'Database connection timeout. Please check your database firewall/allowlist settings.'
      }, { status: 503 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
