import { hash } from "bcryptjs";
import { PrismaClient, ScrapbookEntryType, ScrapbookLayoutType } from "@prisma/client";

import { countries } from "@/lib/content/countries";

const prisma = new PrismaClient();

async function main() {
  const demoEmail = process.env.DEFAULT_DEMO_EMAIL ?? "demo@globetales.app";
  const demoPassword = process.env.DEFAULT_DEMO_PASSWORD ?? "TravelMore123!";

  const passwordHash = await hash(demoPassword, 10);

  const user = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {
      name: "Ava Explorer",
      passwordHash,
      travelPreferences: {
        pace: "Balanced",
        accommodation: "Boutique hotels",
        transportation: "Trains and short flights"
      }
    },
    create: {
      email: demoEmail,
      name: "Ava Explorer",
      passwordHash,
      profileImage:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      travelPreferences: {
        pace: "Balanced",
        accommodation: "Boutique hotels",
        transportation: "Trains and short flights"
      }
    }
  });

  await prisma.scrapbookEntry.deleteMany();
  await prisma.scrapbook.deleteMany();
  await prisma.itinerary.deleteMany();
  await prisma.savedCountry.deleteMany();
  await prisma.recentlyViewedCountry.deleteMany();
  await prisma.country.deleteMany();

  for (const country of countries) {
    await prisma.country.create({
      data: {
        code: country.code,
        name: country.name,
        flagEmoji: country.flagEmoji,
        capital: country.capital,
        continent: country.continent,
        region: country.region,
        currency: country.currency,
        languages: country.languages,
        description: country.description,
        shortDescription: country.shortDescription,
        heroImage: country.heroImage,
        cardImage: country.cardImage,
        galleryImages: country.galleryImages,
        averageDailyBudget: country.averageDailyBudget,
        recommendedDuration: country.recommendedDuration,
        bestTimeToVisit: country.bestTimeToVisit,
        climate: country.climate,
        budgetLevel: country.budgetLevel,
        popularity: country.popularity,
        travelStyle: country.travelStyle,
        timeZones: country.timeZones,
        weatherNote: country.weatherNote,
        safetyNotes: country.safetyNotes,
        visaDisclaimer: country.visaDisclaimer,
        culturalEtiquette: country.culturalEtiquette,
        popularCities: country.popularCities,
        attractions: country.landmarks,
        foods: country.foods,
        transportation: country.transportation,
        activities: country.activities,
        sampleItineraries: country.sampleItineraries,
        scrapbookHighlights: country.scrapbookHighlights
      }
    });
  }

  const japan = await prisma.country.findUniqueOrThrow({ where: { code: "JPN" } });
  const italy = await prisma.country.findUniqueOrThrow({ where: { code: "ITA" } });
  const morocco = await prisma.country.findUniqueOrThrow({ where: { code: "MAR" } });

  await prisma.savedCountry.createMany({
    data: [
      { userId: user.id, countryId: japan.id },
      { userId: user.id, countryId: italy.id },
      { userId: user.id, countryId: morocco.id }
    ]
  });

  await prisma.recentlyViewedCountry.createMany({
    data: [
      { userId: user.id, countryId: japan.id },
      { userId: user.id, countryId: italy.id },
      { userId: user.id, countryId: morocco.id }
    ]
  });

  const itinerary = await prisma.itinerary.create({
    data: {
      userId: user.id,
      countryId: japan.id,
      title: "Spring Lanterns in Japan",
      startDate: new Date("2026-04-12"),
      endDate: new Date("2026-04-18"),
      travelerCount: 2,
      budget: 4200,
      interests: ["Food", "Photography", "History"],
      travelPreferences: {
        pace: "Balanced",
        hiddenGems: true,
        hotelPreference: "Design hotel"
      },
      generatedContent: {
        summary: "A seven-day itinerary centered on Tokyo, Kyoto, and Osaka.",
        days: [
          {
            day: 1,
            title: "Tokyo Arrival",
            city: "Tokyo",
            morning: "Check in and take a gentle neighborhood walk in Shibuya.",
            lunch: "Try hand-cut udon in Harajuku.",
            afternoon: "Visit Meiji Shrine and Yoyogi Park.",
            dinner: "Reservation at a modern izakaya in Ebisu.",
            evening: "Golden hour photography from Shibuya Sky.",
            estimatedDailyCost: 240
          }
        ]
      }
    }
  });

  const scrapbook = await prisma.scrapbook.create({
    data: {
      userId: user.id,
      countryId: italy.id,
      itineraryId: itinerary.id,
      title: "Postcards from the Amalfi Coast",
      description: "A warm-weather journal of seaside mornings, lemon groves, and late dinners.",
      coverImage:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      startDate: new Date("2025-09-08"),
      endDate: new Date("2025-09-14"),
      layoutType: ScrapbookLayoutType.COLLAGE,
      rating: 5,
      favoriteMemory: "Watching the lights come on across Positano after dinner."
    }
  });

  await prisma.scrapbookEntry.createMany({
    data: [
      {
        scrapbookId: scrapbook.id,
        entryType: ScrapbookEntryType.PHOTO,
        imageUrl:
          "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=900&q=80",
        caption: "First glimpse of the cliffs at sunrise.",
        city: "Positano",
        location: "Spiaggia Grande",
        entryDate: new Date("2025-09-09"),
        sortOrder: 0
      },
      {
        scrapbookId: scrapbook.id,
        entryType: ScrapbookEntryType.JOURNAL,
        journalText:
          "We took the slow route between villages and left enough time for unplanned lemon granita stops.",
        city: "Amalfi",
        activity: "Scenic drive",
        restaurant: "Da Gemma",
        entryDate: new Date("2025-09-10"),
        sortOrder: 1
      },
      {
        scrapbookId: scrapbook.id,
        entryType: ScrapbookEntryType.HIGHLIGHT,
        imageUrl:
          "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80",
        caption: "Favorite boat day.",
        city: "Capri",
        location: "Marina Grande",
        activity: "Private boat tour",
        entryDate: new Date("2025-09-11"),
        sortOrder: 2
      }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
