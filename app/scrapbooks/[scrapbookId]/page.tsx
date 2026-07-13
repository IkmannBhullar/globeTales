import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { ScrapbookEditor } from "@/components/scrapbooks/scrapbook-editor";
import { SectionHeading } from "@/components/ui/section-heading";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/server/session";

export default async function ScrapbookDetailPage({
  params,
  searchParams
}: {
  params: { scrapbookId: string };
  searchParams: { edit?: string };
}) {
  const session = await getCurrentSession();

  if (!session) {
    redirect(`/auth/sign-in?next=/scrapbooks/${params.scrapbookId}`);
  }

  const scrapbook = await prisma.scrapbook.findFirst({
    where: {
      id: params.scrapbookId,
      userId: session.id
    },
    include: {
      country: true,
      entries: {
        orderBy: {
          sortOrder: "asc"
        }
      }
    }
  });

  if (!scrapbook) {
    notFound();
  }

  const itineraryOptions = await prisma.itinerary.findMany({
    where: { userId: session.id },
    select: {
      id: true,
      title: true
    }
  });

  if (searchParams.edit === "1") {
    return (
      <div className="section-shell space-y-10 py-16">
        <SectionHeading
          eyebrow="Edit Scrapbook"
          title={scrapbook.title}
          description="Update the cover, layout, entries, and favorite memory without losing the existing story structure."
        />
        <ScrapbookEditor
          scrapbookId={scrapbook.id}
          itineraryOptions={itineraryOptions}
          initialValue={{
            countryCode: scrapbook.country.code,
            itineraryId: scrapbook.itineraryId ?? "",
            title: scrapbook.title,
            description: scrapbook.description ?? "",
            coverImage: scrapbook.coverImage ?? "",
            startDate: scrapbook.startDate ? scrapbook.startDate.toISOString().slice(0, 10) : "",
            endDate: scrapbook.endDate ? scrapbook.endDate.toISOString().slice(0, 10) : "",
            layoutType: scrapbook.layoutType,
            rating: scrapbook.rating ?? 5,
            favoriteMemory: scrapbook.favoriteMemory ?? "",
            entries: scrapbook.entries.map((entry) => ({
              id: entry.id,
              entryType: entry.entryType,
              imageUrl: entry.imageUrl ?? "",
              caption: entry.caption ?? "",
              journalText: entry.journalText ?? "",
              city: entry.city ?? "",
              location: entry.location ?? "",
              restaurant: entry.restaurant ?? "",
              activity: entry.activity ?? "",
              entryDate: entry.entryDate ? entry.entryDate.toISOString().slice(0, 10) : "",
              sortOrder: entry.sortOrder
            }))
          }}
        />
      </div>
    );
  }

  const citiesVisited = new Set(scrapbook.entries.map((entry) => entry.city).filter(Boolean)).size;
  const photosUploaded = scrapbook.entries.filter((entry) => entry.imageUrl).length;
  const activitiesCompleted = scrapbook.entries.filter((entry) => entry.activity).length;

  return (
    <div className="section-shell space-y-10 py-16">
      <SectionHeading
        eyebrow="Scrapbook"
        title={scrapbook.title}
        description={scrapbook.description || `A digital travel journal from ${scrapbook.country.name}.`}
      />
      <div className="flex flex-wrap gap-3">
        <Link href={`/scrapbooks/${scrapbook.id}?edit=1`} className="rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white">
          Edit scrapbook
        </Link>
        <Link href="/scrapbooks" className="rounded-full border border-[color:var(--border)] px-5 py-3 text-sm font-semibold">
          Back to all scrapbooks
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Cities visited" value={String(citiesVisited)} />
        <SummaryCard label="Photos uploaded" value={String(photosUploaded)} />
        <SummaryCard label="Activities noted" value={String(activitiesCompleted)} />
        <SummaryCard label="Trip rating" value={scrapbook.rating ? `${scrapbook.rating}/5` : "Not rated"} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
        <aside className="glass-panel rounded-[2rem] p-6">
          {scrapbook.coverImage ? (
            <img src={scrapbook.coverImage} alt={scrapbook.title} className="h-72 w-full rounded-[1.5rem] object-cover" />
          ) : null}
          <div className="mt-5 space-y-3">
            <p className="text-sm font-semibold text-[color:var(--accent-strong)]">
              {scrapbook.country.flagEmoji} {scrapbook.country.name}
            </p>
            <p className="text-[color:var(--muted)]">{scrapbook.favoriteMemory || "Pick a favorite memory in edit mode to feature it here."}</p>
          </div>
        </aside>

        <section
          className={
            scrapbook.layoutType === "TIMELINE"
              ? "space-y-5"
              : scrapbook.layoutType === "COLLAGE"
                ? "grid gap-5 md:grid-cols-2"
                : "grid gap-5 md:grid-cols-2"
          }
        >
          {scrapbook.entries.map((entry, index) => (
            <article
              key={entry.id}
              className={`paper-panel overflow-hidden rounded-[2rem] p-4 ${
                scrapbook.layoutType === "COLLAGE" && index % 3 === 0 ? "md:col-span-2" : ""
              }`}
            >
              {entry.imageUrl ? (
                <img src={entry.imageUrl} alt={entry.caption || `Scrapbook entry ${index + 1}`} className="h-64 w-full rounded-[1.5rem] object-cover" />
              ) : null}
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--accent-strong)]">
                  {entry.entryType}
                </p>
                <h2 className="section-title text-3xl font-semibold">{entry.caption || entry.activity || `Memory ${index + 1}`}</h2>
                <p className="text-sm leading-7 text-[color:var(--muted)]">{entry.journalText || entry.location || "No journal text yet."}</p>
                <div className="flex flex-wrap gap-2 pt-2 text-xs font-medium text-[color:var(--muted)]">
                  {entry.city ? <span className="rounded-full bg-white/50 px-3 py-1 dark:bg-white/10">{entry.city}</span> : null}
                  {entry.restaurant ? <span className="rounded-full bg-white/50 px-3 py-1 dark:bg-white/10">{entry.restaurant}</span> : null}
                  {entry.entryDate ? <span className="rounded-full bg-white/50 px-3 py-1 dark:bg-white/10">{entry.entryDate.toLocaleDateString()}</span> : null}
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-panel rounded-[1.75rem] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-strong)]">{label}</p>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
    </div>
  );
}
