"use client";

import Link from "next/link";
import { ChevronLeft, Clock, Crown, Trophy } from "lucide-react";
import { cn } from "@/lib/cn";
import { BottomNav } from "@/components/layout/bottom-nav";
import { PandaAside } from "@/components/panda/panda-aside";
import { XPBadge } from "@/components/landing/shared";
import { ADVANCED_ROUTE, ADVANCED_ROUTE_XP } from "@/lib/challenge/advanced-route";

/* ---------------------------------------------------------------------------
   The Advanced Route.

   Where the Gap Map's "Build my advanced route" leads — real, specific
   application/judgment/trade-off content, not the same Learn/Strengthen
   curriculum reframed. Presented read-only for now, the same way the
   landing page's own route preview (RouteSection) is: real content a
   learner can see in full before it becomes something to click through.
--------------------------------------------------------------------------- */

const DIFFICULTY_STYLE: Record<string, string> = {
  Advanced: "bg-primary-soft text-primary-ink",
  Expert: "bg-coral-soft text-coral",
};

export function AdvancedRoutePage() {
  return (
    <div className="screen screen-flush">
      <Link
        href="/gap-map"
        className="-ml-2 flex min-h-11 w-fit items-center gap-1 rounded-full pr-3 pl-2 text-[14px] font-semibold text-ink-muted transition-colors hover:text-ink"
      >
        <ChevronLeft className="size-5" aria-hidden />
        Gap Map
      </Link>

      <div className="gps-rise mt-2">
        <h1 className="text-[24px] leading-tight font-extrabold text-balance">
          Your Advanced Route 🚀
        </h1>
        <p className="mt-1 text-[14px] leading-snug text-ink-muted">
          Application, judgment and trade-offs — built for what you&apos;ve already
          demonstrated, not what you need to learn.
        </p>

        <ul className="mt-4 flex flex-col gap-2.5">
          {ADVANCED_ROUTE.map((challenge, index) => (
            <li
              key={challenge.id}
              className="route-chip rounded-[18px] border border-line bg-surface p-3.5"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-[10.5px] font-extrabold tracking-[0.08em] text-ink-faint uppercase">
                    {challenge.boss && <Crown className="size-3.5 text-primary-strong" aria-hidden />}
                    {challenge.boss ? "Boss Challenge" : `Challenge ${index + 1}`}
                  </span>
                  <span className="mt-0.5 block text-[13px] font-bold text-ink-muted">
                    {challenge.category}
                  </span>
                </span>

                <span
                  className={cn(
                    "shrink-0 rounded-[var(--radius-pill)] px-2 py-1 text-[10.5px] font-bold",
                    DIFFICULTY_STYLE[challenge.difficulty],
                  )}
                >
                  {challenge.difficulty}
                </span>
              </div>

              <p className="mt-2 text-[14.5px] leading-snug font-bold">
                “{challenge.prompt}”
              </p>

              <div className="mt-2.5 flex items-center gap-3 border-t border-line pt-2.5">
                <span className="flex items-center gap-1 text-[12px] font-semibold text-ink-muted">
                  <Clock className="size-3.5" aria-hidden />
                  {challenge.minutes} min
                </span>
                <XPBadge value={`+${challenge.xp} XP`} />
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center gap-2 rounded-[16px] border border-line bg-sunk/50 px-3.5 py-2.5">
          <Trophy className="size-4 shrink-0 text-primary-strong" aria-hidden />
          <p className="text-[12.5px] font-semibold text-ink-muted">
            {ADVANCED_ROUTE.length} challenges · up to {ADVANCED_ROUTE_XP} XP total
          </p>
        </div>
      </div>

      <div className="mt-4">
        <PandaAside
          reaction="excited"
          message="This route only gets harder from here — that's the point. 🚀"
        />
      </div>

      <BottomNav active="route" />
    </div>
  );
}
