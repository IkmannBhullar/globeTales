import { cookies } from "next/headers";

import { authCookieName, verifySessionToken } from "@/lib/auth/session";

export async function getCurrentSession() {
  const token = cookies().get(authCookieName)?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}
