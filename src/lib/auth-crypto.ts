import crypto from 'crypto';

const SECRET_KEY = process.env.AUTH_SECRET || 'vaishno-video-vision-secret-key-2026-wedding-salt';

/**
 * Hash password using PBKDF2 with salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify password against stored hash
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(':')) {
    // Fallback for demo plain passwords
    return password === storedHash;
  }
  const [salt, originalHash] = storedHash.split(':');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return hash === originalHash;
}

/**
 * Create a simple signed session token (HMAC-SHA256)
 */
export function signSessionToken(payload: object): string {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(encodedPayload)
    .digest('base64url');
  return `${encodedPayload}.${signature}`;
}

/**
 * Verify and decode signed session token
 */
export function verifySessionToken<T = any>(token: string): T | null {
  try {
    if (!token || !token.includes('.')) return null;
    const [encodedPayload, signature] = token.split('.');

    const expectedSig = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(encodedPayload)
      .digest('base64url');

    if (signature !== expectedSig) {
      return null;
    }

    const jsonStr = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
    const data = JSON.parse(jsonStr);

    if (data.exp && Date.now() > data.exp) {
      return null; // Expired
    }

    return data as T;
  } catch (err) {
    return null;
  }
}
