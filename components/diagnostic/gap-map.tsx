"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { BottomNav } from "@/components/layout/bottom-nav";
import { PandaAside } from "@/components/panda/panda-aside";
import { StrongFoundation } from "@/components/diagnostic/strong-foundation";
import {
  CAPABILITY_BY_ID,
  CLASSIFICATION_LABEL,
  summaryFor,
  type Classification,
} from "@/lib/diagnostic/capabilities";
import { classifyAnswers, countBy } from "@/lib/diagnostic/scoring";
import { useDiagnostic } from "@/lib/diagnostic/use-diagnostic";
import { challengeForCapability } from "@/lib/challenge/challenges";
import { useLoop } from "@/lib/challenge/use-challenge";

/* ---------------------------------------------------------------------------
   The Gap Map.

   Three buckets, three colours, and no ranking within them. Demonstrated is
   styled as an achievement rather than an omission, because "you already
   have this" is the finding that saves the learner the most time.

   When every assessed capability comes back Demonstrated, the "All" view
   swaps the plain list for StrongFoundation — a real product state, not a
   fallback, and never triggered by manufacturing a gap to avoid it.
--------------------------------------------------------------------------- */

const ROW: Record<Classification, string> = {
  learn: "border-learn/30 bg-learn-soft",
  practice: "border-practice/30 bg-practice-soft",
  skip: "border-skip/30 bg-skip-soft",
};

const PILL: Record<Classification, string> = {
  learn: "bg-learn/12 text-learn",
  practice: "bg-practice/12 text-practice",
  skip: "bg-skip/12 text-skip",
};

const DOT: Record<Classification, string> = {
  learn: "bg-learn",
  practice: "bg-practice",
  skip: "bg-skip",
};

const ORDER: Classification[] = ["learn", "practice", "skip"];

export function GapMap() {
  const state = useDiagnostic();
  const loop = useLoop();
  const results = classifyAnswers(state.answers);
  const totals = countBy(results);
  const [filter, setFilter] = useState<Classification | null>(null);

  // The product rule this exists to serve: a learner who has demonstrated
  // every assessed capability doesn't get a gap invented to fill the list —
  // the route changes shape instead. Never hardcoded to a specific count.
  const hasNoCriticalGaps =
    totals.learn === 0 && totals.practice === 0 && totals.skip === results.length;
  const showStrongFoundation = hasNoCriticalGaps && filter === null;

  // The gap we suggest starting with: a real gap (never a Skip), not already
  // verified, and one we actually have a challenge for.
  const recommended = results.find(
    (result) =>
      result.classification !== "skip" &&
      loop.capabilities[result.capabilityId] !== "verified" &&
      challengeForCapability(result.capabilityId),
  )?.capabilityId;

  const shown = results
    .filter((result) => !filter || result.classification === filter)
    .sort(
      (a, b) =>
        ORDER.indexOf(a.classification) - ORDER.indexOf(b.classification),
    );

  return (
    <div className="screen screen-flush">
      <h1 className="text-[24px] leading-tight font-extrabold">My Gap Map 🗺️</h1>
      <p className="mt-1 text-[14px] leading-snug text-ink-muted">
        Your personalised route from QA to Product Management.
      </p>

      <div
        role="group"
        aria-label="Filter capabilities"
        className="mt-4 flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          // At the narrowest widths the four chips don't all fit — rather
          // than clip the last one mid-word, fade it out so a partial chip
          // reads as "more to scroll," not as broken text.
          WebkitMaskImage: "linear-gradient(to right, black calc(100% - 20px), transparent 100%)",
          maskImage: "linear-gradient(to right, black calc(100% - 20px), transparent 100%)",
        }}
      >
        <button
          type="button"
          aria-pressed={filter === null}
          onClick={() => setFilter(null)}
          className={cn(
            "flex min-h-11 shrink-0 items-center justify-center rounded-[var(--radius-pill)] border px-2 text-[11.5px] font-semibold whitespace-nowrap transition-colors",
            filter === null
              ? "border-primary-strong bg-primary-fill text-ink"
              : "border-line bg-surface text-ink-muted hover:bg-sunk/60",
          )}
        >
          All
        </button>
        {ORDER.map((key) => {
          const isOn = filter === key;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={isOn}
              onClick={() => setFilter(isOn ? null : key)}
              className={cn(
                "flex min-h-11 shrink-0 items-center justify-center gap-1 rounded-[var(--radius-pill)] border px-2 text-[11.5px] font-semibold whitespace-nowrap transition-colors",
                isOn ? ROW[key] : "border-line bg-surface text-ink-muted hover:bg-sunk/60",
              )}
            >
              <span className={cn("size-1.5 shrink-0 rounded-full", DOT[key])} aria-hidden />
              {CLASSIFICATION_LABEL[key]} ({totals[key]})
            </button>
          );
        })}
      </div>

      {showStrongFoundation ? (
        <StrongFoundation results={results} />
      ) : (
        <>
          <ul className="mt-3 flex flex-1 flex-col gap-2">
            {shown.map((result) => {
              const capability = CAPABILITY_BY_ID.get(result.capabilityId);
              if (!capability) return null;

              return (
                <li key={result.capabilityId}>
                  <Link
                    href={`/gap-map/${capability.id}`}
                    className={cn(
                      "flex items-center gap-3 rounded-[var(--radius-card)] border p-3.5 transition-colors",
                      ROW[result.classification],
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      {capability.id === recommended && (
                        <span className="block text-[10px] font-bold tracking-[0.12em] text-primary-ink uppercase">
                          Recommended next
                        </span>
                      )}
                      <span className="block text-[15px] leading-snug font-bold">
                        {capability.name}
                      </span>
                      <span className="mt-0.5 block text-[12.5px] leading-snug text-ink-muted">
                        {summaryFor(capability, result.classification)}
                      </span>
                    </span>

                    <span
                      className={cn(
                        "shrink-0 rounded-[var(--radius-pill)] px-2 py-1 text-[11px] font-bold",
                        PILL[result.classification],
                      )}
                    >
                      {CLASSIFICATION_LABEL[result.classification]}
                      {result.classification === "skip" && " ✓"}
                    </span>

                    <ChevronRight className="size-4 shrink-0 text-ink-faint/60" aria-hidden />
                  </Link>
                </li>
              );
            })}
            {shown.length === 0 && (
              <li className="rounded-[var(--radius-card)] border border-line bg-surface p-4 text-center text-[13.5px] text-ink-muted">
                Nothing in this category right now.
              </li>
            )}
          </ul>

          <div className="mt-4">
            <PandaAside message="Pick a gap and we'll turn it into your next challenge. 🎯" />
          </div>
        </>
      )}

      <BottomNav active="route" />
    </div>
  );
}
