const AUTH_SECRET = (process.env.CMS_AUTH_SECRET || '1072117993225937670c9523503baaabfaa6982ae6d34ec107156fa8f072b697').replace(/^["']|["']$/g, '').trim();
const COOKIE_NAME = 'ipa_cms_token';
const SESSION_MAX_AGE = parseInt(process.env.CMS_SESSION_MAX_AGE_SECONDS || '604800', 10); // 7 days default

export interface SessionUser {
  email: string;
  name: string;
  role: string;
  exp: number;
}

// Convert secret string to CryptoKey
async function getSigningKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(AUTH_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function base64UrlEncode(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function base64UrlDecodeToString(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return decodeURIComponent(
    atob(str)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

/**
 * Creates a signed JWT-like token using HMAC-SHA256 (Web Crypto)
 */
export async function createSessionToken(user: { email: string; name?: string; role?: string }): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload: SessionUser = {
    email: user.email,
    name: user.name || 'IPA Administrator',
    role: user.role || 'admin',
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  };

  const enc = new TextEncoder();
  const headerB64 = base64UrlEncode(enc.encode(JSON.stringify(header)));
  const payloadB64 = base64UrlEncode(enc.encode(JSON.stringify(payload)));
  const dataToSign = `${headerB64}.${payloadB64}`;

  const key = await getSigningKey();
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(dataToSign));
  const sigB64 = base64UrlEncode(signatureBuffer);

  return `${dataToSign}.${sigB64}`;
}

/**
 * Verifies a token's HMAC-SHA256 signature and expiration
 */
export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, sigB64] = parts;
    const dataToVerify = `${headerB64}.${payloadB64}`;

    const key = await getSigningKey();
    const enc = new TextEncoder();
    const expectedSigBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(dataToVerify));
    const expectedSigB64 = base64UrlEncode(expectedSigBuffer);

    if (!constantTimeEqual(sigB64, expectedSigB64)) {
      return null;
    }

    const payloadJson = base64UrlDecodeToString(payloadB64);
    const payload: SessionUser = JSON.parse(payloadJson);

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch (err) {
    console.error('[verifySessionToken] Error:', err);
    return null;
  }
}

/**
 * Validate credentials against environment variables or Prisma DB
 */
export async function validateCredentials(emailInput: string, passwordInput: string): Promise<{ success: boolean; user?: { email: string; name: string; role: string } }> {
  const envEmail = (process.env.CMS_USERNAME || 'ipa@gmail.com').replace(/^["']|["']$/g, '').trim();
  const envPassword = (process.env.CMS_PASSWORD || 'admin@123').replace(/^["']|["']$/g, '').trim();

  // Primary check: .env configuration
  if (envEmail && envPassword) {
    if (emailInput.trim().toLowerCase() === envEmail.toLowerCase() && passwordInput.trim() === envPassword) {
      return {
        success: true,
        user: {
          email: envEmail,
          name: 'Institute Administrator',
          role: 'superadmin',
        },
      };
    }
  }

  return { success: false };
}

export { COOKIE_NAME, SESSION_MAX_AGE };
