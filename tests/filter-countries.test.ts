import { filterCountries } from "@/lib/content/filter-countries";

describe("filterCountries", () => {
  it("filters countries by search input", () => {
    const results = filterCountries({
      search: "Japan",
      continent: "all",
      region: "all",
      travelStyle: "all",
      budgetLevel: "all",
      climate: "all",
      popularity: "any"
    });

    expect(results.map((country) => country.name)).toEqual(["Japan"]);
  });

  it("filters by popularity tier", () => {
    const results = filterCountries({
      search: "",
      continent: "all",
      region: "all",
      travelStyle: "all",
      budgetLevel: "all",
      climate: "all",
      popularity: "high"
    });

    expect(results.every((country) => country.popularity >= 92)).toBe(true);
  });
});
