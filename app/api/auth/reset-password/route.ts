import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq, and, gt } from 'drizzle-orm';
import { getIP, rateLimit } from '@/lib/rate-limit';
import { hashPassword } from '@/lib/auth';
import { z } from 'zod';

const resetSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const ip = await getIP();
    const { success, error } = await rateLimit(ip, 5); // 5 attempts per minute

    if (!success) {
      return NextResponse.json({ error }, { status: 429 });
    }

    const body = await req.json();
    const validated = resetSchema.parse(body);

    const user = await db.query.users.findFirst({
      where: and(
        eq(users.resetToken, validated.token),
        gt(users.resetTokenExpiry, new Date())
      ),
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(validated.password);

    await db.update(users)
      .set({
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Reset password error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
