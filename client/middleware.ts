
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow requests for API routes, static files, and image optimization
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.gif') ||
    pathname.endsWith('.svg')
  ) {
    return NextResponse.next();
  }

  const isLoggedIn = req.cookies.get('isLoggedIn');

  if (!isLoggedIn && !['/login', '/patient', '/doctor'].includes(pathname)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isLoggedIn && (pathname === '/login' || pathname === '/patient' || pathname === '/doctor')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).+)',
  ],
};
