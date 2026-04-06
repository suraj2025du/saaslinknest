import { NextRequest, NextResponse } from 'next/server';
import { generateQRCode } from '@/lib/qr-code';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data } = body;

    if (!data) {
      return NextResponse.json({ error: 'Data is required' }, { status: 400 });
    }

    const qrCode = await generateQRCode(data);
    return NextResponse.json({ qrCode });
  } catch (error) {
    console.error('QR code generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}

// Public endpoint for profile QR codes
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');
    const url = searchParams.get('url');

    const data = url || (username ? `${process.env.APP_URL}/${username}` : null);

    if (!data) {
      return NextResponse.json(
        { error: 'Username or URL is required' },
        { status: 400 }
      );
    }

    const qrCode = await generateQRCode(data);
    return NextResponse.json({ qrCode });
  } catch (error) {
    console.error('QR code generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
