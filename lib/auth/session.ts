import { SignJWT, jwtVerify } from "jose";

import type { SessionUser } from "@/types/travel";

export const authCookieName = "globetales_session";

const encoder = new TextEncoder();

function getJwtSecret() {
  return encoder.encode(process.env.JWT_SECRET ?? "globetales-dev-secret");
}

export async function createSessionToken(user: SessionUser) {
  return new SignJWT(user as SessionUser & Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifySessionToken(token: string) {
  const result = await jwtVerify(token, getJwtSecret());
  return result.payload as unknown as SessionUser;
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  };
}
