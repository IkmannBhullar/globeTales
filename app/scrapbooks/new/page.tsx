import { redirect } from "next/navigation";

import { ScrapbookEditor } from "@/components/scrapbooks/scrapbook-editor";
import { SectionHeading } from "@/components/ui/section-heading";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/server/session";

export default async function NewScrapbookPage({
  searchParams
}: {
  searchParams: { country?: string };
}) {
  const session = await getCurrentSession();

  if (!session) {
    redirect(`/auth/sign-in?next=/scrapbooks/new${searchParams.country ? `?country=${searchParams.country}` : ""}`);
  }

  const itineraries = await prisma.itinerary.findMany({
    where: { userId: session.id },
    orderBy: {
      createdAt: "desc"
    },
    select: {
      id: true,
      title: true
    }
  });

  return (
    <div className="section-shell space-y-10 py-16">
      <SectionHeading
        eyebrow="Create Scrapbook"
        title="Turn a trip into a visual journal."
        description="Add photos, captions, city tags, journal entries, favorite restaurants, activities, and a standout memory that captures the trip at a glance."
      />
      <ScrapbookEditor
        itineraryOptions={itineraries}
        initialValue={{
          countryCode: searchParams.country ?? "ITA",
          itineraryId: "",
          title: "",
          description: "",
          coverImage: "",
          startDate: "",
          endDate: "",
          layoutType: "GRID",
          rating: 5,
          favoriteMemory: "",
          entries: [emptyEntry(0)]
        }}
      />
    </div>
  );
}

function emptyEntry(sortOrder: number) {
  return {
    entryType: "PHOTO" as const,
    imageUrl: "",
    caption: "",
    journalText: "",
    city: "",
    location: "",
    restaurant: "",
    activity: "",
    entryDate: "",
    sortOrder
  };
}
