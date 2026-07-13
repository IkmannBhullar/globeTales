import { generatedItinerarySchema } from "@/lib/validation/itinerary";
import type { ItineraryRequestInput } from "@/types/travel";

import { generateMockItinerary } from "./mock-itinerary";

function buildPrompt(input: ItineraryRequestInput) {
  return [
    "Create a detailed travel itinerary as JSON only.",
    "Match this JSON shape:",
    JSON.stringify({
      summary: "string",
      travelerProfile: "string",
      budgetBand: "string",
      notes: ["string"],
      shareText: "string",
      days: [
        {
          day: 1,
          title: "string",
          dateLabel: "string",
          city: "string",
          morning: {
            title: "string",
            description: "string",
            location: "string",
            estimatedCost: 20
          },
          lunch: {
            title: "string",
            description: "string",
            location: "string",
            estimatedCost: 20
          },
          afternoon: {
            title: "string",
            description: "string",
            location: "string",
            estimatedCost: 20
          },
          dinner: {
            title: "string",
            description: "string",
            location: "string",
            estimatedCost: 20
          },
          evening: {
            title: "string",
            description: "string",
            location: "string",
            estimatedCost: 20
          },
          transportationNotes: "string",
          travelTimeEstimate: "string",
          helpfulTip: "string",
          estimatedDailyCost: 120
        }
      ]
    }),
    "Use practical local notes, realistic pacing, and traveler-specific recommendations.",
    `Traveler request: ${JSON.stringify(input)}`
  ].join("\n");
}

export async function generateItinerary(input: ItineraryRequestInput) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      itinerary: generateMockItinerary(input),
      source: "mock" as const
    };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_ITINERARY_MODEL ?? "gpt-4o-mini",
        response_format: {
          type: "json_object"
        },
        messages: [
          {
            role: "system",
            content:
              "You are GlobeTales, a premium travel planner. Return valid JSON only. Keep recommendations practical, specific, and day-structured."
          },
          {
            role: "user",
            content: buildPrompt(input)
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
    };

    const message = payload.choices?.[0]?.message?.content;

    if (!message) {
      throw new Error("No itinerary returned from OpenAI.");
    }

    return {
      itinerary: generatedItinerarySchema.parse(JSON.parse(message)),
      source: "openai" as const
    };
  } catch {
    return {
      itinerary: generateMockItinerary(input),
      source: "mock" as const
    };
  }
}
