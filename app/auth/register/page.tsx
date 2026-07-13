import { AuthForm } from "@/components/auth/auth-form";

export default function RegisterPage({
  searchParams
}: {
  searchParams: { next?: string };
}) {
  return (
    <div className="section-shell grid min-h-[78vh] gap-8 py-16 lg:grid-cols-[1fr_0.95fr] lg:items-center">
      <div className="space-y-5">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[color:var(--accent-strong)]">
          Register
        </p>
        <h1 className="section-title text-6xl font-semibold leading-none">
          Start planning with a travel profile that stays useful.
        </h1>
        <p className="max-w-xl text-lg leading-8 text-[color:var(--muted)]">
          Create an account to save countries, keep itineraries, and build scrapbook entries that stay tied to the trip they came from.
        </p>
      </div>
      <AuthForm mode="register" nextPath={searchParams.next ?? "/dashboard"} />
    </div>
  );
}
