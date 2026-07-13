import { z } from "zod";

import { activitySlots, interestOptions, travelPaces } from "@/types/travel";

export const itineraryRequestSchema = z.object({
  destinationCountry: z.string().min(2),
  cities: z.array(z.string().min(1)).min(1, "Choose at least one city."),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  numberOfDays: z.number().int().min(2).max(21),
  numberOfTravelers: z.number().int().min(1).max(12),
  approximateBudget: z.number().int().min(200).max(50000),
  preferredPace: z.enum(travelPaces),
  interests: z.array(z.enum(interestOptions)).min(1, "Choose at least one interest."),
  dietaryPreferences: z.string().optional().default(""),
  accessibilityNeeds: z.string().optional().default(""),
  transportationPreferences: z.string().optional().default(""),
  hotelPreference: z.string().optional().default(""),
  travelingWithChildren: z.boolean().optional().default(false),
  hiddenGems: z.boolean().optional().default(false),
  popularAttractions: z.boolean().optional().default(true),
  adjustment: z.string().optional(),
  currentItinerary: z
    .object({
      summary: z.string(),
      travelerProfile: z.string(),
      budgetBand: z.string(),
      notes: z.array(z.string()),
      shareText: z.string(),
      days: z.array(
        z.object({
          day: z.number(),
          title: z.string(),
          dateLabel: z.string(),
          city: z.string(),
          estimatedDailyCost: z.number(),
          transportationNotes: z.string(),
          travelTimeEstimate: z.string(),
          helpfulTip: z.string(),
          morning: z.object({
            title: z.string(),
            description: z.string(),
            location: z.string(),
            estimatedCost: z.number()
          }),
          lunch: z.object({
            title: z.string(),
            description: z.string(),
            location: z.string(),
            estimatedCost: z.number()
          }),
          afternoon: z.object({
            title: z.string(),
            description: z.string(),
            location: z.string(),
            estimatedCost: z.number()
          }),
          dinner: z.object({
            title: z.string(),
            description: z.string(),
            location: z.string(),
            estimatedCost: z.number()
          }),
          evening: z.object({
            title: z.string(),
            description: z.string(),
            location: z.string(),
            estimatedCost: z.number()
          })
        })
      )
    })
    .nullable()
    .optional(),
  targetDay: z.number().int().min(1).max(21).nullable().optional(),
  targetSlot: z.enum(activitySlots).nullable().optional()
});

const itineraryActivitySchema = z.object({
  title: z.string(),
  description: z.string(),
  location: z.string(),
  estimatedCost: z.number()
});

export const generatedItinerarySchema = z.object({
  summary: z.string(),
  travelerProfile: z.string(),
  budgetBand: z.string(),
  notes: z.array(z.string()),
  shareText: z.string(),
  days: z.array(
    z.object({
      day: z.number(),
      title: z.string(),
      dateLabel: z.string(),
      city: z.string(),
      morning: itineraryActivitySchema,
      lunch: itineraryActivitySchema,
      afternoon: itineraryActivitySchema,
      dinner: itineraryActivitySchema,
      evening: itineraryActivitySchema,
      transportationNotes: z.string(),
      travelTimeEstimate: z.string(),
      helpfulTip: z.string(),
      estimatedDailyCost: z.number()
    })
  )
});
