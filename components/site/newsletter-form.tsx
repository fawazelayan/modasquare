"use client";

import { useId, useRef, useState } from "react";
import { CircleNotch, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/cn";

type Status = "idle" | "submitting" | "done";

/**
 * Collection-notice sign-up.
 *
 * Written to the AGENTS.md form contract rather than the shortest thing that
 * works: label above the field, free typing with validation deferred to submit,
 * the error announced and focused, the submit control enabled until the request
 * actually starts, and the button keeping its label while it spins.
 *
 * There is no backend in this prototype, so submission resolves against a timer
 * and is labelled as such.
 */
export function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fieldId = useId();
  const errorId = `${fieldId}-error`;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const raw = new FormData(form).get("email");
    // Trim before validating: text expansion and autofill both leave whitespace.
    const email = typeof raw === "string" ? raw.trim() : "";

    if (email.length === 0) {
      setError("Enter an email address so we know where to send the notice.");
      inputRef.current?.focus();
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setError("That address is missing something. Check for a typo and try again.");
      inputRef.current?.focus();
      return;
    }

    setError(null);
    setStatus("submitting");
    // Stand-in for the real mutation. AGENTS.md targets sub-500ms here.
    await new Promise((resolve) => setTimeout(resolve, 420));
    setStatus("done");
    form.reset();
  };

  if (status === "done") {
    return (
      <p
        role="status"
        className="max-w-[38ch] text-[14px] leading-relaxed text-[var(--color-ink)]"
      >
        You are on the list. The next collection notice goes out before it reaches the
        shop floor.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-[26rem]">
      <label
        htmlFor={fieldId}
        className="block text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]"
      >
        Email address
      </label>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          ref={inputRef}
          id={fieldId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          placeholder="you@example.com"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "min-h-[48px] min-w-0 flex-1 rounded-[2px] border bg-[var(--color-surface)] px-4",
            "text-[16px] text-[var(--color-ink)] outline-none transition-colors duration-200",
            "placeholder:text-[var(--color-muted)] placeholder:opacity-70",
            error ? "border-[var(--color-accent)]" : "border-[var(--color-hairline-strong)]",
            "focus:border-[var(--color-ink)]",
          )}
        />

        <button
          type="submit"
          // Stays enabled until the request begins, so an incomplete form can be
          // submitted and surface its own validation.
          disabled={status === "submitting"}
          className={cn(
            "inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-[2px]",
            "border border-[var(--color-ink)] bg-[var(--color-ink)] px-6",
            "text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--color-canvas)]",
            "transition-[background-color,transform] duration-200 active:scale-[0.985]",
            "[transition-timing-function:var(--ease-quiet)] hover:bg-[var(--color-ink-tint)]",
            "disabled:cursor-not-allowed disabled:opacity-70",
          )}
        >
          {status === "submitting" ? (
            <CircleNotch
              aria-hidden="true"
              weight="bold"
              size={14}
              className="motion-safe:animate-spin"
            />
          ) : null}
          {/* The label survives the loading state rather than being replaced. */}
          Sign up
        </button>
      </div>

      {/* Error text sits at ink, not at the ochre accent: ochre on alabaster is
          3.6:1, which is fine for a rule or an icon and short of AA for prose.
          The warning glyph carries the state so it is never colour alone. */}
      <p
        id={errorId}
        aria-live="polite"
        className="mt-2 flex min-h-[1.25rem] items-start gap-2 text-[13px] leading-snug text-[var(--color-ink)]"
      >
        {error ? (
          <>
            <WarningCircle
              aria-hidden="true"
              weight="regular"
              size={15}
              className="mt-[3px] shrink-0 text-[var(--color-accent)]"
            />
            <span>{error}</span>
          </>
        ) : null}
      </p>
    </form>
  );
}
