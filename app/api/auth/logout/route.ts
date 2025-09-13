import { NextResponse } from 'next/server';

export async function POST() {
  // Create a response object to modify its headers
  const response = NextResponse.json({ success: true, message: 'Logout successful' });

  // Instruct the browser to delete the session cookie
  response.cookies.set('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0), // Set expiry date to the past
    path: '/',
    sameSite: 'lax',
  });

  return response;
}
