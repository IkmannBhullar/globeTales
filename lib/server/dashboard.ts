import { prisma } from "@/lib/prisma";

export async function getDashboardData(userId: string) {
  const [savedCountries, itineraries, scrapbooks, recentlyViewed] = await Promise.all([
    prisma.savedCountry.findMany({
      where: { userId },
      include: {
        country: true
      },
      orderBy: {
        createdAt: "desc"
      }
    }),
    prisma.itinerary.findMany({
      where: { userId },
      include: {
        country: true
      },
      orderBy: {
        startDate: "asc"
      }
    }),
    prisma.scrapbook.findMany({
      where: { userId },
      include: {
        country: true,
        entries: true
      },
      orderBy: {
        updatedAt: "desc"
      }
    }),
    prisma.recentlyViewedCountry.findMany({
      where: { userId },
      include: {
        country: true
      },
      orderBy: {
        viewedAt: "desc"
      },
      take: 4
    })
  ]);

  const totalTravelDays = itineraries.reduce((sum, itinerary) => {
    const days = Math.max(
      1,
      Math.ceil((itinerary.endDate.getTime() - itinerary.startDate.getTime()) / (1000 * 60 * 60 * 24))
    );
    return sum + days;
  }, 0);

  const interestCounts = itineraries.flatMap((itinerary) => itinerary.interests).reduce<Record<string, number>>(
    (accumulator, interest) => {
      accumulator[interest] = (accumulator[interest] ?? 0) + 1;
      return accumulator;
    },
    {}
  );

  const favoriteTravelStyle =
    Object.entries(interestCounts).sort((left, right) => right[1] - left[1])[0]?.[0] ?? "Food";

  return {
    savedCountries,
    itineraries,
    scrapbooks,
    recentlyViewed,
    stats: {
      countriesVisited: new Set(scrapbooks.map((scrapbook) => scrapbook.countryId)).size,
      totalTravelDays,
      favoriteTravelStyle
    }
  };
}
