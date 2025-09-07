import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('session')?.value;
  const secret = process.env.JWT_SECRET;

  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // The secret key should be a Uint8Array.
    const secretKey = new TextEncoder().encode(secret);
    
    // Verify the JWT token.
    await jwtVerify(sessionToken, secretKey);
    
    // If verification is successful, allow the request to proceed.
    return NextResponse.next();
  } catch {
    // If verification fails, redirect to the login page.
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/admin/:path*',
};
