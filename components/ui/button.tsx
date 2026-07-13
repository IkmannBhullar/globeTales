import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

const baseStyles =
  "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

const variants = {
  primary:
    "bg-[color:var(--accent)] text-white shadow-lg shadow-orange-400/20 hover:-translate-y-0.5 hover:bg-[color:var(--accent-strong)]",
  secondary:
    "border border-[color:var(--border)] bg-white/40 text-[color:var(--foreground)] hover:-translate-y-0.5 hover:border-[color:var(--accent-secondary)] hover:bg-white/60 dark:bg-white/10 dark:hover:bg-white/15",
  ghost: "text-[color:var(--foreground)] hover:bg-white/30 dark:hover:bg-white/10"
} as const;

type Variant = keyof typeof variants;

export function buttonStyles(variant: Variant = "primary", className?: string) {
  return cn(baseStyles, variants[variant], className);
}

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={buttonStyles(variant, className)} {...props}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <button className={buttonStyles(variant, className)} {...props}>
      {children}
    </button>
  );
}
