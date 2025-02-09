import { NextResponse } from 'next/server';

export function middleware(request) {
  // Always allow health check endpoint
  if (request.nextUrl.pathname === '/api/health') {
    return NextResponse.next();
  }

  // Update the NEXTAUTH_URL if we're on Railway
  if (process.env.RAILWAY_STATIC_URL && !process.env.NEXTAUTH_URL) {
    process.env.NEXTAUTH_URL = `https://${process.env.RAILWAY_STATIC_URL}`;
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/health',
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 