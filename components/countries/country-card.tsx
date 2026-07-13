import Link from "next/link";

import type { CountryContent } from "@/types/travel";

export function CountryCard({ country }: { country: CountryContent }) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-white/20 bg-white/45 shadow-xl shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/10 dark:bg-white/5">
      <div className="relative h-56 overflow-hidden">
        <img
          src={country.cardImage}
          alt={country.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-900">
          {country.flagEmoji} {country.continent}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="section-title text-3xl font-semibold text-white">{country.name}</h3>
          <p className="mt-1 text-sm text-white/80">{country.capital}</p>
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div className="flex flex-wrap gap-2 text-xs font-medium text-[color:var(--muted)]">
          <span className="rounded-full bg-white/50 px-3 py-1 dark:bg-white/10">{country.region}</span>
          <span className="rounded-full bg-white/50 px-3 py-1 dark:bg-white/10">{country.recommendedDuration}</span>
          <span className="rounded-full bg-white/50 px-3 py-1 dark:bg-white/10">${country.averageDailyBudget}/day</span>
        </div>
        <p className="text-sm leading-7 text-[color:var(--muted)]">{country.shortDescription}</p>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-[color:var(--navy)] dark:text-white">{country.budgetLevel}</p>
          <Link
            href={`/countries/${country.code}`}
            className="rounded-full bg-[color:var(--navy)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--accent-strong)]"
          >
            Explore Country
          </Link>
        </div>
      </div>
    </article>
  );
}
