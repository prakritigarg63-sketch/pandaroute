"use client";

import { useEffect } from "react";
import { ArrowDown, Check, Circle } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PandaAside } from "@/components/panda/panda-aside";
import { PandaMascot } from "@/components/panda/panda-mascot";
import { ChallengeHeader, CriteriaDots } from "@/components/challenge/challenge-chrome";
import { STEP_INDEX, evaluate, type Challenge } from "@/lib/challenge/challenges";
import {
  challengeState,
  setChallengeStatus,
  useLoop,
  verifyCapability,
} from "@/lib/challenge/use-challenge";

/* ---------------------------------------------------------------------------
   The four screens between an attempt and a verified capability.

   Together they carry the argument the product is making: you tried it, here
   is what you already showed, here is the one idea you were missing, and here
   is the same situation again. Nothing on these screens says wrong or failed —
   a gap is the next thing to close, not a mark.
--------------------------------------------------------------------------- */

export function ChallengeIntro({ challenge }: { challenge: Challenge }) {
  return (
    <div className="screen">
      <ChallengeHeader backHref="/gap-map" label={challenge.number} />

      <div className="gps-rise mt-3 flex flex-1 flex-col">
        <h1 className="text-[27px] leading-tight font-extrabold text-balance">
          {challenge.title}
        </h1>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {challenge.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-[var(--radius-pill)] bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-primary-ink"
            >
              {tag}
            </span>
          ))}
          <span className="tnum text-[12px] text-ink-muted">~{challenge.minutes} min</span>
        </div>

        <div className="mt-3 flex justify-center">
          <PandaMascot reaction="welcome" size="large" />
        </div>

        <p className="mt-3 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
          Scenario
        </p>
        <p className="mt-1.5 text-[14px] leading-relaxed">{challenge.scenario}</p>

        <p className="mt-3 text-[13px] text-ink-muted">{challenge.proposalBy}</p>
        <Card padded={false} className="mt-1.5 border-l-4 border-l-primary">
          <p className="p-3.5 text-[14px] leading-snug font-semibold">
            “{challenge.proposal}”
          </p>
        </Card>

        <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-muted">
          {challenge.constraint}
        </p>

        <p className="mt-4 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
          Your challenge
        </p>
        <p className="mt-1.5 text-[16px] leading-snug font-bold text-balance">
          {challenge.question}
        </p>
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside mascot={false} message={challenge.introPanda} />
          <Button size="lg" full href={`/challenge/${challenge.id}/attempt`}>
            Take the challenge →
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CapabilityCheck({ challenge }: { challenge: Challenge }) {
  const loop = useLoop();
  const state = challengeState(loop, challenge.id, challenge.criteria.length);
  const demonstrated = state.attempt1Criteria.length
    ? state.attempt1Criteria
    : evaluate(challenge, 1);

  const shown = challenge.criteria.filter((c) => demonstrated.includes(c.id));
  const open = challenge.criteria.filter((c) => !demonstrated.includes(c.id));

  return (
    <div className="screen">
      <ChallengeHeader
        backHref={`/challenge/${challenge.id}/attempt`}
        step={STEP_INDEX.check}
      />

      <div className="gps-rise mt-4 flex flex-1 flex-col">
        <h1 className="text-[24px] leading-tight font-extrabold text-balance">
          Let&apos;s look at your approach 🔍
        </h1>

        <h2 className="mt-4 text-[13px] font-bold text-success">You demonstrated</h2>
        <ul className="mt-2 flex flex-col gap-2">
          {shown.map((criterion) => (
            <li key={criterion.id}>
              <Card padded={false} className="flex items-start gap-2.5 border-success/30 bg-skip-soft p-3.5">
                <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                <span className="min-w-0">
                  <span className="block text-[14px] leading-snug font-bold">
                    {criterion.name}
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-ink-muted">
                    {criterion.demonstrated}
                  </span>
                </span>
              </Card>
            </li>
          ))}
        </ul>

        <h2 className="mt-4 text-[13px] font-bold text-primary-ink">Let&apos;s strengthen</h2>
        <ul className="mt-2 flex flex-col gap-2">
          {open.map((criterion) => (
            <li key={criterion.id}>
              <Card padded={false} className="flex items-start gap-2.5 border-primary-strong/30 bg-primary-soft p-3.5">
                <Circle className="mt-0.5 size-4 shrink-0 text-primary-strong" aria-hidden />
                <span className="min-w-0">
                  <span className="block text-[14px] leading-snug font-bold">
                    {criterion.name}
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-ink-muted">
                    {criterion.gap}
                  </span>
                </span>
              </Card>
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
            Capability progress
          </p>
          <div className="mt-1.5 flex items-center gap-3">
            <CriteriaDots demonstrated={shown.length} total={challenge.criteria.length} />
            <span className="tnum text-[13px] font-semibold text-ink-muted">
              {shown.length} of {challenge.criteria.length} demonstrated
            </span>
          </div>
        </div>
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside
            reaction="helpful"
            message="Good start — you already have the investigation instinct from QA. Now let's shift from “What's wrong?” to “What problem are we actually solving?”"
          />
          <Button size="lg" full href={`/challenge/${challenge.id}/learn`}>
            Close my gaps →
          </Button>
        </div>
      </div>
    </div>
  );
}

export function MicroLesson({ challenge }: { challenge: Challenge }) {
  const lesson = challenge.lesson;

  useEffect(() => {
    setChallengeStatus(challenge.id, challenge.criteria.length, "learning");
  }, [challenge.id, challenge.criteria.length]);

  return (
    <div className="screen">
      <ChallengeHeader
        backHref={`/challenge/${challenge.id}/check`}
        label={lesson.label}
      />

      <div className="gps-rise mt-4 flex flex-1 flex-col">
        <h1 className="text-[25px] leading-tight font-extrabold text-balance">
          {lesson.title}
        </h1>
        {lesson.subtitle && (
          <h2 className="text-[20px] leading-snug font-extrabold text-balance text-ink-muted">
            {lesson.subtitle}
          </h2>
        )}

        {lesson.requested && (
          <>
            <p className="mt-4 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
              What was requested
            </p>
            <Card padded={false} className="mt-1.5">
              <p className="p-3 text-[14px] font-semibold">“{lesson.requested}”</p>
            </Card>

            <ArrowDown className="my-1.5 size-4 self-center text-ink-faint" aria-hidden />

            <p className="text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
              What a PM asks
            </p>
            <Card padded={false} className="mt-1.5 border-primary-strong/35 bg-primary-soft">
              <p className="p-3 text-[14px] font-bold">“{lesson.pmQuestion}”</p>
            </Card>

            <ArrowDown className="my-1.5 size-4 self-center text-ink-faint" aria-hidden />

            <p className="text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
              Possible underlying problems
            </p>
            <ul className="mt-1.5 flex flex-col gap-1">
              {(lesson.possibilities ?? []).map((item) => (
                <li key={item} className="flex items-start gap-2 text-[13.5px] leading-snug">
                  <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </>
        )}

        {lesson.observation && (
          <>
            <p className="mt-4 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
              Observation
            </p>
            <Card padded={false} className="mt-1.5 border-primary-strong/35 bg-primary-fill">
              <p className="p-3 text-[14px] font-bold">{lesson.observation}</p>
            </Card>

            <p className="mt-3.5 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
              Possible hypotheses
            </p>
            <ul className="mt-1.5 flex flex-col gap-1.5">
              {(lesson.hypotheses ?? []).map((item) => (
                <li
                  key={item}
                  className="rounded-[var(--radius-tile)] border border-line bg-surface px-3 py-2 text-[13.5px] leading-snug font-semibold"
                >
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-3.5 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
              Evidence
            </p>
            <ul className="mt-1.5 grid grid-cols-2 gap-1.5">
              {(lesson.evidence ?? []).map((item) => (
                <li
                  key={item}
                  className="rounded-[var(--radius-tile)] border border-line bg-primary-soft px-3 py-2 text-[12.5px] leading-snug font-semibold"
                >
                  {item}
                </li>
              ))}
            </ul>
          </>
        )}

        {lesson.principle && (
          <Card padded={false} className="mt-3.5 border-primary-strong/35 bg-primary-fill">
            <p className="p-3.5 text-[14px] leading-snug font-bold">{lesson.principle}</p>
          </Card>
        )}

        <p className="mt-4 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
          Simple framework
        </p>
        <ol className="mt-2 flex flex-wrap items-center gap-1.5">
          {lesson.framework.map((step, i) => (
            <li key={step} className="flex items-center gap-1.5">
              <span className="rounded-[var(--radius-pill)] border border-line bg-surface px-2.5 py-1 text-[12px] font-bold">
                {step}
              </span>
              {i < lesson.framework.length - 1 && (
                <span aria-hidden className="text-primary-strong">
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside
            reaction="thinking"
            message="Your QA instinct is useful here: investigate before concluding. PM thinking adds one layer — investigate the user problem before concluding on the solution."
          />
          <Button size="lg" full href={`/challenge/${challenge.id}/retry`}>
            Retry challenge →
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Improvement({ challenge }: { challenge: Challenge }) {
  const loop = useLoop();
  const state = challengeState(loop, challenge.id, challenge.criteria.length);

  const first = state.attempt1Criteria.length
    ? state.attempt1Criteria
    : evaluate(challenge, 1);
  const second = state.attempt2Criteria.length
    ? state.attempt2Criteria
    : evaluate(challenge, 2);

  const closed = challenge.criteria.filter(
    (criterion) => second.includes(criterion.id) && !first.includes(criterion.id),
  );

  return (
    <div className="screen">
      <ChallengeHeader
        backHref={`/challenge/${challenge.id}/retry`}
        step={STEP_INDEX.improvement}
      />

      <div className="gps-rise mt-4 flex flex-1 flex-col">
        <h1 className="text-[25px] leading-tight font-extrabold text-balance">
          You closed the gaps! 🎉
        </h1>

        <div className="mt-4 flex flex-col items-center gap-1.5">
          <div className="w-full rounded-[var(--radius-card)] border border-line bg-surface p-3.5">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
              Attempt 1
            </p>
            <p className="tnum mt-1 text-[15px] font-bold">
              {first.length} / {challenge.criteria.length} demonstrated
            </p>
            <CriteriaDots
              demonstrated={first.length}
              total={challenge.criteria.length}
              className="mt-2"
            />
          </div>

          <ArrowDown className="size-5 text-ink-faint" aria-hidden />

          <div className="w-full rounded-[var(--radius-card)] border border-success/35 bg-skip-soft p-3.5">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-success uppercase">
              Attempt 2
            </p>
            <p className="tnum mt-1 text-[15px] font-bold">
              {second.length} / {challenge.criteria.length} demonstrated
            </p>
            <CriteriaDots
              demonstrated={second.length}
              total={challenge.criteria.length}
              tone="green"
              className="mt-2"
            />
          </div>

          {closed.length > 0 && (
            <p className="mt-1 rounded-[var(--radius-pill)] bg-primary-fill px-3 py-1 text-[13px] font-bold text-primary-ink">
              ↑ {closed.length} {closed.length === 1 ? "gap" : "gaps"} closed
            </p>
          )}
        </div>

        <h2 className="mt-4 text-[13px] font-bold">What improved</h2>
        <ul className="mt-2 flex flex-col gap-2">
          {closed.map((criterion) => (
            <li key={criterion.id}>
              <Card padded={false} className="flex items-start gap-2.5 border-success/30 bg-skip-soft p-3.5">
                <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                <span className="min-w-0">
                  <span className="block text-[14px] leading-snug font-bold">
                    {criterion.name}
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-ink-muted">
                    {criterion.improved}
                  </span>
                </span>
              </Card>
            </li>
          ))}
        </ul>
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside
            reaction="celebrate"
            message="That was stronger. You didn't just change your answer — you changed how you approached the problem."
          />
          <Button size="lg" full href={`/challenge/${challenge.id}/verified`}>
            See what I proved →
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CapabilityVerified({ challenge }: { challenge: Challenge }) {
  // Reaching this screen is what makes the capability verified, so the route
  // behind it is already updated by the time the learner presses continue.
  useEffect(() => {
    verifyCapability(challenge.capabilityId);
  }, [challenge.capabilityId]);

  return (
    <div className="screen">
      <div className="gps-rise flex flex-1 flex-col items-center gap-3 text-center">
        <span className="trophy-in text-[54px] leading-none" aria-hidden>
          🏆
        </span>

        <div>
          <p className="text-[11px] font-semibold tracking-[0.12em] text-success uppercase">
            Capability verified
          </p>
          <h1 className="mt-1 text-[26px] leading-tight font-extrabold text-balance">
            {challenge.verifiedName}
          </h1>
        </div>

        <p className="text-[14px] text-ink-muted">You demonstrated that you can:</p>

        <ul className="flex w-full flex-col gap-1.5 text-left">
          {challenge.criteria.map((criterion) => (
            <li
              key={criterion.id}
              className="flex items-start gap-2.5 rounded-[var(--radius-card)] border border-success/25 bg-skip-soft px-3.5 py-2.5"
            >
              <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
              <span className="text-[13.5px] leading-snug font-semibold">
                {criterion.proof}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-1 w-full rounded-[var(--radius-card)] border border-line bg-surface p-3.5">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
            Added to your capability profile
          </p>
          <p className="mt-1.5 text-[15px] font-bold">🏆 1 capability verified</p>
        </div>

        <div className="mt-1">
          <PandaMascot reaction="celebrate" size="medium" />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        <PandaAside
          mascot={false}
          message="You didn't just learn Product Discovery. You proved you can apply it. 🐼"
        />
        <Button size="lg" full href="/route">
          Continue my route →
        </Button>
      </div>
    </div>
  );
}

/** Shared by the check and improvement screens for their section headers. */
export const SECTION_HEADING = cn("text-[13px] font-bold");
