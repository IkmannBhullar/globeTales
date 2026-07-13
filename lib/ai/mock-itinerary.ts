import { addDays, differenceInCalendarDays, format } from "date-fns";

import { countries, findCountryByCode } from "@/lib/content/countries";
import type {
  ActivitySlot,
  CountryContent,
  GeneratedItinerary,
  ItineraryActivity,
  ItineraryRequestInput
} from "@/types/travel";

const fallbackCities = ["Old Town", "Creative Quarter", "Central Market", "Waterfront"];

function pickCountry(destinationCountry: string) {
  const exact = findCountryByCode(destinationCountry);

  if (exact) {
    return exact;
  }

  return (
    countries.find((country) => country.name.toLowerCase() === destinationCountry.toLowerCase()) ?? countries[0]
  );
}

function buildActivity(
  title: string,
  description: string,
  location: string,
  estimatedCost: number
): ItineraryActivity {
  return {
    title,
    description,
    location,
    estimatedCost
  };
}

function scaleCost(baseCost: number, adjustment?: string) {
  if (!adjustment) {
    return baseCost;
  }

  const normalized = adjustment.toLowerCase();

  if (normalized.includes("cheaper")) {
    return Math.max(12, Math.round(baseCost * 0.78));
  }

  if (normalized.includes("luxury")) {
    return Math.round(baseCost * 1.2);
  }

  return baseCost;
}

function selectCity(country: CountryContent, cities: string[], index: number) {
  return (
    cities[index % cities.length] ||
    country.popularCities[index % country.popularCities.length] ||
    fallbackCities[index % fallbackCities.length]
  );
}

function buildDay(
  country: CountryContent,
  input: ItineraryRequestInput,
  index: number,
  adjustment?: string
) {
  const city = selectCity(country, input.cities, index);
  const interest = input.interests[index % input.interests.length] ?? "Food";
  const landmark = country.landmarks[index % country.landmarks.length];
  const food = country.foods[index % country.foods.length];
  const activity = country.activities[index % country.activities.length];
  const date = addDays(new Date(input.startDate), index);
  const relaxed = adjustment?.toLowerCase().includes("relax");
  const hiddenGem = adjustment?.toLowerCase().includes("hidden");
  const restaurantBoost = adjustment?.toLowerCase().includes("restaurant");
  const extraAttractions = adjustment?.toLowerCase().includes("attraction");

  const morning = buildActivity(
    hiddenGem ? `Quiet ${city} neighborhood walk` : `${interest}-focused start in ${city}`,
    hiddenGem
      ? `Ease into the day with a locally loved corner of ${city}, stopping for coffee and a slower orientation loop.`
      : `Start with ${landmark.toLowerCase()} and a short guided introduction shaped around your interest in ${interest.toLowerCase()}.`,
    city,
    scaleCost(relaxed ? 18 : 28, adjustment)
  );

  const lunch = buildActivity(
    restaurantBoost ? `${food} tasting lunch` : `Lunch near ${city}`,
    restaurantBoost
      ? `Reserve a well-rated spot known for ${food.toLowerCase()} and ask for one signature regional dish.`
      : `Pause for a casual meal near your afternoon route to keep the pace smooth.`,
    `${city} dining district`,
    scaleCost(24, adjustment)
  );

  const afternoon = buildActivity(
    extraAttractions ? `${activity} plus one extra landmark` : activity,
    extraAttractions
      ? `Add a second stop after ${landmark} so the afternoon feels fuller without becoming rushed.`
      : `Spend the afternoon on ${activity.toLowerCase()} with enough flexibility for photos and short detours.`,
    landmark,
    scaleCost(relaxed ? 26 : 34, adjustment)
  );

  const dinner = buildActivity(
    restaurantBoost ? `Chef-picked dinner in ${city}` : `Dinner with regional flavors`,
    restaurantBoost
      ? `Choose a warm restaurant with standout service and a menu rooted in local specialties.`
      : `Finish the main day with one of the region's signature dishes in a comfortable setting.`,
    `${city} old quarter`,
    scaleCost(34, adjustment)
  );

  const evening = buildActivity(
    relaxed ? "Slow evening wind-down" : `${city} after-dark atmosphere`,
    relaxed
      ? `Keep the evening light with a scenic walk, tea, or rooftop lounge before an early return.`
      : `Close with a memorable evening experience that balances views, ambiance, and easy logistics back to your stay.`,
    `${city} central district`,
    scaleCost(relaxed ? 12 : 20, adjustment)
  );

  const estimatedDailyCost =
    morning.estimatedCost +
    lunch.estimatedCost +
    afternoon.estimatedCost +
    dinner.estimatedCost +
    evening.estimatedCost +
    Math.round(input.approximateBudget / Math.max(input.numberOfDays, 1) / 3);

  return {
    day: index + 1,
    title: `${city} Day ${index + 1}`,
    dateLabel: format(date, "EEE, MMM d"),
    city,
    morning,
    lunch,
    afternoon,
    dinner,
    evening,
    transportationNotes:
      input.transportationPreferences || country.transportation[index % country.transportation.length],
    travelTimeEstimate: relaxed ? "10 to 20 minutes between major stops" : "15 to 35 minutes between stops",
    helpfulTip: hiddenGem
      ? `Leave one hour unscheduled in ${city} so you can follow local recommendations as they come up.`
      : `Book the first anchor activity of the day in advance and keep the rest flexible.`,
    estimatedDailyCost
  };
}

