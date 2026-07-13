"use client";

import { Bot, Sparkles, X } from "lucide-react";
import { useState } from "react";

import { ButtonLink } from "@/components/ui/button";

export function FloatingPlannerLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex max-w-sm flex-col items-end gap-3">
      {open ? (
        <div className="glass-panel w-[min(22rem,calc(100vw-2rem))] rounded-[1.75rem] p-5 text-sm shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--accent-strong)]">
                AI Travel Planner
              </p>
              <h3 className="mt-1 text-lg font-semibold">Need a route fast?</h3>
            </div>
            <button
              type="button"
              className="rounded-full p-2 text-[color:var(--muted)] hover:bg-white/10"
              onClick={() => setOpen(false)}
              aria-label="Close planner helper"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-[color:var(--muted)]">
            Open the full planner to generate a day-by-day itinerary, then save it or turn it into a scrapbook later.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <ButtonLink href="/planner?country=JPN" className="px-4 py-2 text-xs">
              Japan city loop
            </ButtonLink>
            <ButtonLink href="/planner?country=ITA" variant="secondary" className="px-4 py-2 text-xs">
              Italy slow escape
            </ButtonLink>
          </div>
        </div>
      ) : null}
      <button
        type="button"
        className="flex items-center gap-3 rounded-full bg-[color:var(--navy)] px-5 py-3 text-sm font-semibold text-white shadow-2xl shadow-slate-900/30 transition hover:-translate-y-0.5"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label="Open AI planner helper"
      >
        {open ? <Sparkles className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        Plan With AI
      </button>
    </div>
  );
}
