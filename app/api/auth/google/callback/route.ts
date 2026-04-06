import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { setSession } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.APP_URL}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();
    if (tokens.error) {
      throw new Error(tokens.error_description || tokens.error);
    }

    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const googleUser = await userResponse.json();

    // Find or create user
    let user = await db.query.users.findFirst({
      where: eq(users.email, googleUser.email),
    });

    if (!user) {
      const [result] = await db.insert(users).values({
        email: googleUser.email,
        name: googleUser.name,
        openId: googleUser.sub,
        loginMethod: 'google',
        role: 'user',
        emailVerified: true,
      });
      user = {
        id: result.insertId,
        email: googleUser.email,
        name: googleUser.name,
        openId: googleUser.sub,
        loginMethod: 'google',
        role: 'user' as const,
        password: null,
        stripeCustomerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
        resetToken: null,
        resetTokenExpiry: null,
        emailVerified: true,
        emailVerificationToken: null,
        twoFactorEnabled: false,
        twoFactorSecret: null,
        backupCodes: null,
        deletedAt: null,
      };
    } else {
      await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, user.id));
    }

    await setSession({ userId: user.id, email: user.email, role: user.role });

    return new NextResponse(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
              window.close();
            } else {
              window.location.href = '/dashboard';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error: any) {
    console.error('Google OAuth error:', error);
    if (error.code === 'ETIMEDOUT' || error.message?.includes('ETIMEDOUT')) {
      return new NextResponse(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'OAUTH_AUTH_ERROR', 
                  error: 'Database connection timeout. Please check your database firewall/allowlist settings.' 
                }, '*');
              }
            </script>
            <div style="font-family: sans-serif; padding: 20px; color: #ef4444;">
              <h1>Authentication Error</h1>
              <p>Database connection timeout. Please check your database firewall/allowlist settings.</p>
              <button onclick="window.close()">Close Window</button>
            </div>
          </body>
        </html>
      `, {
        status: 503,
        headers: { 'Content-Type': 'text/html' },
      });
    }
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
