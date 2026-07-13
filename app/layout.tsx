import type { Metadata } from "next";
import type { ReactNode } from "react";

import { FloatingPlannerLauncher } from "@/components/layout/floating-planner-launcher";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getCurrentSession } from "@/lib/server/session";

import "./globals.css";

export const metadata: Metadata = {
  title: "GlobeTales",
  description: "Turn the world into your story with immersive country guides, AI itineraries, and digital travel scrapbooks."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await getCurrentSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="page-aura" aria-hidden="true" />
        <SiteHeader initialSession={session} />
        <main className="relative z-10">{children}</main>
        <SiteFooter />
        <FloatingPlannerLauncher />
      </body>
    </html>
  );
}
