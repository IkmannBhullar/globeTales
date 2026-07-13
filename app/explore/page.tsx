import { CountryExplorer } from "@/components/countries/country-explorer";
import { SectionHeading } from "@/components/ui/section-heading";

export default function ExplorePage() {
  return (
    <div className="section-shell space-y-10 py-16">
      <SectionHeading
        eyebrow="Explore"
        title="Find a country that fits your mood, budget, and travel pace."
        description="Search by city or country name, then narrow the field by region, travel style, climate, and how popular or under-the-radar you want the destination to feel."
      />
      <CountryExplorer />
    </div>
  );
}
