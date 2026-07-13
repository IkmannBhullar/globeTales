import { redirect } from "next/navigation";

import { SectionHeading } from "@/components/ui/section-heading";
import { getCurrentSession } from "@/lib/server/session";

export default async function ProfilePage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/auth/sign-in?next=/profile");
  }

  return (
    <div className="section-shell space-y-10 py-16">
      <SectionHeading
        eyebrow="Profile"
        title={`${session.name}, here is your travel identity at a glance.`}
        description="This lightweight profile page rounds out the MVP with a persistent signed-in surface for future travel preferences, avatar updates, and account-level trip settings."
      />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-panel rounded-[2rem] p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[color:var(--accent-secondary)]/30 text-2xl font-semibold">
              {session.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <p className="text-2xl font-semibold">{session.name}</p>
              <p className="text-[color:var(--muted)]">{session.email}</p>
            </div>
          </div>
        </div>
        <div className="paper-panel rounded-[2rem] p-6">
          <h2 className="section-title text-3xl font-semibold">What this profile will hold next</h2>
          <ul className="mt-5 space-y-3 text-[color:var(--muted)]">
            <li>Saved travel preferences for pace, hotels, and transport.</li>
            <li>Recently viewed countries and saved wishlists.</li>
            <li>Future profile image and personalization settings.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
