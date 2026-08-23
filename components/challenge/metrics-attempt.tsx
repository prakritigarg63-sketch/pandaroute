"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PandaAside } from "@/components/panda/panda-aside";
import { ChallengeHeader } from "@/components/challenge/challenge-chrome";
import { STEP_INDEX, evaluate, type Challenge } from "@/lib/challenge/challenges";
import { challengeState, recordAttempt, useLoop } from "@/lib/challenge/use-challenge";

/* ---------------------------------------------------------------------------
   The metrics attempt.

   Two moves rather than one essay: say where the problem is, then say why you
   think so. The retry asks for the same focus plus the two things the lesson
   added — a hypothesis and the evidence that would test it — so the shape of
   the form itself carries what was learned.
--------------------------------------------------------------------------- */

const MIN_WORDS = 12;

function words(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** The funnel, drawn as narrowing bars so the drop is visible, not just read. */
function Funnel({ challenge }: { challenge: Challenge }) {
  const steps = challenge.funnel ?? [];

  return (
    <ul className="flex flex-col items-center gap-1">
      {steps.map((step, i) => (
        <li
          key={step.label}
          className="flex items-center justify-between gap-3 rounded-[var(--radius-tile)] bg-primary-soft px-3 py-2"
          style={{ width: `${100 - i * 14}%` }}
        >
          <span className="tnum text-[15px] font-extrabold">{step.value}</span>
          <span className="text-[12px] font-semibold text-ink-muted">{step.label}</span>
        </li>
      ))}
    </ul>
  );
}

export function MetricsAttempt({
  challenge,
  attempt,
}: {
  challenge: Challenge;
  attempt: 1 | 2;
}) {
  const router = useRouter();
  const loop = useLoop();
  const state = challengeState(loop, challenge.id, challenge.criteria.length);

  const [focus, setFocus] = useState<string>("");
  const [analysis, setAnalysis] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [evidence, setEvidence] = useState("");
  const [showFirst, setShowFirst] = useState(false);

  const ready =
    attempt === 1
      ? focus !== "" && words(analysis) >= MIN_WORDS
      : focus !== "" && words(hypothesis) >= MIN_WORDS && words(evidence) >= 6;

  const submit = useCallback(() => {
    if (!ready) return;

    const written =
      attempt === 1
        ? `Focus: ${focus}\n\n${analysis.trim()}`
        : `Focus: ${focus}\n\nHypothesis: ${hypothesis.trim()}\n\nEvidence: ${evidence.trim()}`;

    recordAttempt(
      challenge.id,
      challenge.criteria.length,
      attempt,
      written,
      evaluate(challenge, attempt),
    );

    router.push(
      attempt === 1
        ? `/challenge/${challenge.id}/check`
        : `/challenge/${challenge.id}/improvement`,
    );
  }, [ready, attempt, focus, analysis, hypothesis, evidence, challenge, router]);

  return (
    <div className="screen">
      <ChallengeHeader
        backHref={
          attempt === 1 ? `/challenge/${challenge.id}` : `/challenge/${challenge.id}/learn`
        }
        step={attempt === 1 ? STEP_INDEX.attempt : STEP_INDEX.retry}
      />

      <div className="gps-rise mt-4 flex flex-1 flex-col">
        <p className="text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
          Attempt {attempt}
        </p>

        <h1 className="mt-1 text-[24px] leading-tight font-extrabold text-balance">
          {attempt === 1
            ? "What do the numbers tell you?"
            : "Try again with what you just learned."}
        </h1>

        {attempt === 1 && (
          <div className="mt-3.5">
            <Funnel challenge={challenge} />
          </div>
        )}

        {attempt === 2 && state.attempt1 && (
          <div className="mt-3">
            <button
              type="button"
              aria-expanded={showFirst}
              onClick={() => setShowFirst((open) => !open)}
              className="flex min-h-11 w-full items-center justify-between rounded-[var(--radius-card)] border border-line bg-surface px-3.5 text-left text-[14px] font-semibold transition-colors hover:bg-sunk/50"
            >
              View my first attempt
              <span aria-hidden className="text-ink-faint">
                {showFirst ? "−" : "+"}
              </span>
            </button>

            {showFirst && (
              <p className="panda-bubble-in mt-1.5 rounded-[var(--radius-card)] border border-line bg-sunk/50 p-3.5 text-[13px] leading-relaxed whitespace-pre-wrap text-ink-muted">
                {state.attempt1}
              </p>
            )}
          </div>
        )}

        <h2 className="mt-4 text-[15px] font-bold">1. What concerns you most?</h2>
        <div
          role="radiogroup"
          aria-label="What concerns you most?"
          className="mt-2 flex flex-col gap-2"
        >
          {(challenge.focusOptions ?? []).map((option) => {
            const isSelected = option.id === focus;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setFocus(option.id)}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-[var(--radius-card)] border p-3 text-left transition-colors",
                  isSelected
                    ? "border-primary-strong bg-primary-soft"
                    : "border-line bg-surface hover:bg-sunk/50",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-full border-2",
                    isSelected ? "border-primary-strong" : "border-line",
                  )}
                >
                  {isSelected && <span className="size-2 rounded-full bg-primary" />}
                </span>
                <span className="text-[14px] leading-snug font-semibold">{option.label}</span>
              </button>
            );
          })}
        </div>

        {attempt === 1 ? (
          <>
            <h2 className="mt-4 text-[15px] font-bold">2. Tell me why</h2>
            <Card padded={false} className="mt-2 overflow-hidden">
              <label htmlFor="analysis" className="sr-only">
                Write your analysis
              </label>
              <textarea
                id="analysis"
                value={analysis}
                onChange={(event) => setAnalysis(event.target.value)}
                rows={5}
                placeholder="Write your analysis…"
                className="min-h-[7.5rem] w-full resize-y bg-transparent p-3.5 text-[14px] leading-relaxed outline-none placeholder:text-ink-faint"
              />
            </Card>
            <p className="mt-1.5 text-[12px] text-ink-muted">
              Think about what this behaviour might mean.
            </p>
          </>
        ) : (
          <>
            <h2 className="mt-4 text-[15px] font-bold">2. What&apos;s your hypothesis?</h2>
            <Card padded={false} className="mt-2 overflow-hidden">
              <label htmlFor="hypothesis" className="sr-only">
                Write your hypothesis
              </label>
              <textarea
                id="hypothesis"
                value={hypothesis}
                onChange={(event) => setHypothesis(event.target.value)}
                rows={4}
                placeholder="Write your hypothesis…"
                className="min-h-[7.5rem] w-full resize-y bg-transparent p-3.5 text-[14px] leading-relaxed outline-none placeholder:text-ink-faint"
              />
            </Card>

            <h2 className="mt-4 text-[15px] font-bold">
              3. What evidence will you look for?
            </h2>
            <Card padded={false} className="mt-2 overflow-hidden">
              <label htmlFor="evidence" className="sr-only">
                Write the evidence you would gather
              </label>
              <textarea
                id="evidence"
                value={evidence}
                onChange={(event) => setEvidence(event.target.value)}
                rows={4}
                placeholder="Write the evidence you'd gather…"
                className="min-h-[7.5rem] w-full resize-y bg-transparent p-3.5 text-[14px] leading-relaxed outline-none placeholder:text-ink-faint"
              />
            </Card>
          </>
        )}
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside
            reaction={attempt === 1 ? "thinking" : "helpful"}
            message={attempt === 1 ? challenge.attemptPanda : challenge.retryPanda}
          />

          <Button size="lg" full onClick={submit} disabled={!ready}>
            {attempt === 1 ? "Submit my analysis →" : "Submit retry →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
