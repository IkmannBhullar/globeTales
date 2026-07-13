"use client";

import { useDeferredValue, useState } from "react";

import { countries } from "@/lib/content/countries";
import { filterCountries } from "@/lib/content/filter-countries";
import { climates, travelStyles } from "@/types/travel";

import { CountryCard } from "./country-card";

const popularityOptions = [
  { label: "Any popularity", value: "any" },
  { label: "Trending now", value: "high" },
  { label: "Hidden gems leaning", value: "emerging" }
] as const;

export function CountryExplorer({
  intro,
  limit
}: {
  intro?: React.ReactNode;
  limit?: number;
}) {
  const [search, setSearch] = useState("");
  const [continent, setContinent] = useState("all");
  const [region, setRegion] = useState("all");
  const [travelStyle, setTravelStyle] = useState("all");
  const [budgetLevel, setBudgetLevel] = useState("all");
  const [climate, setClimate] = useState("all");
  const [popularity, setPopularity] = useState("any");
  const deferredSearch = useDeferredValue(search);

  const continents = Array.from(new Set(countries.map((country) => country.continent)));
  const regions = Array.from(new Set(countries.map((country) => country.region)));
  const budgetLevels = Array.from(new Set(countries.map((country) => country.budgetLevel)));

  const filtered = filterCountries({
    search: deferredSearch,
    continent,
    region,
    travelStyle,
    budgetLevel,
    climate,
    popularity
  });

  const visibleCountries = typeof limit === "number" ? filtered.slice(0, limit) : filtered;

  return (
    <div className="space-y-8">
      {intro}
      <div className="glass-panel rounded-[2rem] p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-2 text-sm font-medium">
            Search countries
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Japan, food, Kyoto..."
              className="w-full rounded-2xl border border-[color:var(--border)] bg-white/50 px-4 py-3 outline-none ring-0 transition focus:border-[color:var(--accent)] dark:bg-white/5"
            />
          </label>
          <SelectField label="Continent" value={continent} onChange={setContinent} options={["all", ...continents]} />
          <SelectField label="Region" value={region} onChange={setRegion} options={["all", ...regions]} />
          <SelectField label="Travel style" value={travelStyle} onChange={setTravelStyle} options={["all", ...travelStyles]} />
          <SelectField label="Budget level" value={budgetLevel} onChange={setBudgetLevel} options={["all", ...budgetLevels]} />
          <SelectField label="Climate" value={climate} onChange={setClimate} options={["all", ...climates]} />
          <label className="space-y-2 text-sm font-medium">
            Popularity
            <select
              value={popularity}
              onChange={(event) => setPopularity(event.target.value)}
              className="w-full rounded-2xl border border-[color:var(--border)] bg-white/50 px-4 py-3 outline-none transition focus:border-[color:var(--accent)] dark:bg-white/5"
            >
              {popularityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <button
              type="button"
              className="w-full rounded-2xl border border-dashed border-[color:var(--accent)] px-4 py-3 text-sm font-semibold text-[color:var(--accent-strong)]"
              onClick={() => {
                setSearch("");
                setContinent("all");
                setRegion("all");
                setTravelStyle("all");
                setBudgetLevel("all");
                setClimate("all");
                setPopularity("any");
              }}
            >
              Reset filters
            </button>
          </div>
        </div>
      </div>

      {visibleCountries.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleCountries.map((country) => (
            <CountryCard key={country.code} country={country} />
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-[2rem] p-10 text-center">
          <h3 className="section-title text-3xl font-semibold">No routes matched that mix.</h3>
          <p className="mt-3 text-[color:var(--muted)]">
            Try widening the region or budget filter, or search by city instead.
          </p>
        </div>
      )}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="space-y-2 text-sm font-medium">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-[color:var(--border)] bg-white/50 px-4 py-3 outline-none transition focus:border-[color:var(--accent)] dark:bg-white/5"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "all" ? `All ${label.toLowerCase()}` : option}
          </option>
        ))}
      </select>
    </label>
  );
}
