"use client";

import { Menu, Mountain, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button, ButtonLink, buttonStyles } from "@/components/ui/button";
import { navigationItems } from "@/lib/content/site";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/types/travel";

import { ThemeToggle } from "./theme-toggle";

export function SiteHeader({ initialSession }: { initialSession: SessionUser | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState(initialSession);
  const [isPending, startTransition] = useTransition();

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleLogout() {
    startTransition(async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      setSession(null);
      closeMenu();
      router.refresh();
    });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[color:var(--background)]/60 backdrop-blur-xl">
      <div className="section-shell flex items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-center gap-3 text-[color:var(--foreground)]">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--navy)] text-white shadow-lg shadow-slate-900/20">
            <Mountain className="h-5 w-5" />
          </span>
          <div>
            <div className="section-title text-2xl font-semibold">GlobeTales</div>
            <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted)]">Travel stories in motion</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navigationItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium text-[color:var(--muted)] hover:text-[color:var(--foreground)]",
                  active && "bg-white/40 text-[color:var(--foreground)] dark:bg-white/10"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          {session ? (
            <>
              <Link href="/profile" className="flex items-center gap-3 rounded-full px-3 py-2 hover:bg-white/20">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--accent-secondary)]/30 text-sm font-semibold text-[color:var(--foreground)]">
                  {session.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <span className="text-sm font-medium">{session.name}</span>
              </Link>
              <ButtonLink href="/dashboard" variant="secondary">
                Dashboard
              </ButtonLink>
              <Button type="button" variant="ghost" onClick={handleLogout} disabled={isPending}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <ButtonLink href="/auth/sign-in" variant="ghost">
                Sign In
              </ButtonLink>
              <ButtonLink href="/explore">Start Exploring</ButtonLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-white/35"
            onClick={() => setMenuOpen((current) => !current)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="section-shell pb-4 lg:hidden">
          <div className="glass-panel space-y-2 rounded-[1.75rem] p-4">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-2xl px-4 py-3 text-sm font-medium hover:bg-white/20"
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-3">
              {session ? (
                <div className="space-y-2">
                  <Link href="/dashboard" className={buttonStyles("secondary", "w-full")} onClick={closeMenu}>
                    Dashboard
                  </Link>
                  <button type="button" className={buttonStyles("ghost", "w-full")} onClick={handleLogout} disabled={isPending}>
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link href="/auth/sign-in" className={buttonStyles("secondary", "w-full")} onClick={closeMenu}>
                    Sign In
                  </Link>
                  <Link href="/explore" className={buttonStyles("primary", "w-full")} onClick={closeMenu}>
                    Start Exploring
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
