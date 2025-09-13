import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  // Clear the session cookie
  cookies().delete('session');

  // Redirect to the login page
  return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
}
