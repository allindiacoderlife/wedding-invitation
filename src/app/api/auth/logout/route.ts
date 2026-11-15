import { NextResponse } from 'next/server';
import { clearAuthSession } from '@/lib/auth-server';

export async function POST() {
  try {
    await clearAuthSession();
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (err) {
    console.error('Logout error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to log out' },
      { status: 500 }
    );
  }
}
