import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, createSessionToken, COOKIE_NAME, SESSION_MAX_AGE } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const { success, user } = await validateCredentials(email, password);

    if (!success || !user) {
      return NextResponse.json(
        { error: 'Invalid email or password. Please verify your credentials.' },
        { status: 401 }
      );
    }

    const token = await createSessionToken(user);

    const response = NextResponse.json({
      success: true,
      user,
      message: 'Login successful',
    });

    // Determine if secure flag should be set on cookie (must be false on localhost/HTTP)
    const isHttps = request.nextUrl.protocol === 'https:' || request.headers.get('x-forwarded-proto') === 'https';
    const isProductionRemote = process.env.NODE_ENV === 'production' && !request.nextUrl.hostname.includes('localhost') && !request.nextUrl.hostname.includes('127.0.0.1');
    const secureCookie = isHttps || isProductionRemote;

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: secureCookie,
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error during login', details: error?.message, stack: error?.stack },
      { status: 500 }
    );
  }
}
