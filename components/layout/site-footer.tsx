import { ButtonLink } from "@/components/ui/button";

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-24 border-t border-white/10 py-10">
      <div className="section-shell flex flex-col gap-8 rounded-[2rem] glass-panel px-6 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[color:var(--accent-strong)]">GlobeTales</p>
          <h2 className="section-title text-3xl font-semibold">Build trips worth remembering, then keep the story.</h2>
          <p className="text-[color:var(--muted)]">
            Explore thoughtful country guides, generate structured itineraries, and turn favorite moments into travel scrapbooks.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/planner">Plan My Trip</ButtonLink>
          <ButtonLink href="/scrapbooks" variant="secondary">
            Browse Scrapbooks
          </ButtonLink>
        </div>
      </div>
    </footer>
  );
}
