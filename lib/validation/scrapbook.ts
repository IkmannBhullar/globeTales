import { z } from "zod";

import { scrapbookLayouts } from "@/types/travel";

const scrapbookEntrySchema = z.object({
  id: z.string().optional(),
  entryType: z.enum(["PHOTO", "JOURNAL", "HIGHLIGHT"]),
  imageUrl: z.string().optional().or(z.literal("")),
  caption: z.string().max(180).optional().or(z.literal("")),
  journalText: z.string().max(2000).optional().or(z.literal("")),
  city: z.string().max(100).optional().or(z.literal("")),
  location: z.string().max(120).optional().or(z.literal("")),
  restaurant: z.string().max(120).optional().or(z.literal("")),
  activity: z.string().max(120).optional().or(z.literal("")),
  entryDate: z.string().optional().or(z.literal("")),
  sortOrder: z.number().int().min(0)
});

export const scrapbookSchema = z.object({
  countryCode: z.string().min(2),
  itineraryId: z.string().optional().or(z.literal("")),
  title: z.string().min(3),
  description: z.string().max(600).optional().or(z.literal("")),
  coverImage: z.string().optional().or(z.literal("")),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  layoutType: z.enum(scrapbookLayouts),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  favoriteMemory: z.string().max(400).optional().or(z.literal("")),
  entries: z.array(scrapbookEntrySchema).min(1, "Add at least one memory entry.")
});
