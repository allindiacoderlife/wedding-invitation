import { NextRequest, NextResponse } from 'next/server';
import { userStore } from '@/lib/user-store';
import { setAuthSession } from '@/lib/auth-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const result = userStore.createUser({ name, email, password, phone });

    if (!result.success || !result.user) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to create user' },
        { status: 400 }
      );
    }

    // Automatically log in newly registered user
    await setAuthSession(result.user);

    return NextResponse.json({
      success: true,
      user: result.user,
      message: 'Account created successfully',
    });
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error during registration' },
      { status: 500 }
    );
  }
}
