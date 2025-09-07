import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';

<<<<<<< HEAD
// Define the structure of the JWT payload for type safety.
interface JwtPayload {
  username: string;
  role: string;
  iat: number; // Issued at
  exp: number; // Expires at
=======
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
>>>>>>> b74a6056e9e3fdc1d0c9ddd4e10828d0df102964
}

/**
 * A helper function to safely get the JWT secret from environment variables.
 * Throws an error if the secret is not set, preventing runtime issues.
 * @returns {Uint8Array} The encoded secret key.
 */
const getJwtSecretKey = (): Uint8Array => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // This will cause the middleware to fail safely if the secret is missing.
    throw new Error('CRITICAL: JWT_SECRET environment variable is not defined.');
  }
  return new TextEncoder().encode(secret);
};


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('session')?.value;

  // --- Redirect logged-in users from the login page ---
  // If the user is trying to access the login page but already has a valid token,
  // redirect them directly to the admin dashboard.
  if (pathname === '/login') {
    if (sessionToken) {
      try {
        await jwtVerify(sessionToken, getJwtSecretKey());
        // Token is valid, redirect away from login.
        return NextResponse.redirect(new URL('/admin', request.url));
      } catch (error) {
        // Token is invalid (e.g., expired, malformed).
        // Clear the invalid cookie and let the user proceed to the login page.
        const response = NextResponse.next();
        response.cookies.delete('session');
        return response;
      }
    }
    return NextResponse.next();
  }


  // --- Protect all admin routes ---
  if (pathname.startsWith('/admin')) {
    if (!sessionToken) {
      // If no session token exists, redirect to the login page.
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // 1. Verify the incoming token.
      const { payload } = await jwtVerify<JwtPayload>(sessionToken, getJwtSecretKey());

      // 2. Token is valid. Now, refresh it to extend the user's session.
      // This creates a "sliding session" where the user stays logged in as long as they are active.
      const response = NextResponse.next();
      const newJwt = await new SignJWT({ username: payload.username, role: payload.role })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt() // Sets a new 'iat' (issued at) timestamp
          .setExpirationTime('2h') // Extends the expiration for another 2 hours from now
          .sign(getJwtSecretKey());
      
      // 3. Set the new, refreshed token in the response cookies.
      response.cookies.set('session', newJwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 2, // 2 hours
        path: '/',
        sameSite: 'lax',
      });
      
      // 4. Allow the request to proceed to the admin page with the refreshed token.
      return response;

    } catch (error) {
      // If token verification fails, the user is not authenticated.
      console.warn('JWT Verification Failed:', error instanceof Error ? error.message : 'Unknown error');
      
      // Redirect to the login page and explicitly delete the invalid cookie.
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('session');
      return response;
    }
  }

  // By default, allow all other requests to pass through.
  return NextResponse.next();
}


// Updated config to ensure the middleware runs on both the admin area
// and the login page to handle the logic correctly.
export const config = {
  matcher: ['/admin/:path*', '/login'],
};
