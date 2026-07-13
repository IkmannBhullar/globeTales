import { NextResponse } from "next/server";

import { generateItinerary } from "@/lib/ai/generate-itinerary";
import { itineraryRequestSchema } from "@/lib/validation/itinerary";

const windowMs = 60_000;
const maxRequests = 10;

const globalForRateLimit = globalThis as typeof globalThis & {
  plannerRequests?: Map<string, number[]>;
};

const requestBuckets = globalForRateLimit.plannerRequests ?? new Map<string, number[]>();

if (!globalForRateLimit.plannerRequests) {
  globalForRateLimit.plannerRequests = requestBuckets;
}

function getClientKey(request: Request) {
  return request.headers.get("x-forwarded-for") ?? request.headers.get("cf-connecting-ip") ?? "local";
}

function isRateLimited(clientKey: string) {
  const now = Date.now();
  const timestamps = (requestBuckets.get(clientKey) ?? []).filter((timestamp) => now - timestamp < windowMs);

  if (timestamps.length >= maxRequests) {
    requestBuckets.set(clientKey, timestamps);
    return true;
  }

  timestamps.push(now);
  requestBuckets.set(clientKey, timestamps);
  return false;
}

export async function POST(request: Request) {
  try {
    const clientKey = getClientKey(request);

    if (isRateLimited(clientKey)) {
      return NextResponse.json(
        { error: "Too many itinerary requests. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    const json = await request.json();
    const parsed = itineraryRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "We need a few more travel details before generating this route.",
          details: parsed.error.flatten()
        },
        { status: 400 }
      );
    }

    const result = await generateItinerary(parsed.data);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "The planner ran into a temporary issue. Please try again." },
      { status: 500 }
    );
  }
}
