import { ArrowRight, Compass, Sparkles } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";

import { InteractiveGlobe } from "./interactive-globe";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12">
      <div className="section-shell grid gap-14 pb-24 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/35 px-4 py-2 text-sm font-medium text-[color:var(--ink-soft)] dark:bg-white/10">
            <Sparkles className="h-4 w-4 text-[color:var(--accent-strong)]" />
            Interactive travel planning, story-first design
          </div>
          <div className="space-y-5">
            <h1 className="section-title max-w-3xl text-5xl font-semibold leading-none sm:text-6xl lg:text-7xl">
              Turn the world into your story.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[color:var(--muted)] sm:text-xl">
              Explore countries through rich guides, generate personalized itineraries with an AI planner, and turn favorite moments into polished digital scrapbooks.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/explore" className="gap-2">
              Explore the World
              <Compass className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/planner" variant="secondary" className="gap-2">
              Plan My Trip
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["12", "seeded countries"],
              ["AI", "day-by-day itinerary engine"],
              ["3", "scrapbook layouts"]
            ].map(([value, label]) => (
              <div key={label} className="rounded-[1.75rem] paper-panel px-5 py-4">
                <p className="text-2xl font-semibold text-[color:var(--navy)] dark:text-white">{value}</p>
                <p className="mt-1 text-sm text-[color:var(--muted)]">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <InteractiveGlobe />
        </div>
      </div>
    </section>
  );
}
