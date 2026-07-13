import { PlannerWorkspace } from "@/components/planner/planner-workspace";
import { SectionHeading } from "@/components/ui/section-heading";

export default function PlannerPage({
  searchParams
}: {
  searchParams: { country?: string };
}) {
  return (
    <div className="section-shell space-y-10 py-16">
      <SectionHeading
        eyebrow="AI Planner"
        title="Build a structured itinerary with room to refine the details."
        description="Move through destination, dates, budget, interests, and travel preferences. GlobeTales then turns those inputs into an itinerary you can regenerate by day, swap activities inside, save, copy, share, or print."
      />
      <PlannerWorkspace initialCountry={searchParams.country} />
    </div>
  );
}
