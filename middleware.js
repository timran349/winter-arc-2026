import { NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/progress', '/reviews', '/arc', '/onboarding'];

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('winter_arc_session_token')?.value;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/progress/:path*', '/reviews/:path*', '/arc/:path*', '/onboarding/:path*']
};
