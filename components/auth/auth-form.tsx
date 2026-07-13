"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { loginSchema, registerSchema } from "@/lib/validation/auth";

const schemas = {
  login: loginSchema,
  register: registerSchema
} as const;

export function AuthForm({
  mode,
  nextPath = "/dashboard"
}: {
  mode: "login" | "register";
  nextPath?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const schema = schemas[mode];
  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues:
      mode === "register"
        ? ({ name: "", email: "", password: "" } as FormValues)
        : ({ email: "", password: "" } as FormValues)
  });

  const onSubmit = form.handleSubmit((values) => {
    form.clearErrors("root");

    startTransition(async () => {
      const response = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      });

      const json = (await response.json()) as { error?: string };

      if (!response.ok) {
        form.setError("root", {
          message: json.error ?? "Something went wrong."
        });
        return;
      }

      router.push(nextPath);
      router.refresh();
    });
  });

  const nameError =
    mode === "register"
      ? (form.formState.errors as { name?: { message?: string } }).name?.message
      : undefined;

  return (
    <div className="glass-panel w-full rounded-[2.5rem] p-8 sm:p-10">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--accent-strong)]">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </p>
        <h1 className="section-title text-5xl font-semibold">
          {mode === "login" ? "Sign in to keep planning." : "Start saving trips with GlobeTales."}
        </h1>
        <p className="max-w-xl text-[color:var(--muted)]">
          {mode === "login"
            ? "Access your saved countries, itineraries, and scrapbooks."
            : "Create an account to save itineraries, build scrapbooks, and keep a travel dashboard."}
        </p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={onSubmit}>
        {mode === "register" ? (
          <Field label="Name" error={nameError}>
            <input {...form.register("name")} className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5" />
          </Field>
        ) : null}
        <Field label="Email" error={form.formState.errors.email?.message}>
          <input
            type="email"
            {...form.register("email")}
            className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5"
          />
        </Field>
        <Field label="Password" error={form.formState.errors.password?.message}>
          <input
            type="password"
            {...form.register("password")}
            className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/45 px-4 py-3 dark:bg-white/5"
          />
        </Field>

        {form.formState.errors.root?.message ? (
          <p className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200">
            {form.formState.errors.root.message}
          </p>
        ) : null}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Please wait..." : mode === "login" ? "Sign In" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-[color:var(--muted)]">
        {mode === "login" ? "New here?" : "Already have an account?"}{" "}
        <Link
          href={mode === "login" ? "/auth/register" : "/auth/sign-in"}
          className="font-semibold text-[color:var(--accent-strong)]"
        >
          {mode === "login" ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2 text-sm font-medium">
      {label}
      {children}
      {error ? <span className="text-sm text-red-600 dark:text-red-300">{error}</span> : null}
    </label>
  );
}
