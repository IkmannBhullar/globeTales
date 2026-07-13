"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Copy, Printer, Save, Share2, Sparkles, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { countries } from "@/lib/content/countries";
import { plannerActions } from "@/lib/content/site";
import { itineraryRequestSchema } from "@/lib/validation/itinerary";
import { cn } from "@/lib/utils";
import { interestOptions, type ActivitySlot, type GeneratedItinerary, type ItineraryRequestInput } from "@/types/travel";

const plannerSteps = [
  { id: "destination", title: "Destination" },
  { id: "dates", title: "Dates and travelers" },
  { id: "budget", title: "Budget" },
  { id: "interests", title: "Interests" },
  { id: "preferences", title: "Travel preferences" },
  { id: "review", title: "Review and generate" }
] as const;

const stepFields: Record<number, Array<keyof ItineraryRequestInput>> = {
  0: ["destinationCountry", "cities"],
  1: ["startDate", "endDate", "numberOfDays", "numberOfTravelers"],
  2: ["approximateBudget"],
  3: ["interests"],
  4: ["preferredPace"],
  5: []
};

export function PlannerWorkspace({ initialCountry }: { initialCountry?: string }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [plannerError, setPlannerError] = useState<string | null>(null);
  const [cityInput, setCityInput] = useState("");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isActionPending, startActionTransition] = useTransition();

  const form = useForm<ItineraryRequestInput>({
    resolver: zodResolver(itineraryRequestSchema),
    defaultValues: {
      destinationCountry: initialCountry ?? "JPN",
      cities: initialCountry ? (countries.find((country) => country.code === initialCountry)?.popularCities.slice(0, 2) ?? ["Tokyo", "Kyoto"]) : ["Tokyo", "Kyoto"],
      startDate: "2026-05-10",
      endDate: "2026-05-16",
      numberOfDays: 7,
      numberOfTravelers: 2,
      approximateBudget: 3200,
      preferredPace: "Balanced",
      interests: ["Food", "History", "Photography"],
      dietaryPreferences: "",
      accessibilityNeeds: "",
      transportationPreferences: "",
      hotelPreference: "Boutique hotel",
      travelingWithChildren: false,
      hiddenGems: true,
      popularAttractions: true,
      adjustment: "",
      currentItinerary: null,
      targetDay: null,
      targetSlot: null
    }
  });

  const values = form.watch();

  async function goToNextStep() {
    const fields = stepFields[currentStep];

    if (!fields.length) {
      return;
    }

    const valid = await form.trigger(fields);

    if (valid) {
      setCurrentStep((step) => Math.min(step + 1, plannerSteps.length - 1));
    }
  }

  function goToPreviousStep() {
    setCurrentStep((step) => Math.max(step - 1, 0));
  }

  function syncCities(rawValue: string) {
    setCityInput(rawValue);
    form.setValue(
      "cities",
      rawValue
        .split(",")
        .map((city) => city.trim())
        .filter(Boolean),
      { shouldValidate: true }
    );
  }

  async function requestItinerary(payload: ItineraryRequestInput) {
    const response = await fetch("/api/ai/itinerary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const json = (await response.json()) as {
      itinerary?: GeneratedItinerary;
      error?: string;
    };

    if (!response.ok || !json.itinerary) {
      throw new Error(json.error ?? "Unable to generate itinerary.");
    }

    return json.itinerary;
  }

  const onSubmit = form.handleSubmit((data) => {
    setPlannerError(null);
    setSaveMessage(null);

    startTransition(async () => {
      try {
        const nextItinerary = await requestItinerary(data);
        setItinerary(nextItinerary);
      } catch (error) {
        setPlannerError(error instanceof Error ? error.message : "Something went wrong.");
      }
    });
  });

  function rerunPlanner(adjustment: string, targetDay?: number, targetSlot?: ActivitySlot) {
    const payload: ItineraryRequestInput = {
      ...form.getValues(),
      adjustment,
      currentItinerary: itinerary,
      targetDay: targetDay ?? null,
      targetSlot: targetSlot ?? null
    };

    setPlannerError(null);
    startActionTransition(async () => {
      try {
        const nextItinerary = await requestItinerary(payload);
        setItinerary(nextItinerary);
      } catch (error) {
        setPlannerError(error instanceof Error ? error.message : "Unable to refresh the itinerary.");
      }
    });
  }

  async function saveItinerary() {
    if (!itinerary) {
      return;
    }

    const payload = {
      title: `${values.destinationCountry} GlobeTales Plan`,
      countryCode: values.destinationCountry,
      startDate: values.startDate,
      endDate: values.endDate,
      travelerCount: values.numberOfTravelers,
      budget: values.approximateBudget,
      interests: values.interests,
      travelPreferences: {
        preferredPace: values.preferredPace,
        dietaryPreferences: values.dietaryPreferences,
        accessibilityNeeds: values.accessibilityNeeds,
        transportationPreferences: values.transportationPreferences,
        hotelPreference: values.hotelPreference,
        travelingWithChildren: values.travelingWithChildren,
        hiddenGems: values.hiddenGems,
        popularAttractions: values.popularAttractions
      },
      generatedContent: itinerary
    };

    const response = await fetch("/api/itineraries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const json = (await response.json()) as { error?: string; itineraryId?: string };

    if (response.status === 401) {
      router.push(`/auth/sign-in?next=/planner?country=${values.destinationCountry}`);
      return;
    }

    if (!response.ok) {
      setSaveMessage(json.error ?? "Could not save the itinerary.");
      return;
    }

    setSaveMessage("Itinerary saved to your dashboard.");
  }

  function copyItinerary() {
    if (!itinerary) {
      return;
    }

    const text = itinerary.days
      .map(
        (day) =>
          `${day.title}\nMorning: ${day.morning.title}\nLunch: ${day.lunch.title}\nAfternoon: ${day.afternoon.title}\nDinner: ${day.dinner.title}\nEvening: ${day.evening.title}\nTip: ${day.helpfulTip}`
      )
      .join("\n\n");

    navigator.clipboard.writeText(text);
    setSaveMessage("Itinerary copied.");
  }

  async function shareItinerary() {
    if (!itinerary) {
      return;
    }

    if (navigator.share) {
      await navigator.share({
        title: `${values.destinationCountry} trip`,
        text: itinerary.shareText
      });
      return;
    }

    copyItinerary();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
      <section className="glass-panel rounded-[2.5rem] p-6 sm:p-8">
        <div className="flex flex-wrap gap-3">
          {plannerSteps.map((step, index) => (
            <button
              key={step.id}
              type="button"
              onClick={() => index <= currentStep && setCurrentStep(index)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em]",
                index === currentStep
                  ? "bg-[color:var(--navy)] text-white"
                  : index < currentStep
                    ? "bg-white/40 text-[color:var(--foreground)] dark:bg-white/10"
                    : "bg-white/20 text-[color:var(--muted)]"
              )}
            >
              {step.title}
            </button>
          ))}
        </div>

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {currentStep === 0 ? (
            <>
              <Field label="Destination country">
                <select
                  {...form.register("destinationCountry")}
                  className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Cities to visit">
                <input
                  value={cityInput || values.cities.join(", ")}
                  onChange={(event) => syncCities(event.target.value)}
                  placeholder="Tokyo, Kyoto, Osaka"
                  className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5"
                />
              </Field>
            </>
          ) : null}

          {currentStep === 1 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Start date">
                <input type="date" {...form.register("startDate")} className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5" />
              </Field>
              <Field label="End date">
                <input type="date" {...form.register("endDate")} className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5" />
              </Field>
              <Field label="Number of days">
                <input type="number" min={2} max={21} {...form.register("numberOfDays", { valueAsNumber: true })} className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5" />
              </Field>
              <Field label="Travelers">
                <input type="number" min={1} max={12} {...form.register("numberOfTravelers", { valueAsNumber: true })} className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5" />
              </Field>
            </div>
          ) : null}

          {currentStep === 2 ? (
            <Field label="Approximate budget (USD)">
              <input
                type="number"
                min={200}
                step={100}
                {...form.register("approximateBudget", { valueAsNumber: true })}
                className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5"
              />
            </Field>
          ) : null}

          {currentStep === 3 ? (
            <div className="space-y-3">
              <Field label="Interests">
                <div className="grid gap-3 sm:grid-cols-2">
                  {interestOptions.map((interest) => {
                    const checked = values.interests.includes(interest);
                    return (
                      <label key={interest} className={cn("flex items-center gap-3 rounded-[1.5rem] border px-4 py-3", checked ? "border-[color:var(--accent)] bg-white/50 dark:bg-white/10" : "border-[color:var(--border)] bg-white/30 dark:bg-white/5")}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(event) => {
                            const nextInterests = event.target.checked
                              ? [...values.interests, interest]
                              : values.interests.filter((item) => item !== interest);
                            form.setValue("interests", nextInterests, { shouldValidate: true });
                          }}
                        />
                        <span>{interest}</span>
                      </label>
                    );
                  })}
                </div>
              </Field>
            </div>
          ) : null}

          {currentStep === 4 ? (
            <div className="space-y-4">
              <Field label="Preferred pace">
                <select {...form.register("preferredPace")} className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5">
                  <option value="Relaxed">Relaxed</option>
                  <option value="Balanced">Balanced</option>
                  <option value="Fast">Fast</option>
                </select>
              </Field>
              <Field label="Transportation preference">
                <input {...form.register("transportationPreferences")} placeholder="Trains, short flights, walking..." className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5" />
              </Field>
              <Field label="Hotel preference">
                <input {...form.register("hotelPreference")} placeholder="Boutique hotel, resort, apartment..." className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5" />
              </Field>
              <Field label="Dietary preferences">
                <input {...form.register("dietaryPreferences")} placeholder="Vegetarian, halal, no shellfish..." className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5" />
              </Field>
              <Field label="Accessibility needs">
                <input {...form.register("accessibilityNeeds")} placeholder="Step-free routes, low walking days..." className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5" />
              </Field>
              <div className="grid gap-3 sm:grid-cols-3">
                <CheckboxCard
                  checked={values.travelingWithChildren ?? false}
                  label="Traveling with children"
                  onChange={(checked) => form.setValue("travelingWithChildren", checked)}
                />
                <CheckboxCard checked={values.hiddenGems ?? false} label="Include hidden gems" onChange={(checked) => form.setValue("hiddenGems", checked)} />
                <CheckboxCard checked={values.popularAttractions ?? false} label="Keep major highlights" onChange={(checked) => form.setValue("popularAttractions", checked)} />
              </div>
            </div>
          ) : null}

          {currentStep === 5 ? (
            <div className="space-y-5 rounded-[2rem] paper-panel p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--accent-strong)]">
                    Review
                  </p>
                  <h3 className="section-title mt-2 text-3xl font-semibold">
                    {values.destinationCountry} route for {values.numberOfTravelers} traveler{values.numberOfTravelers > 1 ? "s" : ""}
                  </h3>
                </div>
                <CalendarDays className="mt-1 h-5 w-5 text-[color:var(--accent-strong)]" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <ReviewItem label="Cities" value={values.cities.join(", ")} />
                <ReviewItem label="Dates" value={`${values.startDate} to ${values.endDate}`} />
                <ReviewItem label="Budget" value={`$${values.approximateBudget}`} />
                <ReviewItem label="Interests" value={values.interests.join(", ")} />
                <ReviewItem label="Pace" value={values.preferredPace} />
                <ReviewItem label="Stay style" value={values.hotelPreference || "Flexible"} />
              </div>
            </div>
          ) : null}

          {plannerError ? <p className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-200 dark:text-red-200">{plannerError}</p> : null}
          {saveMessage ? <p className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-200">{saveMessage}</p> : null}

          <div className="flex flex-wrap gap-3">
            {currentStep > 0 ? (
              <Button type="button" variant="secondary" onClick={goToPreviousStep}>
                Back
              </Button>
            ) : null}
            {currentStep < plannerSteps.length - 1 ? (
              <Button type="button" onClick={goToNextStep}>
                Continue
              </Button>
            ) : (
              <Button type="submit" disabled={isPending} className="gap-2">
                <Sparkles className="h-4 w-4" />
                {isPending ? "Generating..." : "Generate itinerary"}
              </Button>
            )}
          </div>
        </form>
      </section>

      <section className="space-y-6">
        <div className="paper-panel rounded-[2.5rem] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--accent-strong)]">
                Output
              </p>
              <h2 className="section-title mt-2 text-4xl font-semibold">Day-by-day itinerary cards</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {plannerActions.map((action) => (
                <Button
                  key={action}
                  type="button"
                  variant="secondary"
                  className="px-4 py-2 text-xs"
                  onClick={() => rerunPlanner(action)}
                  disabled={!itinerary || isActionPending}
                >
                  {action}
                </Button>
              ))}
            </div>
          </div>

          {itinerary ? (
            <>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button type="button" className="gap-2" onClick={saveItinerary}>
                  <Save className="h-4 w-4" />
                  Save itinerary
                </Button>
                <Button type="button" variant="secondary" className="gap-2" onClick={copyItinerary}>
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button type="button" variant="secondary" className="gap-2" onClick={shareItinerary}>
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button type="button" variant="secondary" className="gap-2" onClick={() => window.print()}>
                  <Printer className="h-4 w-4" />
                  Printable view
                </Button>
              </div>

              <div className="mt-8 space-y-5">
                <div className="glass-panel rounded-[2rem] p-5">
                  <p className="text-lg font-semibold">{itinerary.summary}</p>
                  <p className="mt-2 text-sm text-[color:var(--muted)]">{itinerary.travelerProfile}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {itinerary.notes.map((note) => (
                      <span key={note} className="rounded-full bg-white/40 px-3 py-1 text-xs font-medium dark:bg-white/10">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {itinerary.days.map((day) => (
                  <article key={day.day} className="glass-panel rounded-[2rem] p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--accent-strong)]">
                          Day {day.day} • {day.dateLabel}
                        </p>
                        <h3 className="section-title mt-2 text-3xl font-semibold">{day.title}</h3>
                        <p className="mt-2 text-sm text-[color:var(--muted)]">
                          {day.city} • est. ${day.estimatedDailyCost} • {day.travelTimeEstimate}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        className="gap-2 px-4 py-2 text-xs"
                        onClick={() => rerunPlanner("Refresh this day", day.day)}
                        disabled={isActionPending}
                      >
                        <Wand2 className="h-4 w-4" />
                        Regenerate day
                      </Button>
                    </div>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      {(
                        [
                          ["morning", day.morning],
                          ["lunch", day.lunch],
                          ["afternoon", day.afternoon],
                          ["dinner", day.dinner],
                          ["evening", day.evening]
                        ] as const
                      ).map(([slot, item]) => (
                        <div key={slot} className="rounded-[1.5rem] bg-white/40 p-4 dark:bg-white/5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-strong)]">
                                {slot}
                              </p>
                              <h4 className="mt-2 text-base font-semibold">{item.title}</h4>
                            </div>
                            <button
                              type="button"
                              className="rounded-full bg-white/45 px-3 py-1 text-xs font-semibold dark:bg-white/10"
                              onClick={() => rerunPlanner(`Replace the ${slot} plan`, day.day, slot)}
                              disabled={isActionPending}
                            >
                              Swap
                            </button>
                          </div>
                          <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{item.description}</p>
                          <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--muted)]">
                            {item.location} • ${item.estimatedCost}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 rounded-[1.5rem] border border-dashed border-[color:var(--border)] px-4 py-4 text-sm text-[color:var(--muted)]">
                      <strong className="text-[color:var(--foreground)]">Transportation:</strong> {day.transportationNotes}
                      <br />
                      <strong className="text-[color:var(--foreground)]">Helpful tip:</strong> {day.helpfulTip}
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-8 rounded-[2rem] border border-dashed border-[color:var(--border)] px-6 py-10 text-center">
              <h3 className="section-title text-3xl font-semibold">Your itinerary will appear here.</h3>
              <p className="mt-3 text-[color:var(--muted)]">
                Move through the form, review the route, and generate a trip that can be refined day-by-day.
              </p>
            </div>
          )}
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

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] bg-white/45 px-4 py-4 dark:bg-white/5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-strong)]">{label}</p>
      <p className="mt-2 text-sm font-medium">{value}</p>
    </div>
  );
}

function CheckboxCard({
  checked,
  label,
  onChange
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className={cn("flex cursor-pointer items-center gap-3 rounded-[1.5rem] border px-4 py-4", checked ? "border-[color:var(--accent)] bg-white/45 dark:bg-white/10" : "border-[color:var(--border)] bg-white/30 dark:bg-white/5")}>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="text-sm font-medium">{label}</span>
    </label>
  );
}
