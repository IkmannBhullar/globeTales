import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl space-y-3", align === "center" && "mx-auto text-center", className)}>
      <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[color:var(--accent-strong)]">
        {eyebrow}
      </p>
      <h2 className="section-title text-4xl font-semibold leading-tight sm:text-5xl">{title}</h2>
      <p className="text-base leading-7 text-[color:var(--muted)] sm:text-lg">{description}</p>
    </div>
  );
}
