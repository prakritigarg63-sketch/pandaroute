"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PandaAside } from "@/components/panda/panda-aside";
import { ChallengeHeader } from "@/components/challenge/challenge-chrome";
import { STEP_INDEX, evaluate, type Challenge } from "@/lib/challenge/challenges";
import { challengeState, recordAttempt, useLoop } from "@/lib/challenge/use-challenge";

/* ---------------------------------------------------------------------------
   Making an attempt.

   The same form serves the first attempt and the retry: the situation has not
   changed, only what the learner knows. On the retry their first answer is
   available to compare against, collapsed, because the point is to see your
   own thinking move.

   The submit button waits for a real attempt. A one-word answer would get
   feedback that means nothing, which teaches the learner that the feedback is
   theatre.
--------------------------------------------------------------------------- */

/** Roughly three sentences. Enough to have said something. */
const MIN_WORDS = 20;

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function AttemptForm({
  challenge,
  attempt,
}: {
  challenge: Challenge;
  attempt: 1 | 2;
}) {
  const router = useRouter();
  const loop = useLoop();
  const state = challengeState(loop, challenge.id, challenge.criteria.length);

  const [text, setText] = useState("");
  const [showFirst, setShowFirst] = useState(false);

  const words = wordCount(text);
  const ready = words >= MIN_WORDS;

  const submit = useCallback(() => {
    if (!ready) return;

    recordAttempt(
      challenge.id,
      challenge.criteria.length,
      attempt,
      text.trim(),
      evaluate(challenge, attempt),
    );

    router.push(
      attempt === 1
        ? `/challenge/${challenge.id}/check`
        : `/challenge/${challenge.id}/improvement`,
    );
  }, [ready, challenge, attempt, text, router]);

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
          {attempt === 1 ? "What would you do?" : "Try again with what you just learned."}
        </h1>

        <p className="mt-1.5 text-[14px] leading-snug text-ink-muted">
          {attempt === 1
            ? "Before deciding whether to build the proposed feature, describe your approach."
            : "Use the same situation — but rethink your approach."}
        </p>

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

        <ol className="mt-3.5 flex flex-col gap-1.5">
          {challenge.prompts.map((prompt, i) => (
            <li key={prompt} className="flex items-start gap-2.5">
              <span
                aria-hidden
                className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-ink"
              >
                {i + 1}
              </span>
              <span className="text-[13.5px] leading-snug font-semibold">{prompt}</span>
            </li>
          ))}
        </ol>

        <Card padded={false} className="mt-3.5 overflow-hidden">
          <label htmlFor="attempt" className="sr-only">
            {attempt === 1 ? "Write your approach" : "Write your improved approach"}
          </label>
          <textarea
            id="attempt"
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={6}
            placeholder={
              attempt === 1 ? "Write your approach…" : "Write your improved approach…"
            }
            className="min-h-[9.5rem] w-full resize-y bg-transparent p-3.5 text-[14px] leading-relaxed outline-none placeholder:text-ink-faint"
          />
        </Card>

        <p className="mt-1.5 text-[12px] leading-snug text-ink-muted">
          Aim for 3–5 sentences. There isn&apos;t one perfect answer.
          {!ready && words > 0 && (
            <span className="text-ink-faint"> {MIN_WORDS - words} more words to go.</span>
          )}
        </p>
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside
            reaction={attempt === 1 ? "thinking" : "helpful"}
            message={attempt === 1 ? challenge.attemptPanda : challenge.retryPanda}
          />

          <Button size="lg" full onClick={submit} disabled={!ready}>
            {attempt === 1 ? "Submit my approach →" : "Submit retry →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
