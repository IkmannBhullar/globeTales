import { notFound } from "next/navigation";

import { SaveCountryButton } from "@/components/countries/save-country-button";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { findCountryByCode } from "@/lib/content/countries";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/server/session";

const sectionLinks = [
  { label: "Overview", href: "#overview" },
  { label: "Attractions", href: "#attractions" },
  { label: "Food", href: "#food" },
  { label: "Itineraries", href: "#itineraries" },
  { label: "Travel Tips", href: "#travel-tips" },
  { label: "Scrapbooks", href: "#scrapbooks" }
] as const;

export default async function CountryDetailPage({
  params
}: {
  params: { countryCode: string };
}) {
  const country = findCountryByCode(params.countryCode);

  if (!country) {
    notFound();
  }

  const session = await getCurrentSession();
  let initialSaved = false;

  if (session) {
    try {
      const savedCountry = await prisma.savedCountry.findFirst({
        where: {
          userId: session.id,
          country: {
            code: country.code
          }
        }
      });

      initialSaved = Boolean(savedCountry);
    } catch {
      initialSaved = false;
    }
  }

  return (
    <div className="pb-16">
      <section className="relative min-h-[60vh] overflow-hidden">
        <img src={country.heroImage} alt={country.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--navy)] via-slate-950/50 to-slate-950/15" />
        <div className="section-shell relative z-10 flex min-h-[60vh] flex-col justify-end gap-6 py-16 text-white">
          <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            <span>{country.flagEmoji}</span>
            <span>{country.continent}</span>
            <span>{country.region}</span>
            <span>{country.bestTimeToVisit}</span>
          </div>
          <h1 className="section-title max-w-4xl text-5xl font-semibold sm:text-6xl">{country.name}</h1>
          <p className="max-w-3xl text-lg leading-8 text-white/82">{country.description}</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={`/planner?country=${country.code}`}>Generate My Itinerary</ButtonLink>
            <SaveCountryButton countryCode={country.code} initialSaved={initialSaved} />
            <ButtonLink href={`/scrapbooks/new?country=${country.code}`} variant="secondary" className="border-white/25 bg-white/10 text-white hover:bg-white/15">
              Create Scrapbook
            </ButtonLink>
          </div>
        </div>
      </section>

      <div className="section-shell mt-8 grid gap-8 lg:grid-cols-[16rem_1fr]">
        <aside className="glass-panel top-24 h-fit rounded-[2rem] p-5 lg:sticky">
          <nav className="space-y-2">
            {sectionLinks.map((link) => (
              <a key={link.href} href={link.href} className="block rounded-2xl px-4 py-3 text-sm font-medium hover:bg-white/10">
                {link.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="space-y-8">
          <section id="overview" className="glass-panel rounded-[2.5rem] p-8">
            <SectionHeading
              eyebrow="Overview"
              title={`${country.capital}, ${country.currency}, and the practical details that shape the trip.`}
              description="A clean summary of the essentials, balanced with useful local nuance so the page feels more like a thoughtful travel brief than a facts table."
            />
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[
                ["Capital", country.capital],
                ["Languages", country.languages.join(", ")],
                ["Time zone", country.timeZones.join(", ")],
                ["Daily budget", `$${country.averageDailyBudget}`],
                ["Recommended trip", country.recommendedDuration],
                ["Best time to visit", country.bestTimeToVisit]
              ].map(([label, value]) => (
                <div key={label} className="rounded-[1.5rem] bg-white/40 p-4 dark:bg-white/5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--accent-strong)]">{label}</p>
                  <p className="mt-2 text-base font-medium">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="attractions" className="paper-panel rounded-[2.5rem] p-8">
            <h2 className="section-title text-4xl font-semibold">Attractions and activities</h2>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold">Popular landmarks</h3>
                <ul className="mt-4 space-y-3 text-[color:var(--muted)]">
                  {country.landmarks.map((landmark) => (
                    <li key={landmark} className="rounded-2xl bg-white/45 px-4 py-3 dark:bg-white/5">
                      {landmark}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Suggested activities</h3>
                <ul className="mt-4 space-y-3 text-[color:var(--muted)]">
                  {country.activities.map((activity) => (
                    <li key={activity} className="rounded-2xl bg-white/45 px-4 py-3 dark:bg-white/5">
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section id="food" className="glass-panel rounded-[2.5rem] p-8">
            <h2 className="section-title text-4xl font-semibold">Food, cities, and photo-worthy details</h2>
            <div className="mt-6 grid gap-6 xl:grid-cols-3">
              <InfoListCard title="Popular cities" items={country.popularCities} />
              <InfoListCard title="Food recommendations" items={country.foods} />
              <InfoListCard title="Gallery highlights" items={country.scrapbookHighlights} />
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {country.galleryImages.map((image, index) => (
                <img key={image} src={image} alt={`${country.name} gallery ${index + 1}`} className="h-56 w-full rounded-[1.75rem] object-cover" />
              ))}
            </div>
          </section>

          <section id="itineraries" className="paper-panel rounded-[2.5rem] p-8">
            <h2 className="section-title text-4xl font-semibold">Sample itineraries</h2>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {country.sampleItineraries.map((itinerary) => (
                <div key={itinerary.title} className="rounded-[1.75rem] bg-white/55 p-5 dark:bg-white/5">
                  <h3 className="text-xl font-semibold">{itinerary.title}</h3>
                  <p className="mt-3 text-[color:var(--muted)]">{itinerary.summary}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="travel-tips" className="glass-panel rounded-[2.5rem] p-8">
            <h2 className="section-title text-4xl font-semibold">Travel tips and local notes</h2>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <InfoListCard title="Transportation" items={country.transportation} />
              <InfoListCard title="Cultural etiquette" items={country.culturalEtiquette} />
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <CalloutCard title="Weather" body={country.weatherNote} />
              <CalloutCard title="Safety" body={country.safetyNotes} />
              <CalloutCard title="Visa disclaimer" body={country.visaDisclaimer} />
            </div>
          </section>

          <section id="scrapbooks" className="paper-panel rounded-[2.5rem] p-8">
            <h2 className="section-title text-4xl font-semibold">Scrapbook-ready moments</h2>
            <p className="mt-4 max-w-3xl text-[color:var(--muted)]">
              GlobeTales scrapbooks are designed to hold more than photos. Save memory captions, city tags, favorite meals, and the moments you want to remember later.
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {country.scrapbookHighlights.map((highlight) => (
                <div key={highlight} className="stamp-outline rounded-[1.75rem] bg-white/55 px-4 py-5 text-sm font-medium dark:bg-white/5">
                  {highlight}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[1.75rem] bg-white/40 p-5 dark:bg-white/5">
      <h3 className="text-lg font-semibold">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm text-[color:var(--muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function CalloutCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[1.75rem] bg-white/40 p-5 dark:bg-white/5">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--accent-strong)]">{title}</p>
      <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{body}</p>
    </div>
  );
}
