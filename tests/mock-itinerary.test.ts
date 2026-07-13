import { generateMockItinerary } from "@/lib/ai/mock-itinerary";

describe("generateMockItinerary", () => {
  it("returns the requested number of days", () => {
    const itinerary = generateMockItinerary({
      destinationCountry: "JPN",
      cities: ["Tokyo", "Kyoto"],
      startDate: "2026-05-10",
      endDate: "2026-05-16",
      numberOfDays: 7,
      numberOfTravelers: 2,
      approximateBudget: 3200,
      preferredPace: "Balanced",
      interests: ["Food", "History"]
    });

    expect(itinerary.days).toHaveLength(7);
    expect(itinerary.days[0].morning.title).toContain("Tokyo");
  });

  it("can replace a specific slot in the itinerary", () => {
    const current = generateMockItinerary({
      destinationCountry: "ITA",
      cities: ["Rome"],
      startDate: "2026-09-10",
      endDate: "2026-09-12",
      numberOfDays: 3,
      numberOfTravelers: 2,
      approximateBudget: 2600,
      preferredPace: "Balanced",
      interests: ["Food", "Art"]
    });

    const updated = generateMockItinerary({
      destinationCountry: "ITA",
      cities: ["Rome"],
      startDate: "2026-09-10",
      endDate: "2026-09-12",
      numberOfDays: 3,
      numberOfTravelers: 2,
      approximateBudget: 2600,
      preferredPace: "Balanced",
      interests: ["Food", "Art"],
      currentItinerary: current,
      adjustment: "Replace the lunch plan",
      targetDay: 1,
      targetSlot: "lunch"
    });

    expect(updated.days[0].lunch.title).toBe("Recommended lunch swap");
  });
});
