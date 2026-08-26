"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { PandaAside } from "@/components/panda/panda-aside";
import { QUESTIONS, TOTAL_QUESTIONS } from "@/lib/diagnostic/questions";
import { answerQuestion, completeDiagnostic } from "@/lib/diagnostic/use-diagnostic";

/* ---------------------------------------------------------------------------
   One diagnostic scenario.

   Every question uses this screen, so the shape is learned once: where you are,
   what happened, what you would do, and Panda thinking alongside you.

   Nothing here tells the learner how they did. The classification is decided at
   the end, from all twelve answers together, because a single scenario is not
   evidence of anything and telling someone mid-way would change how they
   answer the rest.
--------------------------------------------------------------------------- */

/** Panda's milestone lines, shown once an answer lands on those questions. */
const MILESTONES: Record<number, string> = {
  3: "Nice — your route is starting to take shape.",
  9: "I'm seeing some interesting strengths. 🧭",
  12: "Got it! Let me connect the dots. 🧭",
};

const LETTERS = ["A", "B", "C", "D"] as const;

export function QuestionScreen({ index }: { index: number }) {
  const router = useRouter();
  const question = QUESTIONS[index];
  const number = index + 1;

  // Every scenario opens with nothing chosen, even one that was answered
  // before: a pre-ticked option is an answer the learner did not just give, and
  // it invites them to page through agreeing with themselves. The previous
  // answer stays in storage for scoring and is replaced when they choose again.
  const [selected, setSelected] = useState<string | undefined>(undefined);

  const [milestone, setMilestone] = useState<string | null>(null);
  const settle = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (settle.current) window.clearTimeout(settle.current);
    },
    [],
  );

  const choose = useCallback(
    (optionId: string) => {
      setSelected(optionId);
      answerQuestion(question.id, optionId, index);

      const line = MILESTONES[number];
      if (line) setMilestone(line);
    },
    [question.id, index, number],
  );

  const next = useCallback(() => {
    if (!selected) return;

    if (number === TOTAL_QUESTIONS) {
      completeDiagnostic();
      router.push("/diagnostic/mapping");
      return;
    }

    if (number === 6) {
      router.push("/diagnostic/halfway");
      return;
    }

    router.push(`/diagnostic/question/${number + 1}`);
  }, [selected, number, router]);

  const backHref =
    number === 1 ? "/diagnostic/how-it-works" : `/diagnostic/question/${number - 1}`;

  return (
    <div className="screen">
      <div className="flex items-center gap-3">
        <Link
          href={backHref}
          aria-label="Previous question"
          className="-ml-2 flex size-11 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-ink"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </Link>

        <Progress
          value={number}
          max={TOTAL_QUESTIONS}
          label={`Question ${number} of ${TOTAL_QUESTIONS}`}
          className="flex-1"
        />

        <span className="tnum shrink-0 text-xs text-ink-muted">
          {number} of {TOTAL_QUESTIONS}
        </span>
      </div>

      {/* pb-36 keeps the last option clear of the sticky Panda + CTA dock
          below: on a 3-4 option question the list can run right up against
          it, and without this the dock covers the last option instead of
          sitting cleanly beneath it. */}
      <div key={question.id} className="gps-rise mt-5 flex flex-1 flex-col pb-36">
        <span className="self-start rounded-[var(--radius-pill)] bg-primary-soft px-2.5 py-1 text-[11px] font-semibold tracking-[0.08em] text-primary-ink uppercase">
          {question.tag}
        </span>

        <h1 className="mt-3 text-[19px] leading-snug font-extrabold text-balance">
          {question.scenario}
        </h1>

        {question.context && (
          <p className="mt-1.5 text-[14px] leading-snug text-ink-muted">{question.context}</p>
        )}

        <p className="mt-3.5 text-[15px] font-bold">{question.prompt}</p>

        <div role="radiogroup" aria-label={question.prompt} className="mt-3 flex flex-col gap-2">
          {question.options.map((option, i) => {
            const isSelected = option.id === selected;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => choose(option.id)}
                className={cn(
                  "flex min-h-11 w-full items-center gap-3 rounded-[var(--radius-card)] border p-3 text-left transition-colors",
                  isSelected
                    ? "border-primary-strong bg-primary-soft"
                    : "border-line bg-surface hover:bg-sunk/50",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border text-[12px] font-bold transition-colors",
                    isSelected
                      ? "border-primary-strong bg-primary text-ink"
                      : "border-line text-ink-muted",
                  )}
                >
                  {LETTERS[i]}
                </span>

                <span className="min-w-0 flex-1 text-[14px] leading-snug font-semibold">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="sticky-cta">
        <div className="relative flex flex-col gap-2.5">
          {/* Panda thinks alongside the learner. The prompt points at the kind
              of thinking the scenario wants and never at an option. */}
          <PandaAside reaction={milestone ? "celebrate" : "idle"} message={milestone ?? question.hint} />

          <Button size="lg" full onClick={next} disabled={!selected}>
            {number === TOTAL_QUESTIONS ? "Map my route →" : "Next →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
