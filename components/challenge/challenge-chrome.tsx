"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/cn";
import { Progress } from "@/components/ui/Progress";
import { LOOP_STEPS } from "@/lib/challenge/challenges";

/* ---------------------------------------------------------------------------
   Shared furniture for the challenge loop.

   The loop screens carry no bottom navigation on purpose — once someone is
   inside a challenge, the only ways out are back and forward.
--------------------------------------------------------------------------- */

export function ChallengeHeader({
  backHref,
  step,
  label,
}: {
  backHref: string;
  /** Which of the six loop steps this screen is. */
  step?: number;
  /** Right-hand label when the screen is not a numbered step. */
  label?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Link
        href={backHref}
        aria-label="Back"
        className="-ml-2 flex size-11 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-ink"
      >
        <ChevronLeft className="size-5" aria-hidden />
      </Link>

      {step !== undefined ? (
        <>
          <Progress
            value={step}
            max={LOOP_STEPS}
            label={`Step ${step} of ${LOOP_STEPS}`}
            className="flex-1"
          />
          <span className="tnum shrink-0 text-xs text-ink-muted">
            {step} of {LOOP_STEPS}
          </span>
        </>
      ) : (
        <span className="ml-auto rounded-[var(--radius-pill)] bg-primary-soft px-2.5 py-1 text-[11px] font-bold tracking-[0.08em] text-primary-ink uppercase">
          {label}
        </span>
      )}
    </div>
  );
}

/** Criterion dots: filled for demonstrated, outlined for still open. */
export function CriteriaDots({
  demonstrated,
  total,
  tone = "amber",
  className,
}: {
  demonstrated: number;
  total: number;
  tone?: "amber" | "green";
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)} aria-hidden>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            "size-3.5 rounded-full border-2",
            i < demonstrated
              ? tone === "green"
                ? "border-success bg-success"
                : "border-primary bg-primary"
              : "border-line bg-transparent",
          )}
        />
      ))}
    </div>
  );
}
