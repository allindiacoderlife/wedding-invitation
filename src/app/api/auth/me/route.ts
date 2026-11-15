import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-server';

export async function GET() {
  try {
    const user = await getCurrentUser();
    return NextResponse.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error('Failed to get current user:', err);
    return NextResponse.json(
      { success: false, user: null },
      { status: 500 }
    );
  }
}
