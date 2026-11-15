import { NextRequest, NextResponse } from 'next/server';
import { userStore } from '@/lib/user-store';
import { setAuthSession } from '@/lib/auth-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const authResult = userStore.authenticate(email, password);

    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { success: false, error: authResult.error || 'Authentication failed' },
        { status: 401 }
      );
    }

    // Set HTTP-only session cookie
    await setAuthSession(authResult.user);

    return NextResponse.json({
      success: true,
      user: authResult.user,
      message: 'Logged in successfully',
    });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error during login' },
      { status: 500 }
    );
  }
}
