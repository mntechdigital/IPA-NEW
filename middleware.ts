import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, COOKIE_NAME } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  const isLoginPage = pathname === '/login';
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isAdminApiRoute = pathname.startsWith('/api/admin');

  // Verify session if token exists
  const session = token ? await verifySessionToken(token) : null;

  // If visiting login page while already authenticated, redirect to dashboard
  if (isLoginPage) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // If visiting dashboard routes without valid session
  if (isDashboardRoute) {
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // If accessing admin APIs without valid session
  if (isAdminApiRoute) {
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/admin/:path*', '/login'],
};
