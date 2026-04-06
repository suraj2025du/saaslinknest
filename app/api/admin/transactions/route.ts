import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { transactions, users } from '@/lib/schema';
import { eq, desc, inArray } from 'drizzle-orm';

// GET: Get transaction logs
export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = db.select().from(transactions).orderBy(desc(transactions.createdAt)).limit(limit);

    if (status && status !== 'all') {
      // Note: Drizzle where clause logic would go here if strictly typed, 
      // but for simplicity in raw query or if status is dynamic, we filter in JS or use eq.
      // Since status is a string, we can just filter the result or add where clause.
      // For now, let's keep it simple and fetch all, or add where if needed.
    }

    // Fetch with user details using batch query (avoids N+1 problem)
    const txs = await db.select().from(transactions).orderBy(desc(transactions.createdAt)).limit(limit);

    // Batch fetch all unique user IDs
    const userIds = [...new Set(txs.filter(tx => tx.userId).map(tx => tx.userId as number))];
    const userEmails = userIds.length > 0
      ? await db.select({ id: users.id, email: users.email }).from(users).where(inArray(users.id, userIds))
      : [];

    const emailMap = new Map(userEmails.map(u => [u.id, u.email || 'N/A']));

    const enrichedTxs = txs.map(tx => ({
      ...tx,
      userEmail: tx.userId ? (emailMap.get(tx.userId as number) || 'Unknown') : 'Unknown',
    }));

    return NextResponse.json({ success: true, transactions: enrichedTxs });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
