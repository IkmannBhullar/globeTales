import Link from "next/link";

import { SectionHeading } from "@/components/ui/section-heading";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/server/session";

export default async function ScrapbooksPage() {
  const session = await getCurrentSession();
  let scrapbooks:
    | Array<{
        id: string;
        title: string;
        description: string | null;
        coverImage: string | null;
        country: { name: string; flagEmoji: string };
      }>
    | null = null;

  if (session) {
    try {
      scrapbooks = await prisma.scrapbook.findMany({
        where: { userId: session.id },
        include: {
          country: {
            select: {
              name: true,
              flagEmoji: true
            }
          }
        },
        orderBy: {
          updatedAt: "desc"
        }
      });
    } catch {
      scrapbooks = null;
    }
  }

  return (
    <div className="section-shell space-y-10 py-16">
      <SectionHeading
        eyebrow="Scrapbooks"
        title="Travel journals built from photos, notes, favorite meals, and memory details."
        description="Choose between grid, collage, and timeline layouts, then save the practical and emotional parts of a trip in one place."
      />

      <div className="flex flex-wrap gap-3">
        <Link href="/scrapbooks/new" className="rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white">
          Create scrapbook
        </Link>
        {!session ? (
          <Link href="/auth/sign-in?next=/scrapbooks" className="rounded-full border border-[color:var(--border)] px-5 py-3 text-sm font-semibold">
            Sign in to save yours
          </Link>
        ) : null}
      </div>

      {scrapbooks?.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {scrapbooks.map((scrapbook) => (
            <Link key={scrapbook.id} href={`/scrapbooks/${scrapbook.id}`} className="group overflow-hidden rounded-[2rem] border border-white/20 bg-white/45 shadow-xl transition hover:-translate-y-1 dark:bg-white/5">
              {scrapbook.coverImage ? (
                <img src={scrapbook.coverImage} alt={scrapbook.title} className="h-56 w-full object-cover transition duration-500 group-hover:scale-105" />
              ) : (
                <div className="flex h-56 items-center justify-center bg-[color:var(--navy)] text-white">
                  {scrapbook.country.flagEmoji}
                </div>
              )}
              <div className="p-5">
                <p className="text-sm font-semibold text-[color:var(--accent-strong)]">
                  {scrapbook.country.flagEmoji} {scrapbook.country.name}
                </p>
                <h2 className="section-title mt-3 text-3xl font-semibold">{scrapbook.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                  {scrapbook.description || "No description yet."}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "Polaroid-style photo cards",
              body: "Keep image-heavy memories front and center with softer paper textures and rounded frames."
            },
            {
              title: "Timeline travel journal",
              body: "Document each day with captions, favorite restaurants, location tags, and handwritten-style notes."
            },
            {
              title: "Favorite memory highlight",
              body: "Pin one standout moment so the scrapbook feels like more than a gallery export."
            }
          ].map((item) => (
            <div key={item.title} className="paper-panel rounded-[2rem] p-6">
              <h2 className="section-title text-3xl font-semibold">{item.title}</h2>
              <p className="mt-4 text-[color:var(--muted)]">{item.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
