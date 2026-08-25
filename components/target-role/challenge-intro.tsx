"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PandaAside } from "@/components/panda/panda-aside";
import { RoleChallengeHeader } from "@/components/target-role/shared";
import { PRIORITIZATION_OPTIONS, ROLE_PANDA } from "@/lib/target-role/data";

/* ---------------------------------------------------------------------------
   The job-specific challenge — read the situation before choosing.

   Same discipline as every other challenge in this app: the learner sees the
   full situation before being asked to decide anything, and Panda names that
   there is no single right answer up front rather than after the fact.
--------------------------------------------------------------------------- */

export function RoleChallengeIntro() {
  return (
    <div className="screen">
      <RoleChallengeHeader href="/role/route" />

      <div className="gps-rise mt-4 flex flex-1 flex-col">
        <h1 className="text-[22px] leading-tight font-extrabold text-balance">
          Everything is important. What ships first?
        </h1>

        <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
          You&apos;re PM for a B2B SaaS product. Your team has capacity for{" "}
          <span className="font-bold text-ink">one major initiative</span> next sprint. Three
          requests are competing for attention.
        </p>

        <ul className="mt-4 flex flex-col gap-2.5">
          {PRIORITIZATION_OPTIONS.map((option) => (
            <li key={option.id}>
              <Card padded={false} className="p-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-line text-[12px] font-extrabold text-ink-muted">
                    {option.letter}
                  </span>
                  <p className="text-[15px] leading-snug font-extrabold">{option.title}</p>
                </div>

                <dl className="mt-2.5 grid grid-cols-3 gap-2 border-t border-line pt-2.5 text-[12px]">
                  <div>
                    <dt className="font-semibold text-ink-faint">{option.metaLabel}</dt>
                    <dd className="mt-0.5 leading-snug font-bold">{option.metaValue}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-ink-faint">{option.impactLabel}</dt>
                    <dd className="mt-0.5 leading-snug font-bold">{option.impactValue}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-ink-faint">Effort</dt>
                    <dd className="mt-0.5 leading-snug font-bold">{option.effort}</dd>
                  </div>
                </dl>
              </Card>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
          Your challenge
        </p>
        <p className="mt-1.5 text-[16px] leading-snug font-bold text-balance">
          What would you prioritize, and what trade-off are you making?
        </p>
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside message={ROLE_PANDA.challengeIntro} />
          <Button size="lg" full href="/role/challenge/decision">
            Make my decision →
          </Button>
        </div>
      </div>
    </div>
  );
}
