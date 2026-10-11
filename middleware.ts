import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow auth endpoints and login page without restrictions
  if (
    pathname === '/admin/login' ||
    pathname === '/api/admin/auth/login' ||
    pathname === '/api/admin/auth/logout' ||
    pathname === '/api/admin/auth/session'
  ) {
    return NextResponse.next();
  }

  // Check for admin session cookies
  const devSession = request.cookies.get('changkeer_admin_session')?.value;
  
  // Check for Supabase session cookies (starts with sb- or contains access-token)
  const allCookies = request.cookies.getAll();
  const hasSupabaseAuthCookie = allCookies.some(
    (c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
  );

  const isAuthenticated = devSession === 'dev_authorized' || hasSupabaseAuthCookie;

  if (!isAuthenticated) {
    // If requesting an API route, return 401 JSON
    if (pathname.startsWith('/api/admin/')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Akses tidak sah. Silakan login sebagai administrator terlebih dahulu.',
        },
        { status: 401 }
      );
    }

    // If requesting an Admin page, redirect to login page
    if (pathname.startsWith('/admin')) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
