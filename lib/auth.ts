// Admin session: a cookie holding "<expiry>.<hmac>". Uses Web Crypto so the
// same code runs in proxy.ts and in server actions / route handlers.

export const SESSION_COOKIE = "admin_session";
export const SESSION_HOURS = 8;

function secret() {
  const s = process.env.ADMIN_SECRET;
  if (!s) throw new Error("ADMIN_SECRET is not set");
  return s;
}

async function hmac(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Buffer.from(sig).toString("base64url");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function checkAccessCode(code: string) {
  const expected = process.env.ADMIN_CODE;
  return !!expected && safeEqual(code, expected);
}

export async function createSession() {
  const exp = String(Date.now() + SESSION_HOURS * 3600_000);
  return `${exp}.${await hmac(exp)}`;
}

export async function verifySession(value: string | undefined) {
  if (!value) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return safeEqual(sig, await hmac(exp));
}
