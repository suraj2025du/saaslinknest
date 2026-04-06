import { NextResponse } from 'next/server';
import { comparePassword } from '@/lib/auth';
import { db } from '@/lib/db';
import { links } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const link = await db.query.links.findFirst({
      where: eq(links.id, parseInt(id)),
      columns: {
        id: true,
        password: true,
        url: true,
      },
    });

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    if (!link.password) {
      return NextResponse.json({ error: 'Link is not password protected' }, { status: 400 });
    }

    const isValid = await comparePassword(password, link.password);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      url: link.url,
    });
  } catch (error) {
    console.error('Failed to verify link password:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
