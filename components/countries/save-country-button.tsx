"use client";

import { Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

export function SaveCountryButton({
  countryCode,
  initialSaved
}: {
  countryCode: string;
  initialSaved: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      const response = await fetch(`/api/countries/${countryCode}/wishlist`, {
        method: "POST"
      });

      if (response.status === 401) {
        router.push(`/auth/sign-in?next=${pathname}`);
        return;
      }

      const json = (await response.json()) as { saved?: boolean };

      if (response.ok) {
        setSaved(Boolean(json.saved));
        router.refresh();
      }
    });
  }

  return (
    <Button
      type="button"
      variant="secondary"
      className="gap-2 border-white/25 bg-white/10 text-white hover:bg-white/15"
      onClick={handleToggle}
      disabled={isPending}
    >
      <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
      {saved ? "Saved to Wishlist" : "Add to Wishlist"}
    </Button>
  );
}
