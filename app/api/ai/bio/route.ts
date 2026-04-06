import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { generateBio } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    // SECURITY: Require authentication to prevent AI credit abuse
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { name, profession, interests, currentBio, context } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const result = await generateBio(name, profession || context, interests);

    if (result.error) {
      const status = result.error.includes('rate limit') ? 429 : 500;
      return NextResponse.json({ error: result.error }, { status });
    }

    // Ensure bio is within character limits (80-160)
    let bio = result.text.trim();
    if (bio.length > 160) {
      bio = bio.substring(0, 157) + '...';
    }

    return NextResponse.json({ bio });
  } catch (error) {
    console.error('Bio API Error:', error);
    return NextResponse.json({ error: 'Failed to generate bio' }, { status: 500 });
  }
}
