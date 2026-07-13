import { AuthForm } from "@/components/auth/auth-form";
// This is page for signin
export default function SignInPage({
  searchParams
}: {
  searchParams: { next?: string };
}) {
  return (
    <div className="section-shell grid min-h-[78vh] gap-8 py-16 lg:grid-cols-[1fr_0.95fr] lg:items-center">
      <div className="space-y-5">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[color:var(--accent-strong)]">
          Sign in
        </p>
        <h1 className="section-title text-6xl font-semibold leading-none">
          Pick up where your travel ideas left off.
        </h1>
        <p className="max-w-xl text-lg leading-8 text-[color:var(--muted)]">
          Saved itineraries, wishlist countries, scrapbook drafts, and your dashboard all come back the moment you sign in.
        </p>
      </div>
      <AuthForm mode="login" nextPath={searchParams.next ?? "/dashboard"} />
    </div>
  );
}
