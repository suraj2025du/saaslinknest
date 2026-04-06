import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { profiles } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, session.userId as number),
  });

  return NextResponse.json({ 
    user: {
      ...session,
      profile: profile || null
    } 
  });
}
