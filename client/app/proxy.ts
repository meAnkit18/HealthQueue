import { NextRequest, NextResponse } from 'next/server'

// Based on https://nextjs.org/docs/app/building-your-application/routing/middleware
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware for these paths
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico)$/)
  ) {
    return NextResponse.next();
  }

  const isLoggedIn = req.cookies.get('isLoggedIn');

  // Redirect to login if not authenticated (except for login page)
  if (!isLoggedIn && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Redirect to home if logged in user tries to access login page
  if (isLoggedIn && pathname === '/login') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

// Configure which paths trigger middleware
export const config = {
  matcher: [
    // Skip public files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};