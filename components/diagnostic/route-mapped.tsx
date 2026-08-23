"use client";

import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { PandaMascot } from "@/components/panda/panda-mascot";
import { PandaAside } from "@/components/panda/panda-aside";
import { CAPABILITIES, type Classification } from "@/lib/diagnostic/capabilities";
import { classifyAnswers, countBy } from "@/lib/diagnostic/scoring";
import { useDiagnostic } from "@/lib/diagnostic/use-diagnostic";

/* ---------------------------------------------------------------------------
   Route mapped.

   The reward is clarity, not a score: twelve capabilities sorted into what to
   build, what to apply, and what the learner's QA years already cover. The
   Skip number is the one that earns the fifteen minutes back, so it gets the
   same weight as the others rather than being hidden as "not needed".
--------------------------------------------------------------------------- */

const TILE: Record<Classification, string> = {
  learn: "border-learn/35 bg-learn-soft text-learn",
  practice: "border-practice/35 bg-practice-soft text-practice",
  skip: "border-skip/35 bg-skip-soft text-skip",
};

export function RouteMapped() {
  const state = useDiagnostic();
  const results = classifyAnswers(state.answers);
  const totals = countBy(results);

  const tiles: Array<{ key: Classification; count: number }> = [
    { key: "learn", count: totals.learn },
    { key: "practice", count: totals.practice },
    { key: "skip", count: totals.skip },
  ];

  return (
    <div className="screen">
      <div className="gps-rise flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <PandaMascot reaction="celebrate" size="large" />

        <h1 className="text-[27px] leading-tight font-extrabold text-balance">
          Your route is mapped! 🧭
        </h1>

        <p className="max-w-[20rem] text-[15px] leading-snug font-semibold text-balance">
          You already bring more PM-relevant experience from QA than you might think.
        </p>

        <div className="mt-1 grid w-full grid-cols-4 gap-2">
          <div className="rounded-[var(--radius-card)] border border-line bg-surface px-2 py-3">
            <p className="tnum text-[22px] leading-none font-extrabold">{CAPABILITIES.length}</p>
            <p className="mt-1 text-[11px] leading-tight text-ink-muted">Skills mapped</p>
          </div>

          {tiles.map((tile) => (
            <div
              key={tile.key}
              className={cn(
                "rounded-[var(--radius-card)] border px-2 py-3",
                TILE[tile.key],
              )}
            >
              <p className="tnum text-[22px] leading-none font-extrabold">{tile.count}</p>
              <p className="mt-1 text-[11px] leading-tight font-semibold capitalize">
                {tile.key}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2.5">
        <PandaAside mascot={false} message="Great! Now we can focus on building the PM capabilities that matter most for you." />
        <Button size="lg" full href="/gap-map">
          See my Gap Map →
        </Button>
      </div>
    </div>
  );
}
