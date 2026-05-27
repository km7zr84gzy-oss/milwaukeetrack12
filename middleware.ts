import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require authentication.
// We use a lightweight cookie check here so we never pull bcrypt / full auth config into Edge runtime.
const protectedPaths = ['/dashboard'];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected) {
    // NextAuth v5 (JWT) commonly uses these cookie names
    const hasSession =
      request.cookies.has('authjs.session-token') ||
      request.cookies.has('__Secure-authjs.session-token') ||
      request.cookies.has('next-auth.session-token');

    if (!hasSession) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
