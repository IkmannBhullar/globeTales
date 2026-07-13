import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/server/session";
import { generatedItinerarySchema } from "@/lib/validation/itinerary";

const saveItinerarySchema = z.object({
  title: z.string().min(3),
  countryCode: z.string().min(2),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  travelerCount: z.number().int().min(1),
  budget: z.number().int().min(100),
  interests: z.array(z.string()).min(1),
  travelPreferences: z.record(z.any()),
  generatedContent: generatedItinerarySchema
});

export async function POST(request: Request) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ error: "Please sign in to save itineraries." }, { status: 401 });
  }

  try {
    const json = await request.json();
    const parsed = saveItinerarySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid itinerary payload." }, { status: 400 });
    }

    const country = await prisma.country.findUnique({
      where: { code: parsed.data.countryCode.toUpperCase() }
    });

    if (!country) {
      return NextResponse.json({ error: "Country not found." }, { status: 404 });
    }

    const itinerary = await prisma.itinerary.create({
      data: {
        userId: session.id,
        countryId: country.id,
        title: parsed.data.title,
        startDate: new Date(parsed.data.startDate),
        endDate: new Date(parsed.data.endDate),
        travelerCount: parsed.data.travelerCount,
        budget: parsed.data.budget,
        interests: parsed.data.interests,
        travelPreferences: parsed.data.travelPreferences,
        generatedContent: parsed.data.generatedContent
      }
    });

    return NextResponse.json({ itineraryId: itinerary.id });
  } catch {
    return NextResponse.json(
      { error: "We couldn't save that itinerary right now." },
      { status: 500 }
    );
  }
}
