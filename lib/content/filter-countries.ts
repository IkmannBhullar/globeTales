import type { CountryContent } from "@/types/travel";

import { countries } from "./countries";

export interface CountryFilterValues {
  search: string;
  continent: string;
  region: string;
  travelStyle: string;
  budgetLevel: string;
  climate: string;
  popularity: string;
}

export function filterCountries(filters: CountryFilterValues, source: CountryContent[] = countries) {
  return source.filter((country) => {
    const matchesSearch =
      !filters.search ||
      [country.name, country.capital, country.region, ...country.popularCities]
        .join(" ")
        .toLowerCase()
        .includes(filters.search.toLowerCase());
    const matchesContinent = filters.continent === "all" || country.continent === filters.continent;
    const matchesRegion = filters.region === "all" || country.region === filters.region;
    const matchesTravelStyle =
      filters.travelStyle === "all" || country.travelStyle.includes(filters.travelStyle as never);
    const matchesBudget = filters.budgetLevel === "all" || country.budgetLevel === filters.budgetLevel;
    const matchesClimate = filters.climate === "all" || country.climate === filters.climate;
    const matchesPopularity =
      filters.popularity === "any" ||
      (filters.popularity === "high" ? country.popularity >= 92 : country.popularity < 92);

    return (
      matchesSearch &&
      matchesContinent &&
      matchesRegion &&
      matchesTravelStyle &&
      matchesBudget &&
      matchesClimate &&
      matchesPopularity
    );
  });
}
