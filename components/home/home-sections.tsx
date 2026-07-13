import { Camera, MessageCircleHeart, NotebookPen, Sparkles } from "lucide-react";

import { featuredCountryCodes, findCountryByCode } from "@/lib/content/countries";
import { testimonials } from "@/lib/content/site";

import { CountryExplorer } from "../countries/country-explorer";
import { ButtonLink } from "../ui/button";
import { SectionHeading } from "../ui/section-heading";

const featuredCountries = featuredCountryCodes
  .map((code) => findCountryByCode(code))
  .filter((country): country is NonNullable<typeof country> => Boolean(country));

export function HomeSections() {
  return (
    <div className="space-y-24 pb-8">
      <section id="explore" className="section-shell">
        <CountryExplorer
          limit={6}
          intro={
            <SectionHeading
              eyebrow="Explore Countries"
              title="Search by vibe, budget, climate, and what kind of story you want to tell."
              description="Start broad with continents and regions, then refine by climate, budget, or travel style until the shortlist feels personal."
            />
          }
        />
      </section>

      <section className="section-shell grid gap-6 lg:grid-cols-3">
        {[
          {
            title: "Choose a country",
            description: "Browse rich destination cards, then drill into the details that actually shape a trip.",
            icon: Sparkles
          },
          {
            title: "Generate an itinerary",
            description: "Feed the AI your pace, dates, interests, budget, and hidden-gem preferences.",
            icon: MessageCircleHeart
          },
          {
            title: "Save trips and memories",
            description: "Turn your route into a scrapbook with photo cards, captions, notes, and favorite spots.",
            icon: NotebookPen
          }
        ].map((step, index) => (
          <div key={step.title} className="paper-panel rounded-[2rem] p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--navy)] text-white">
              <step.icon className="h-5 w-5" />
            </div>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--accent-strong)]">
              Step {index + 1}
            </p>
            <h3 className="section-title mt-3 text-3xl font-semibold">{step.title}</h3>
            <p className="mt-3 text-[color:var(--muted)]">{step.description}</p>
          </div>
        ))}
      </section>

      <section className="section-shell">
        <SectionHeading
          eyebrow="Featured Destinations"
          title="A few routes with especially strong mood."
          description="These spotlight trips are designed to feel immediate: visually rich, highly specific, and easy to imagine yourself inside."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {featuredCountries.map((country) => (
            <article key={country.code} className="group relative overflow-hidden rounded-[2.25rem]">
              <img src={country.heroImage} alt={country.name} className="h-[24rem] w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                  <span>{country.flagEmoji}</span>
                  <span>{country.continent}</span>
                  <span>{country.recommendedDuration}</span>
                </div>
                <h3 className="section-title mt-4 text-4xl font-semibold">{country.name}</h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-white/82">{country.shortDescription}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <ButtonLink href={`/countries/${country.code}`} className="bg-white text-slate-900 hover:bg-white/90">
                    Explore Country
                  </ButtonLink>
                  <ButtonLink href={`/planner?country=${country.code}`} variant="secondary" className="border-white/30 bg-white/10 text-white hover:bg-white/15">
                    Generate Itinerary
                  </ButtonLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-panel rounded-[2.5rem] p-8 sm:p-10">
          <SectionHeading
            eyebrow="AI Travel Planner"
            title="Structured itineraries that feel curated, not generic."
            description="The planner turns travel preferences into day-by-day cards with morning and evening pacing, restaurant suggestions, travel-time notes, and practical local tips."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "Budget-aware timelines",
              "Family and accessibility notes",
              "City-by-city pacing",
              "Hidden gems or headline highlights"
            ].map((feature) => (
              <div key={feature} className="rounded-[1.5rem] border border-white/15 bg-white/30 px-4 py-4 dark:bg-white/5">
                <p className="font-medium">{feature}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <ButtonLink href="/planner">Open Planner Workspace</ButtonLink>
          </div>
        </div>
        <div className="paper-panel relative overflow-hidden rounded-[2.5rem] p-8">
          <div className="absolute right-6 top-6 rounded-full border border-dashed border-[color:var(--accent)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--accent-strong)]">
            Preview
          </div>
          <h3 className="section-title text-3xl font-semibold">Travel Scrapbook</h3>
          <p className="mt-3 text-[color:var(--muted)]">
            Save favorite restaurants, city tags, journal entries, and photo memories in one polished journal.
          </p>
          <div className="mt-8 grid gap-4">
            {[
              "Polaroid-style photo stacks",
              "Passport stamp accents",
              "Timeline, collage, and grid views",
              "Favorite memory highlight cards"
            ].map((item, index) => (
              <div key={item} className="flex items-center gap-4 rounded-[1.5rem] bg-white/55 px-4 py-4 dark:bg-white/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--accent-secondary)]/25 font-semibold">
                  {index + 1}
                </div>
                <p className="text-sm font-medium">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-3 text-sm text-[color:var(--muted)]">
            <Camera className="h-4 w-4 text-[color:var(--accent-strong)]" />
            Designed to feel like a polished travel journal, not a file upload screen.
          </div>
        </div>
      </section>

      <section className="section-shell">
        <SectionHeading
          eyebrow="Traveler Notes"
          title="Realistic placeholder voices, grounded in the kind of trips people actually plan."
          description="The copy is intentionally portfolio-ready: detailed enough to feel believable, still flexible enough to evolve once real users arrive."
          align="center"
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="paper-panel rounded-[2rem] p-6">
              <p className="text-lg leading-8 text-[color:var(--ink-soft)] dark:text-[color:var(--ink-soft)]">
                “{testimonial.quote}”
              </p>
              <div className="mt-6">
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-[color:var(--muted)]">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell">
        <div className="glass-panel rounded-[2.75rem] px-6 py-10 text-center sm:px-10">
          <SectionHeading
            eyebrow="Final Call"
            title="Start with a destination. Leave with a trip, a plan, and a story."
            description="Create an account to save countries, keep itineraries, and build travel scrapbooks that stay useful after the trip ends."
            align="center"
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/auth/register">Create an Account</ButtonLink>
            <ButtonLink href="/planner" variant="secondary">
              Try the Planner
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
