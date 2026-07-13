export const interestOptions = [
  "Food",
  "History",
  "Nature",
  "Beaches",
  "Adventure",
  "Nightlife",
  "Shopping",
  "Art",
  "Photography",
  "Relaxation",
  "Family activities"
] as const;

export type TravelInterest = (typeof interestOptions)[number];

export const travelPaces = ["Relaxed", "Balanced", "Fast"] as const;
export type TravelPace = (typeof travelPaces)[number];

export const travelStyles = [
  "Culture",
  "Adventure",
  "Luxury",
  "Relaxed",
  "Family",
  "Romantic",
  "Food-forward",
  "Nature-led",
  "Photography"
] as const;
export type TravelStyle = (typeof travelStyles)[number];

export const budgetLevels = ["Value", "Mid-range", "Premium"] as const;
export type BudgetLevel = (typeof budgetLevels)[number];

export const climates = [
  "Temperate",
  "Mediterranean",
  "Tropical",
  "Alpine",
  "Desert",
  "Continental"
] as const;
export type Climate = (typeof climates)[number];

export const scrapbookLayouts = ["GRID", "COLLAGE", "TIMELINE"] as const;
export type ScrapbookLayout = (typeof scrapbookLayouts)[number];

export const activitySlots = ["morning", "lunch", "afternoon", "dinner", "evening"] as const;
export type ActivitySlot = (typeof activitySlots)[number];

export interface CountryContent {
  code: string;
  name: string;
  flagEmoji: string;
  shortDescription: string;
  description: string;
  capital: string;
  continent: string;
  region: string;
  currency: string;
  languages: string[];
  heroImage: string;
  cardImage: string;
  galleryImages: string[];
  averageDailyBudget: number;
  recommendedDuration: string;
  bestTimeToVisit: string;
  climate: Climate;
  budgetLevel: BudgetLevel;
  popularity: number;
  travelStyle: TravelStyle[];
  timeZones: string[];
  weatherNote: string;
  safetyNotes: string;
  visaDisclaimer: string;
  culturalEtiquette: string[];
  popularCities: string[];
  landmarks: string[];
  foods: string[];
  transportation: string[];
  activities: string[];
  sampleItineraries: Array<{
    title: string;
    summary: string;
  }>;
  scrapbookHighlights: string[];
}

export interface ItineraryActivity {
  title: string;
  description: string;
  location: string;
  estimatedCost: number;
}

export interface GeneratedItineraryDay {
  day: number;
  title: string;
  dateLabel: string;
  city: string;
  morning: ItineraryActivity;
  lunch: ItineraryActivity;
  afternoon: ItineraryActivity;
  dinner: ItineraryActivity;
  evening: ItineraryActivity;
  transportationNotes: string;
  travelTimeEstimate: string;
  helpfulTip: string;
  estimatedDailyCost: number;
}

export interface GeneratedItinerary {
  summary: string;
  travelerProfile: string;
  budgetBand: string;
  notes: string[];
  days: GeneratedItineraryDay[];
  shareText: string;
}

export interface ItineraryRequestInput {
  destinationCountry: string;
  cities: string[];
  startDate: string;
  endDate: string;
  numberOfDays: number;
  numberOfTravelers: number;
  approximateBudget: number;
  preferredPace: TravelPace;
  interests: TravelInterest[];
  dietaryPreferences?: string;
  accessibilityNeeds?: string;
  transportationPreferences?: string;
  hotelPreference?: string;
  travelingWithChildren?: boolean;
  hiddenGems?: boolean;
  popularAttractions?: boolean;
  adjustment?: string;
  currentItinerary?: GeneratedItinerary | null;
  targetDay?: number | null;
  targetSlot?: ActivitySlot | null;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  profileImage?: string | null;
}
