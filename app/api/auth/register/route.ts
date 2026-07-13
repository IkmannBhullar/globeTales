import { NextResponse } from "next/server";

import { createSessionToken, authCookieName, getSessionCookieOptions } from "@/lib/auth/session";
import { hashPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = registerSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid registration details." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.data.email.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json({ error: "An account already exists for that email." }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        passwordHash: await hashPassword(parsed.data.password),
        travelPreferences: {
          pace: "Balanced"
        }
      }
    });

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
      { error: "We couldn't create your account right now." },
      { status: 500 }
    );
  }
}
