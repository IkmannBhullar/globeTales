"use client";

import { ArrowDown, ArrowUp, ImagePlus, Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { countries } from "@/lib/content/countries";
import { scrapbookSchema } from "@/lib/validation/scrapbook";
import { cn } from "@/lib/utils";

type ScrapbookFormValues = z.infer<typeof scrapbookSchema>;

const emptyEntry = (entryType: ScrapbookFormValues["entries"][number]["entryType"], sortOrder: number) => ({
  entryType,
  imageUrl: "",
  caption: "",
  journalText: "",
  city: "",
  location: "",
  restaurant: "",
  activity: "",
  entryDate: "",
  sortOrder
});

export function ScrapbookEditor({
  initialValue,
  itineraryOptions,
  scrapbookId
}: {
  initialValue: ScrapbookFormValues;
  itineraryOptions: Array<{ id: string; title: string }>;
  scrapbookId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateField<Key extends keyof ScrapbookFormValues>(key: Key, value: ScrapbookFormValues[Key]) {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  }

  function updateEntry(index: number, key: keyof ScrapbookFormValues["entries"][number], value: string | number) {
    setForm((current) => ({
      ...current,
      entries: current.entries.map((entry, entryIndex) =>
        entryIndex === index
          ? {
              ...entry,
              [key]: value
            }
          : entry
      )
    }));
  }

  function addEntry(entryType: ScrapbookFormValues["entries"][number]["entryType"]) {
    setForm((current) => ({
      ...current,
      entries: [...current.entries, emptyEntry(entryType, current.entries.length)]
    }));
  }

  function deleteEntry(index: number) {
    setForm((current) => ({
      ...current,
      entries: current.entries.filter((_, entryIndex) => entryIndex !== index).map((entry, nextIndex) => ({
        ...entry,
        sortOrder: nextIndex
      }))
    }));
  }

  function moveEntry(index: number, direction: "up" | "down") {
    setForm((current) => {
      const nextEntries = [...current.entries];
      const swapIndex = direction === "up" ? index - 1 : index + 1;

      if (swapIndex < 0 || swapIndex >= nextEntries.length) {
        return current;
      }

      [nextEntries[index], nextEntries[swapIndex]] = [nextEntries[swapIndex], nextEntries[index]];

      return {
        ...current,
        entries: nextEntries.map((entry, entryIndex) => ({
          ...entry,
          sortOrder: entryIndex
        }))
      };
    });
  }

  async function handleFileUpload(index: number, file: File | null) {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload image files only.");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setError("Images must be under 4MB for this MVP.");
      return;
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    updateEntry(index, "imageUrl", dataUrl);
  }

  function handleSave() {
    setError(null);

    startTransition(async () => {
      const parsed = scrapbookSchema.safeParse(form);

      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? "Please complete the scrapbook details.");
        return;
      }

      const response = await fetch(scrapbookId ? `/api/scrapbooks/${scrapbookId}` : "/api/scrapbooks", {
        method: scrapbookId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(parsed.data)
      });

      const json = (await response.json()) as { error?: string; scrapbookId?: string };

      if (!response.ok || !json.scrapbookId) {
        setError(json.error ?? "Unable to save scrapbook.");
        return;
      }

      router.push(`/scrapbooks/${json.scrapbookId}`);
      router.refresh();
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="glass-panel rounded-[2.5rem] p-6 sm:p-8">
        <div className="space-y-4">
          <Field label="Country">
            <select
              value={form.countryCode}
              onChange={(event) => updateField("countryCode", event.target.value)}
              className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Connected itinerary">
            <select
              value={form.itineraryId ?? ""}
              onChange={(event) => updateField("itineraryId", event.target.value)}
              className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5"
            >
              <option value="">No linked itinerary</option>
              {itineraryOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Trip title">
            <input
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5"
            />
          </Field>
          <Field label="Description">
            <textarea
              value={form.description ?? ""}
              onChange={(event) => updateField("description", event.target.value)}
              rows={4}
              className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Start date">
              <input
                type="date"
                value={form.startDate ?? ""}
                onChange={(event) => updateField("startDate", event.target.value)}
                className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5"
              />
            </Field>
            <Field label="End date">
              <input
                type="date"
                value={form.endDate ?? ""}
                onChange={(event) => updateField("endDate", event.target.value)}
                className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5"
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Layout">
              <select
                value={form.layoutType}
                onChange={(event) => updateField("layoutType", event.target.value as ScrapbookFormValues["layoutType"])}
                className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5"
              >
                <option value="GRID">Grid</option>
                <option value="COLLAGE">Collage</option>
                <option value="TIMELINE">Timeline</option>
              </select>
            </Field>
            <Field label="Trip rating">
              <input
                type="number"
                min={1}
                max={5}
                value={form.rating ?? ""}
                onChange={(event) => updateField("rating", event.target.value ? Number(event.target.value) : null)}
                className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5"
              />
            </Field>
            <Field label="Cover image URL">
              <input
                value={form.coverImage ?? ""}
                onChange={(event) => updateField("coverImage", event.target.value)}
                placeholder="https://..."
                className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5"
              />
            </Field>
          </div>
          <Field label="My favorite memory">
            <textarea
              value={form.favoriteMemory ?? ""}
              onChange={(event) => updateField("favoriteMemory", event.target.value)}
              rows={3}
              className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5"
            />
          </Field>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button type="button" onClick={() => addEntry("PHOTO")} className="gap-2">
            <ImagePlus className="h-4 w-4" />
            Add photo
          </Button>
          <Button type="button" variant="secondary" onClick={() => addEntry("JOURNAL")} className="gap-2">
            <Plus className="h-4 w-4" />
            Add journal entry
          </Button>
          <Button type="button" variant="secondary" onClick={() => addEntry("HIGHLIGHT")} className="gap-2">
            <Plus className="h-4 w-4" />
            Add highlight card
          </Button>
        </div>

        <div className="mt-8 space-y-4">
          {form.entries.map((entry, index) => (
            <article key={`${entry.entryType}-${index}`} className="rounded-[2rem] border border-[color:var(--border)] bg-white/35 p-5 dark:bg-white/5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--accent-strong)]">
                    {entry.entryType}
                  </p>
                  <p className="mt-1 text-lg font-semibold">Memory {index + 1}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="rounded-full bg-white/45 p-2 dark:bg-white/10" onClick={() => moveEntry(index, "up")} aria-label="Move entry up">
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button type="button" className="rounded-full bg-white/45 p-2 dark:bg-white/10" onClick={() => moveEntry(index, "down")} aria-label="Move entry down">
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button type="button" className="rounded-full bg-red-500/10 p-2 text-red-500" onClick={() => deleteEntry(index)} aria-label="Delete entry">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Field label="Image URL">
                  <input
                    value={entry.imageUrl ?? ""}
                    onChange={(event) => updateEntry(index, "imageUrl", event.target.value)}
                    placeholder="https://... or upload below"
                    className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5"
                  />
                </Field>
                <Field label="Upload image">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleFileUpload(index, event.target.files?.[0] ?? null)}
                    className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5"
                  />
                </Field>
                <Field label="Caption">
                  <input
                    value={entry.caption ?? ""}
                    onChange={(event) => updateEntry(index, "caption", event.target.value)}
                    className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5"
                  />
                </Field>
                <Field label="City">
                  <input
                    value={entry.city ?? ""}
                    onChange={(event) => updateEntry(index, "city", event.target.value)}
                    className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5"
                  />
                </Field>
                <Field label="Location">
                  <input
                    value={entry.location ?? ""}
                    onChange={(event) => updateEntry(index, "location", event.target.value)}
                    className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5"
                  />
                </Field>
                <Field label="Entry date">
                  <input
                    type="date"
                    value={entry.entryDate ?? ""}
                    onChange={(event) => updateEntry(index, "entryDate", event.target.value)}
                    className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5"
                  />
                </Field>
                <Field label="Favorite restaurant">
                  <input
                    value={entry.restaurant ?? ""}
                    onChange={(event) => updateEntry(index, "restaurant", event.target.value)}
                    className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5"
                  />
                </Field>
                <Field label="Favorite activity">
                  <input
                    value={entry.activity ?? ""}
                    onChange={(event) => updateEntry(index, "activity", event.target.value)}
                    className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5"
                  />
                </Field>
              </div>
              <Field label="Journal text">
                <textarea
                  value={entry.journalText ?? ""}
                  onChange={(event) => updateEntry(index, "journalText", event.target.value)}
                  rows={4}
                  className="mt-4 w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5"
                />
              </Field>
            </article>
          ))}
        </div>

        {error ? <p className="mt-5 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200">{error}</p> : null}

        <div className="mt-6">
          <Button type="button" onClick={handleSave} disabled={isPending} className="gap-2">
            <Save className="h-4 w-4" />
            {isPending ? "Saving..." : scrapbookId ? "Update scrapbook" : "Create scrapbook"}
          </Button>
        </div>
      </section>

      <section className="paper-panel rounded-[2.5rem] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--accent-strong)]">
          Preview summary
        </p>
        <h2 className="section-title mt-2 text-4xl font-semibold">{form.title || "Your scrapbook title"}</h2>
        <p className="mt-3 text-[color:var(--muted)]">{form.description || "Add a short summary to frame the mood of the trip."}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <SummaryStat label="Cities visited" value={String(new Set(form.entries.map((entry) => entry.city).filter(Boolean)).size)} />
          <SummaryStat label="Photos uploaded" value={String(form.entries.filter((entry) => entry.imageUrl).length)} />
          <SummaryStat label="Days traveled" value={form.startDate && form.endDate ? `${form.startDate} to ${form.endDate}` : "Not set"} />
          <SummaryStat label="Activities noted" value={String(form.entries.filter((entry) => entry.activity).length)} />
        </div>

        <div
          className={cn(
            "mt-8 grid gap-4",
            form.layoutType === "GRID" && "sm:grid-cols-2",
            form.layoutType === "COLLAGE" && "sm:grid-cols-2",
            form.layoutType === "TIMELINE" && "grid-cols-1"
          )}
        >
          {form.entries.map((entry, index) => (
            <div
              key={`${entry.entryType}-preview-${index}`}
              className={cn(
                "overflow-hidden rounded-[1.75rem] bg-white/55 p-4 shadow-lg dark:bg-white/5",
                form.layoutType === "COLLAGE" && index % 3 === 0 && "sm:col-span-2"
              )}
            >
              {entry.imageUrl ? (
                <img src={entry.imageUrl} alt={entry.caption || `Scrapbook memory ${index + 1}`} className="h-52 w-full rounded-[1.25rem] object-cover" />
              ) : null}
              <p className="mt-4 text-sm font-semibold">{entry.caption || entry.activity || entry.entryType}</p>
              <p className="mt-2 text-sm text-[color:var(--muted)]">
                {entry.journalText || entry.location || "Add notes, favorite meals, or memory details here."}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] bg-white/45 px-4 py-4 dark:bg-white/5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-strong)]">{label}</p>
      <p className="mt-2 text-sm font-medium">{value}</p>
    </div>
  );
}
