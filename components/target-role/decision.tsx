"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RoleChallengeHeader } from "@/components/target-role/shared";
import { PRIORITIZATION_OPTIONS } from "@/lib/target-role/data";
import {
  DEFAULT_DECISION_CHOICE,
  recordPrioritizationDecision,
} from "@/lib/target-role/use-target-role";

/* ---------------------------------------------------------------------------
   The decision itself.

   Three fields, not one: which option, why, and — the field a lesser version
   of this screen would skip — what gets deliberately left undone. A choice
   without a stated trade-off is not a prioritization decision, it's a guess.
--------------------------------------------------------------------------- */

const MIN_WORDS = 12;
const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

export function RoleDecision() {
  const router = useRouter();
  const [choice, setChoice] = useState<typeof DEFAULT_DECISION_CHOICE>(DEFAULT_DECISION_CHOICE);
  const [reasoning, setReasoning] = useState("");
  const [notPrioritizing, setNotPrioritizing] = useState("");
  const [tradeoff, setTradeoff] = useState("");

  const alternatives = PRIORITIZATION_OPTIONS.filter((option) => option.id !== choice);

  const ready =
    wordCount(reasoning) >= MIN_WORDS &&
    notPrioritizing !== "" &&
    wordCount(tradeoff) >= 8;

  const submit = useCallback(() => {
    if (!ready) return;

    recordPrioritizationDecision({
      choice,
      reasoning: reasoning.trim(),
      notPrioritizing,
      tradeoff: tradeoff.trim(),
    });
    router.push("/role/challenge/check");
  }, [ready, choice, reasoning, notPrioritizing, tradeoff, router]);

  return (
    <div className="screen">
      <RoleChallengeHeader href="/role/challenge" />

      <div className="gps-rise mt-4 flex flex-1 flex-col">
        <h1 className="text-[22px] leading-tight font-extrabold">
          What would you prioritize?
        </h1>

        <div role="radiogroup" aria-label="What would you prioritize?" className="mt-3 grid grid-cols-3 gap-2">
          {PRIORITIZATION_OPTIONS.map((option) => {
            const selected = option.id === choice;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setChoice(option.id)}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 rounded-[var(--radius-card)] border p-2 text-center transition-colors",
                  selected
                    ? "border-primary-strong bg-primary-soft"
                    : "border-line bg-surface hover:bg-sunk/50",
                )}
              >
                <span className="flex items-center gap-1 text-[12px] font-extrabold">
                  {option.letter}
                  {selected && <Check className="size-3.5 text-primary-strong" aria-hidden />}
                </span>
                <span className="text-[11px] leading-tight font-semibold text-ink-muted">
                  {option.title}
                </span>
              </button>
            );
          })}
        </div>

        <label htmlFor="why" className="mt-4 block text-[15px] font-bold">
          Why?
        </label>
        <Card padded={false} className="mt-2 overflow-hidden">
          <textarea
            id="why"
            rows={4}
            value={reasoning}
            onChange={(event) => setReasoning(event.target.value)}
            placeholder="Explain your reasoning…"
            className="min-h-[7rem] w-full resize-y bg-transparent p-3.5 text-[14px] leading-relaxed outline-none placeholder:text-ink-faint"
          />
        </Card>

        <label htmlFor="not-prioritizing" className="mt-4 block text-[15px] font-bold">
          What are you deliberately NOT prioritizing?
        </label>
        <select
          id="not-prioritizing"
          value={notPrioritizing}
          onChange={(event) => setNotPrioritizing(event.target.value)}
          className="mt-2 min-h-11 w-full rounded-[var(--radius-card)] border border-line bg-surface px-3 text-[14px] outline-none"
        >
          <option value="">Select the alternative…</option>
          {alternatives.map((option) => (
            <option key={option.id} value={option.title}>
              {option.letter} — {option.title}
            </option>
          ))}
        </select>

        <label htmlFor="risk" className="mt-4 block text-[15px] font-bold">
          What&apos;s the risk of that decision?
        </label>
        <Card padded={false} className="mt-2 overflow-hidden">
          <textarea
            id="risk"
            rows={3}
            value={tradeoff}
            onChange={(event) => setTradeoff(event.target.value)}
            placeholder="Describe the trade-off…"
            className="min-h-[5.5rem] w-full resize-y bg-transparent p-3.5 text-[14px] leading-relaxed outline-none placeholder:text-ink-faint"
          />
        </Card>
      </div>

      {/* No Panda hint here, on purpose — this is the one decision in the
          flow the brief asks to be left unsupported. */}
      <div className="sticky-cta">
        <Button size="lg" full onClick={submit} disabled={!ready}>
          Submit decision →
        </Button>
      </div>
    </div>
  );
}
