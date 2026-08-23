"use client";

import { useEffect, useState } from "react";
import { Check, CircleDot } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { PandaAside } from "@/components/panda/panda-aside";
import { PandaMascot } from "@/components/panda/panda-mascot";
import { CAPSTONE } from "@/lib/capstone/capstone";
import { finishCapstone, useCapstone } from "@/lib/capstone/use-capstone";
import { completeCapstone, useLoop } from "@/lib/challenge/use-challenge";

/* ---------------------------------------------------------------------------
   Review, feedback, completion and proof.

   The reward at the end of the capstone is not a mark — it is a piece of
   evidence the learner can talk about in an interview. So the feedback is
   capability-level, one capability is honestly left "developing", and the
   completion screen hands over a proof item rather than a certificate.
--------------------------------------------------------------------------- */

/** How long the review dwells before the feedback is available. */
const REVIEW_MS = 1600;

export function CapstoneReview() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDone(true), REVIEW_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="screen">
      <div className="gps-rise flex flex-1 flex-col">
        <h1 className="text-[24px] leading-tight font-extrabold text-balance">
          Let&apos;s look at the whole picture 🔍
        </h1>
        <p className="mt-1.5 text-[14px] text-ink-muted">You worked through:</p>

        <ul className="mt-3 grid grid-cols-3 gap-2">
          {CAPSTONE.reviewed.map((item) => (
            <li
              key={item.id + item.name}
              className="rounded-[var(--radius-card)] border border-line bg-surface px-1.5 py-3 text-center"
            >
              <p className="text-[18px] leading-none" aria-hidden>
                {item.icon}
              </p>
              <p className="mt-1.5 text-[11px] leading-tight font-semibold [overflow-wrap:anywhere]">
                {item.name}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex justify-center">
          <PandaMascot reaction="thinking" size="large" />
        </div>

        <div className="mt-5">
          <p className="text-[13px] font-semibold text-ink-muted">
            {done ? "Review complete." : "Reviewing your approach…"}
          </p>
          {/* Not a spinner: the bar fills once, then the CTA arrives. */}
          <Progress
            value={done ? 1 : 0.35}
            max={1}
            label="Reviewing your approach"
            className="mt-2"
          />
        </div>
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside mascot={false} message={CAPSTONE.panda.review} />
          <Button size="lg" full href="/capstone/feedback" aria-disabled={!done}>
            {done ? "See my feedback →" : "Reviewing…"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CapstoneFeedback() {
  return (
    <div className="screen">
      <div className="gps-rise flex flex-1 flex-col">
        <h1 className="text-[24px] leading-tight font-extrabold text-balance">
          Your PM thinking, mapped
        </h1>

        <ul className="mt-4 flex flex-col gap-2">
          {CAPSTONE.verdicts.map((verdict) => {
            const strong = verdict.level === "strong";
            return (
              <li key={verdict.id}>
                <Card
                  padded={false}
                  className={cn(
                    "flex items-start gap-2.5 p-3.5",
                    strong
                      ? "border-success/30 bg-skip-soft"
                      : "border-primary-strong/30 bg-primary-soft",
                  )}
                >
                  {strong ? (
                    <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                  ) : (
                    <CircleDot
                      className="mt-0.5 size-4 shrink-0 text-primary-strong"
                      aria-hidden
                    />
                  )}
                  <span className="min-w-0">
                    <span className="block text-[10px] font-bold tracking-[0.1em] uppercase">
                      <span className={strong ? "text-success" : "text-primary-ink"}>
                        {strong ? "Strong" : "Developing"}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-[14px] leading-snug font-bold">
                      {verdict.name}
                    </span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-ink-muted">
                      {verdict.note}
                    </span>
                  </span>
                </Card>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside message={CAPSTONE.panda.feedback} />
          <Button size="lg" full href="/capstone/complete">
            See my Capstone result →
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CapstoneComplete() {
  // Arriving here is what turns the capstone into proof.
  useEffect(() => {
    finishCapstone();
    completeCapstone(CAPSTONE.proof.id, CAPSTONE.proof.title);
  }, []);

  return (
    <div className="screen">
      <div className="gps-rise flex flex-1 flex-col items-center gap-3 text-center">
        <span className="trophy-in text-[52px] leading-none" aria-hidden>
          🏆
        </span>

        <h1 className="text-[26px] leading-tight font-extrabold text-balance">
          Capstone Complete!
        </h1>
        <p className="max-w-[20rem] text-[14px] leading-snug text-ink-muted text-balance">
          You combined five PM capabilities in one product problem.
        </p>

        <ul className="mt-1 flex w-full flex-col gap-1.5 text-left">
          {CAPSTONE.verdicts.map((verdict) => {
            const strong = verdict.level === "strong";
            return (
              <li
                key={verdict.id}
                className={cn(
                  "flex items-center gap-2.5 rounded-[var(--radius-card)] border px-3.5 py-2.5",
                  strong ? "border-success/25 bg-skip-soft" : "border-primary-strong/25 bg-primary-soft",
                )}
              >
                {strong ? (
                  <Check className="size-4 shrink-0 text-success" aria-hidden />
                ) : (
                  <CircleDot className="size-4 shrink-0 text-primary-strong" aria-hidden />
                )}
                <span className="flex-1 text-[13.5px] leading-snug font-semibold">
                  {verdict.name}
                </span>
                {!strong && (
                  <span className="shrink-0 rounded-[var(--radius-pill)] bg-primary-fill px-2 py-0.5 text-[10px] font-bold tracking-[0.08em] text-primary-ink uppercase">
                    Developing
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        <Card className="mt-2 w-full border-primary-strong/35 bg-primary-soft text-left">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
            New proof added
          </p>
          <p className="mt-1 text-[15px] leading-snug font-bold">{CAPSTONE.proof.title}</p>
          <p className="mt-0.5 text-[11px] font-bold tracking-[0.08em] text-primary-ink uppercase">
            {CAPSTONE.proof.badge}
          </p>
        </Card>

        <PandaMascot reaction="celebrate" size="medium" />
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside mascot={false} message={CAPSTONE.panda.complete} />
          <Button size="lg" full href="/proof">
            View my proof →
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ProofOfCapability() {
  const state = useCapstone();
  const loop = useLoop();
  const earned = state.completed || loop.proofItems.length > 0;

  return (
    <div className="screen">
      <div className="gps-rise flex flex-1 flex-col">
        <h1 className="text-[24px] leading-tight font-extrabold">Your Proof 🏆</h1>
        <p className="mt-0.5 text-[13px] font-semibold text-ink-muted">
          QA / Test Analyst → Product Manager
        </p>

        <Card className="mt-4 border-primary-strong/35">
          <p className="text-[17px] leading-snug font-extrabold">{CAPSTONE.proof.title}</p>
          <p className="mt-0.5 text-[11px] font-bold tracking-[0.08em] text-primary-ink uppercase">
            {earned ? CAPSTONE.proof.badge : "Capstone · Not yet completed"}
          </p>

          <p className="mt-3 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
            Challenge
          </p>
          <p className="mt-1 text-[13.5px] leading-snug text-ink-muted">
            {CAPSTONE.proof.challenge}
          </p>

          <p className="mt-3 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
            What you demonstrated
          </p>
          <ul className="mt-1.5 flex flex-col gap-1.5">
            {CAPSTONE.proof.demonstrated.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[13.5px] leading-snug">
                <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <p className="mt-4 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
          Capabilities demonstrated
        </p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {CAPSTONE.proof.chips.map((chip) => (
            <li
              key={chip}
              className="rounded-[var(--radius-pill)] border border-line bg-surface px-2.5 py-1 text-[12px] font-semibold"
            >
              {chip}
            </li>
          ))}
        </ul>
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside message={CAPSTONE.panda.proof} />
          <Button size="lg" full href="/readiness">
            Continue to readiness →
          </Button>
        </div>
      </div>
    </div>
  );
}
