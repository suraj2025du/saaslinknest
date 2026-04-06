import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(`${process.env.APP_URL}/login?error=invalid-token`);
    }

    // Find user with this verification token
    const user = await db
      .select()
      .from(users)
      .where(eq(users.emailVerificationToken, token))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.redirect(`${process.env.APP_URL}/login?error=invalid-token`);
    }

    // Check if token is expired (24 hours)
    const tokenAge = Date.now() - new Date(user[0].createdAt!).getTime();
    if (tokenAge > 24 * 60 * 60 * 1000) {
      return NextResponse.redirect(`${process.env.APP_URL}/login?error=token-expired`);
    }

    // Mark email as verified
    await db
      .update(users)
      .set({
        emailVerified: true,
        emailVerificationToken: null,
      })
      .where(eq(users.id, user[0].id));

    return NextResponse.redirect(`${process.env.APP_URL}/dashboard?email-verified=true`);
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.redirect(`${process.env.APP_URL}/login?error=verification-failed`);
  }
}
