import { cookies } from 'next/headers';
import { User, SessionPayload } from '@/types/auth';
import { signSessionToken, verifySessionToken } from './auth-crypto';
import { userStore } from './user-store';

export const AUTH_COOKIE_NAME = 'vvv_auth_token';
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifySessionToken<SessionPayload>(token);
    if (!payload?.userId) return null;

    return userStore.findUserById(payload.userId) || null;
  } catch (err) {
    return null;
  }
}

export async function setAuthSession(user: User): Promise<string> {
  const cookieStore = await cookies();
  const exp = Date.now() + ONE_WEEK_MS;

  const token = signSessionToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    exp,
  });

  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });

  return token;
}

export async function clearAuthSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}
