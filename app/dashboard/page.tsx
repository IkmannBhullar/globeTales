import { redirect } from "next/navigation";

import { SectionHeading } from "@/components/ui/section-heading";
import { getDashboardData } from "@/lib/server/dashboard";
import { getCurrentSession } from "@/lib/server/session";

export default async function DashboardPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/auth/sign-in?next=/dashboard");
  }

  let dashboardData: Awaited<ReturnType<typeof getDashboardData>> | null = null;
  let hasError = false;

  try {
    dashboardData = await getDashboardData(session.id);
  } catch {
    hasError = true;
  }

  return (
    <div className="section-shell space-y-10 py-16">
      <SectionHeading
        eyebrow="Dashboard"
        title={`Welcome back, ${session.name}.`}
        description="See upcoming trips, saved countries, itinerary history, scrapbook progress, and a few fast-glance travel stats."
      />

      {hasError || !dashboardData ? (
        <div className="glass-panel rounded-[2rem] p-8">
          <h2 className="section-title text-3xl font-semibold">Database setup still needed.</h2>
          <p className="mt-3 text-[color:var(--muted)]">
            The signed-in experience is wired, but this dashboard needs your Prisma database running to show saved content.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Saved countries" value={String(dashboardData.savedCountries.length)} />
            <StatCard label="Saved itineraries" value={String(dashboardData.itineraries.length)} />
            <StatCard label="Scrapbooks" value={String(dashboardData.scrapbooks.length)} />
            <StatCard label="Favorite style" value={dashboardData.stats.favoriteTravelStyle} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="glass-panel rounded-[2rem] p-6">
              <h2 className="section-title text-3xl font-semibold">Upcoming trips</h2>
              <div className="mt-5 space-y-4">
                {dashboardData.itineraries.length ? (
                  dashboardData.itineraries.map((itinerary) => (
                    <div key={itinerary.id} className="rounded-[1.5rem] bg-white/35 p-4 dark:bg-white/5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold">
                            {itinerary.country.flagEmoji} {itinerary.title}
                          </p>
                          <p className="mt-1 text-sm text-[color:var(--muted)]">
                            {itinerary.startDate.toLocaleDateString()} to {itinerary.endDate.toLocaleDateString()}
                          </p>
                        </div>
                        <span className="rounded-full bg-white/40 px-3 py-1 text-xs font-medium dark:bg-white/10">
                          ${itinerary.budget}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[color:var(--muted)]">No saved trips yet. Try the AI planner to generate your first route.</p>
                )}
              </div>
            </div>

            <div className="paper-panel rounded-[2rem] p-6">
              <h2 className="section-title text-3xl font-semibold">Travel stats</h2>
              <div className="mt-6 grid gap-4">
                <StatCard label="Countries visited" value={String(dashboardData.stats.countriesVisited)} compact />
                <StatCard label="Total travel days" value={String(dashboardData.stats.totalTravelDays)} compact />
                <StatCard label="Recently viewed" value={String(dashboardData.recentlyViewed.length)} compact />
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="paper-panel rounded-[2rem] p-6">
              <h2 className="section-title text-3xl font-semibold">Wishlist countries</h2>
              <div className="mt-5 space-y-3">
                {dashboardData.savedCountries.length ? (
                  dashboardData.savedCountries.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-[1.5rem] bg-white/45 px-4 py-4 dark:bg-white/5">
                      <div>
                        <p className="font-semibold">
                          {item.country.flagEmoji} {item.country.name}
                        </p>
                        <p className="text-sm text-[color:var(--muted)]">{item.country.recommendedDuration}</p>
                      </div>
                      <span className="text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--accent-strong)]">
                        {item.country.budgetLevel}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-[color:var(--muted)]">Save countries from the detail pages to build your shortlist.</p>
                )}
              </div>
            </div>

            <div className="glass-panel rounded-[2rem] p-6">
              <h2 className="section-title text-3xl font-semibold">Scrapbooks</h2>
              <div className="mt-5 space-y-3">
                {dashboardData.scrapbooks.length ? (
                  dashboardData.scrapbooks.map((scrapbook) => (
                    <div key={scrapbook.id} className="rounded-[1.5rem] bg-white/35 px-4 py-4 dark:bg-white/5">
                      <p className="font-semibold">{scrapbook.title}</p>
                      <p className="mt-1 text-sm text-[color:var(--muted)]">
                        {scrapbook.country.name} • {scrapbook.entries.length} memories
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-[color:var(--muted)]">No scrapbooks yet. Start one from a country page or from your dashboard later.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  compact = false
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div className={`rounded-[1.75rem] ${compact ? "bg-white/35 dark:bg-white/5" : "glass-panel"} p-5`}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--accent-strong)]">{label}</p>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
    </div>
  );
}
