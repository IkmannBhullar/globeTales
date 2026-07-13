import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/server/session";

export async function POST(
  _request: Request,
  { params }: { params: { code: string } }
) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  try {
    const country = await prisma.country.findUnique({
      where: { code: params.code.toUpperCase() }
    });

    if (!country) {
      return NextResponse.json({ error: "Country not found." }, { status: 404 });
    }

    const existing = await prisma.savedCountry.findUnique({
      where: {
        userId_countryId: {
          userId: session.id,
          countryId: country.id
        }
      }
    });

    if (existing) {
      await prisma.savedCountry.delete({
        where: { id: existing.id }
      });

      return NextResponse.json({ saved: false });
    }

    await prisma.savedCountry.create({
      data: {
        userId: session.id,
        countryId: country.id
      }
    });

    await prisma.recentlyViewedCountry.upsert({
      where: {
        userId_countryId: {
          userId: session.id,
          countryId: country.id
        }
      },
      update: {
        viewedAt: new Date()
      },
      create: {
        userId: session.id,
        countryId: country.id
      }
    });

    return NextResponse.json({ saved: true });
  } catch {
    return NextResponse.json(
      { error: "Could not update your wishlist right now." },
      { status: 500 }
    );
  }
}
