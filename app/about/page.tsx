import { SectionHeading } from "@/components/ui/section-heading";

export default function AboutPage() {
  return (
    <div className="section-shell space-y-10 py-16">
      <SectionHeading
        eyebrow="About GlobeTales"
        title="A portfolio-ready travel product built around exploration, planning, and memory-keeping."
        description="GlobeTales is designed to feel less like a traditional booking site and more like a contemporary travel studio. The experience blends visual destination discovery, structured itinerary generation, and scrapbook-style storytelling in one cohesive product."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          {
            title: "Explore countries",
            body: "Country pages combine essential planning details with a richer sense of place, from food and etiquette to timing, weather notes, and suggested activities."
          },
          {
            title: "Plan with AI",
            body: "The itinerary planner turns traveler preferences into structured day-by-day plans that are easy to refine, save, copy, and share."
          },
          {
            title: "Keep the story",
            body: "Scrapbooks preserve the emotional side of travel with journal entries, location tags, favorite memories, and multiple visual layouts."
          }
        ].map((item) => (
          <div key={item.title} className="paper-panel rounded-[2rem] p-6">
            <h2 className="section-title text-3xl font-semibold">{item.title}</h2>
            <p className="mt-4 text-[color:var(--muted)]">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
