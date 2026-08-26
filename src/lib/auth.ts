import "server-only";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "portfolio_admin";
const MAX_AGE_S = 60 * 60 * 12;

function secret(): string {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) {
    throw new Error("AUTH_SECRET is missing or too short — see .env.example");
  }
  return value;
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/* ------------------------------------------------------------------ *
 * Password
 * ------------------------------------------------------------------ */

/** `salt:hash`, both hex. Produced by `npm run set-password`. */
export function hashPassword(password: string, salt = randomBytes(16).toString("hex")): string {
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, expected] = stored.split(":");
  if (!salt || !expected) return false;
  try {
    const derived = scryptSync(password, salt, 64).toString("hex");
    return safeEqual(derived, expected);
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ *
 * Session
 * ------------------------------------------------------------------ */

export async function createSession(): Promise<void> {
  const expires = Date.now() + MAX_AGE_S * 1000;
  const payload = b64url(JSON.stringify({ exp: expires }));
  const jar = await cookies();

  jar.set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_S,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  if (!safeEqual(signature, sign(payload))) return false;

  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

/**
 * Guard for every admin page *and* every server action. Layout-level checks
 * don't protect actions — actions are their own entry point into the app.
 */
export async function requireAuth(): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin/login");
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD_HASH && process.env.AUTH_SECRET);
}
