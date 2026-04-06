import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || 'fallback-secret-change-me');

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  const token = request.cookies.get('session')?.value;

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/signup');
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

  if (isDashboardPage || isAdminPage) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const { payload } = await jwtVerify(token, SECRET);

      // For admin pages, check if user has admin role
      if (isAdminPage && payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      return response;
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (isAuthPage && token) {
    try {
      await jwtVerify(token, SECRET);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (error) {
      return response;
    }
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/signup'],
};
