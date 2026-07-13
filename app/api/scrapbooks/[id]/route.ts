import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/server/session";
import { scrapbookSchema } from "@/lib/validation/scrapbook";

function toOptionalDate(value?: string) {
  return value ? new Date(value) : null;
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  const scrapbook = await prisma.scrapbook.findFirst({
    where: {
      id: params.id,
      userId: session.id
    },
    include: {
      entries: true,
      country: true
    }
  });

  if (!scrapbook) {
    return NextResponse.json({ error: "Scrapbook not found." }, { status: 404 });
  }

  return NextResponse.json({ scrapbook });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  try {
    const json = await request.json();
    const parsed = scrapbookSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid scrapbook." }, { status: 400 });
    }

    const existing = await prisma.scrapbook.findFirst({
      where: {
        id: params.id,
        userId: session.id
      }
    });

    if (!existing) {
      return NextResponse.json({ error: "Scrapbook not found." }, { status: 404 });
    }

    const country = await prisma.country.findUnique({
      where: { code: parsed.data.countryCode.toUpperCase() }
    });

    if (!country) {
      return NextResponse.json({ error: "Country not found." }, { status: 404 });
    }

    await prisma.scrapbookEntry.deleteMany({
      where: {
        scrapbookId: existing.id
      }
    });

    const scrapbook = await prisma.scrapbook.update({
      where: { id: existing.id },
      data: {
        countryId: country.id,
        itineraryId: parsed.data.itineraryId || null,
        title: parsed.data.title,
        description: parsed.data.description || null,
        coverImage: parsed.data.coverImage || null,
        startDate: toOptionalDate(parsed.data.startDate),
        endDate: toOptionalDate(parsed.data.endDate),
        layoutType: parsed.data.layoutType,
        rating: parsed.data.rating ?? null,
        favoriteMemory: parsed.data.favoriteMemory || null,
        entries: {
          create: parsed.data.entries.map((entry) => ({
            entryType: entry.entryType,
            imageUrl: entry.imageUrl || null,
            caption: entry.caption || null,
            journalText: entry.journalText || null,
            city: entry.city || null,
            location: entry.location || null,
            restaurant: entry.restaurant || null,
            activity: entry.activity || null,
            entryDate: toOptionalDate(entry.entryDate),
            sortOrder: entry.sortOrder
          }))
        }
      }
    });

    return NextResponse.json({ scrapbookId: scrapbook.id });
  } catch {
    return NextResponse.json(
      { error: "Unable to update scrapbook right now." },
      { status: 500 }
    );
  }
}
