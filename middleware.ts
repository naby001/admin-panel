import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';//
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/auth/signin' || path === '/auth/error';
  
  // Get the session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  // Redirect logic
  if (isPublicPath && token) {
    // If user is authenticated and trying to access public path, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  if (!isPublicPath && !token && !path.startsWith('/api')) {
    // If user is not authenticated and trying to access protected path, redirect to login
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/signin',
    '/auth/error',
  ],
}; 