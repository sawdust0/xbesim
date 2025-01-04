import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const session = request.cookies.get('session')?.value;

  // Public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/register' || path === '/';

  if (!session && !isPublicPath) {
    // Store the original path for redirect after login
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(url);
  }

  // Prevent authenticated users from accessing login/register pages
  if (session && isPublicPath && path !== '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}; 