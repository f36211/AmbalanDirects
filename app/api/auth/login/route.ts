import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const adminUser = process.env.ADMIN_USERNAME;
  const adminPass = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET;

  if (!adminUser || !adminPass || !jwtSecret) {
    console.error('Missing ADMIN_USERNAME, ADMIN_PASSWORD or JWT_SECRET in env');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  if (username === adminUser && password === adminPass) {
    const secret = new TextEncoder().encode(jwtSecret);
    const token = await new SignJWT({ username, role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h') // Extended session to 2 hours
      .sign(secret);

    const response = NextResponse.json({ success: true });
    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 2, // 2 hours
      path: '/',
      sameSite: 'lax',
    });

    return response;
  }

  return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
}

