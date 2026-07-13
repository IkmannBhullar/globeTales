import { NextResponse } from "next/server";

import { verifyPassword } from "@/lib/auth/password";
import { authCookieName, createSessionToken, getSessionCookieOptions } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = loginSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid sign-in details." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json({ error: "No account matched that email." }, { status: 404 });
    }

    const validPassword = await verifyPassword(parsed.data.password, user.passwordHash);

    if (!validPassword) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    const token = await createSessionToken({
      id: user.id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.set(authCookieName, token, getSessionCookieOptions());
    return response;
  } catch {
    return NextResponse.json(
      { error: "We couldn't sign you in right now." },
      { status: 500 }
    );
  }
}