function updateSpecificSlot(
  itinerary: GeneratedItinerary,
  targetDay: number,
  targetSlot: ActivitySlot,
  adjustment?: string
) {
  const day = itinerary.days.find((entry) => entry.day === targetDay);

  if (!day) {
    return itinerary;
  }

  const slotTitle =
    targetSlot === "morning"
      ? "Fresh local start"
      : targetSlot === "lunch"
        ? "Recommended lunch swap"
        : targetSlot === "afternoon"
          ? "Alternative afternoon plan"
          : targetSlot === "dinner"
            ? "New dinner reservation idea"
            : "Evening mood shift";

  const nextActivity = buildActivity(
    slotTitle,
    adjustment?.toLowerCase().includes("cheaper")
      ? "This replacement leans lighter on cost while keeping the experience memorable."
      : "A new option chosen to keep the itinerary fresh without disrupting the day's flow.",
    day.city,
    scaleCost(22, adjustment)
  );

  const nextDay = {
    ...day,
    [targetSlot]: nextActivity
  };

  return {
    ...itinerary,
    days: itinerary.days.map((entry) => (entry.day === targetDay ? nextDay : entry))
  };
}

export function generateMockItinerary(input: ItineraryRequestInput): GeneratedItinerary {
  const country = pickCountry(input.destinationCountry);
  const tripLength = Math.max(2, differenceInCalendarDays(new Date(input.endDate), new Date(input.startDate)) + 1);
  const days = Array.from({ length: Math.min(input.numberOfDays, tripLength) }, (_, index) =>
    buildDay(country, input, index, input.adjustment)
  );

  const itinerary: GeneratedItinerary = {
    summary: `${country.name} for ${days.length} days with a ${input.preferredPace.toLowerCase()} rhythm focused on ${input.interests
      .slice(0, 3)
      .join(", ")
      .toLowerCase()}.`,
    travelerProfile: `${input.numberOfTravelers} traveler${input.numberOfTravelers > 1 ? "s" : ""}, budget ${
      input.approximateBudget
    }, ${input.hotelPreference || "flexible stay style"}`,
    budgetBand:
      input.approximateBudget < 1800 ? "Value-conscious" : input.approximateBudget < 4500 ? "Comfortable mid-range" : "Premium flexibility",
    notes: [
      country.weatherNote,
      country.safetyNotes,
      input.accessibilityNeeds ? `Accessibility note: ${input.accessibilityNeeds}` : "Use walking breaks strategically in denser city areas."
    ],
    days,
    shareText: `Exploring ${country.name} with GlobeTales: ${days.length} days of ${input.interests[0].toLowerCase()}-forward moments.`
  };

  if (input.currentItinerary && input.targetDay && input.targetSlot) {
    return updateSpecificSlot(itinerary, input.targetDay, input.targetSlot, input.adjustment);
  }

  if (input.currentItinerary && input.targetDay) {
    const refreshed = buildDay(country, input, input.targetDay - 1, `${input.adjustment ?? ""} refreshed day`);

    return {
      ...itinerary,
      days: itinerary.days.map((entry) => (entry.day === input.targetDay ? refreshed : entry))
    };
  }

  return itinerary;
}
