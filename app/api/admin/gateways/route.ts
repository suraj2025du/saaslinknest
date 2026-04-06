import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { paymentGateways } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { encryptSecret, decryptSecret, maskSecret } from '@/lib/encryption';

// GET: Get all payment gateways (SECRETS MASKED)
export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const gateways = await db.select().from(paymentGateways);

    // Mask secrets before sending to frontend
    const safeGateways = gateways.map(gw => ({
      ...gw,
      secretKey: maskSecret(gw.secretKey || ''),
      webhookSecret: maskSecret(gw.webhookSecret || ''),
    }));

    return NextResponse.json({ success: true, gateways: safeGateways });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Create or Update gateway (ENCRYPT SECRETS)
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { provider, isActive, publicKey, secretKey, webhookSecret } = body;

    if (!provider) {
      return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
    }

    // Encrypt secrets before storing
    const encryptedSecretKey = secretKey ? encryptSecret(secretKey) : null;
    const encryptedWebhookSecret = webhookSecret ? encryptSecret(webhookSecret) : null;

    // Check if exists
    const existing = await db.select().from(paymentGateways).where(eq(paymentGateways.provider, provider));

    if (existing.length > 0) {
      // Update
      await db.update(paymentGateways)
        .set({
          isActive,
          publicKey,
          secretKey: encryptedSecretKey,
          webhookSecret: encryptedWebhookSecret
        })
        .where(eq(paymentGateways.provider, provider));
    } else {
      // Insert
      await db.insert(paymentGateways).values({
        provider,
        isActive,
        publicKey,
        secretKey: encryptedSecretKey,
        webhookSecret: encryptedWebhookSecret
      });
    }

    return NextResponse.json({ success: true, message: 'Gateway saved securely (encrypted)' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Disable gateway
export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { provider } = await req.json();
    await db.update(paymentGateways).set({ isActive: false }).where(eq(paymentGateways.provider, provider));

    return NextResponse.json({ success: true, message: 'Gateway disabled' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// NOTE: Use decryptSecret from '@/lib/encryption' directly in other routes when needed.
// Do NOT export helper functions from route files to avoid Next.js build errors.
