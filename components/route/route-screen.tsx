"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { PandaAside } from "@/components/panda/panda-aside";
import { BottomNav } from "@/components/layout/bottom-nav";
import {
  CAPABILITY_BY_ID,
  CLASSIFICATION_LABEL,
  summaryFor,
  type Classification,
} from "@/lib/diagnostic/capabilities";
import { classifyAnswers } from "@/lib/diagnostic/scoring";
import { useDiagnostic } from "@/lib/diagnostic/use-diagnostic";
import { challengeForCapability } from "@/lib/challenge/challenges";
import { progression, useLoop, type CapabilityStatus } from "@/lib/challenge/use-challenge";

/* ---------------------------------------------------------------------------
   The route.

   The diagnostic decided the order; the challenges change it. A verified
   capability sits at the top with a green tick, the next open gap is marked
   UP NEXT in amber, and everything else waits its turn.

   The counters are the only progression Pandaroute keeps: capabilities
   verified, challenges completed, days active. No points.
--------------------------------------------------------------------------- */

const ORDER: Record<CapabilityStatus, number> = {
  verified: 0,
  developing: 1,
  "in-progress": 1,
  learn: 2,
  practice: 3,
  skip: 4,
};

const STYLE: Record<CapabilityStatus, string> = {
  verified: "border-success/35 bg-skip-soft",
  developing: "border-primary-strong/35 bg-primary-soft",
  "in-progress": "border-primary-strong/35 bg-primary-soft",
  learn: "border-learn/30 bg-learn-soft",
  practice: "border-practice/30 bg-practice-soft",
  skip: "border-skip/30 bg-skip-soft",
};

/** The node on the route spine. Filled means done, ringed means next. */
const NODE: Record<CapabilityStatus, string> = {
  verified: "border-success bg-success",
  developing: "border-primary bg-primary-fill",
  "in-progress": "border-primary bg-primary",
  learn: "border-primary bg-canvas",
  practice: "border-practice bg-canvas",
  skip: "border-skip bg-skip-soft",
};

const PILL: Record<CapabilityStatus, string> = {
  verified: "text-success",
  developing: "text-primary-ink",
  "in-progress": "text-primary-ink",
  learn: "text-learn",
  practice: "text-practice",
  skip: "text-skip",
};

const LABEL: Record<CapabilityStatus, string> = {
  verified: "Verified",
  developing: "Developing",
  "in-progress": "In progress",
  learn: CLASSIFICATION_LABEL.learn,
  practice: CLASSIFICATION_LABEL.practice,
  skip: CLASSIFICATION_LABEL.skip,
};

export function RouteScreen() {
  const diagnostic = useDiagnostic();
  const loop = useLoop();
  const counts = progression(loop);

  const rows = classifyAnswers(diagnostic.answers)
    .map((result) => ({
      capability: CAPABILITY_BY_ID.get(result.capabilityId),
      classification: result.classification as Classification,
      status: (loop.capabilities[result.capabilityId] ??
        result.classification) as CapabilityStatus,
    }))
    .filter((row) => row.capability)
    .sort((a, b) => ORDER[a.status] - ORDER[b.status]);

  // The next thing to do: an open gap we actually have a challenge for, so the
  // CTA leads to work rather than to a description of work. Falls back to the
  // first open gap when no challenge exists yet.
  const openRows = rows.filter(
    (row) => row.status === "learn" || row.status === "practice",
  );
  const upNext =
    openRows.find((row) => row.capability && challengeForCapability(row.capability.id)) ??
    openRows[0];
  const gapsLeft = openRows.length;
  const nextChallenge = upNext?.capability
    ? challengeForCapability(upNext.capability.id)
    : undefined;

  return (
    <div className="screen screen-flush">
      <h1 className="text-[24px] leading-tight font-extrabold text-balance">
        {counts.verified > 0 ? "You're making progress 🎯" : "Your Route"}
      </h1>
      <p className="mt-0.5 text-[13px] leading-snug text-ink-muted">
        {counts.verified > 0
          ? "Every challenge is closing a specific gap on your route to Product Management."
          : "QA → Product Manager"}
      </p>

      <ul className="mt-3.5 grid grid-cols-4 gap-2">
        {[
          { icon: "🏆", value: counts.verified, label: "Verified" },
          { icon: "🧩", value: counts.challengesCompleted, label: "Completed" },
          { icon: "🧭", value: gapsLeft, label: "Gaps left" },
          { icon: "🔥", value: counts.activeDays, label: "Day streak" },
        ].map((stat) => (
          <li
            key={stat.label}
            className="rounded-[var(--radius-card)] border border-line bg-surface px-1 py-2.5 text-center"
          >
            <p className="text-[15px] leading-none" aria-hidden>
              {stat.icon}
            </p>
            <p className="tnum mt-1 text-[18px] leading-none font-extrabold">{stat.value}</p>
            <p className="mt-1 text-[10px] leading-tight text-ink-muted [overflow-wrap:anywhere]">{stat.label}</p>
          </li>
        ))}
      </ul>

      {/* The vertical route: one spine, one node per capability. It is the
          shape of the product — a journey with stops — and it reads on a phone
          in a way a horizontal timeline never does. */}
      <ol className="mt-4 flex flex-1 flex-col">
        {rows.map((row, index) => {
          const capability = row.capability!;
          const isNext = upNext?.capability?.id === capability.id;
          const isLast = index === rows.length - 1;

          return (
            <li key={capability.id} className="relative flex gap-3 pb-2">
              <span className="flex w-5 shrink-0 flex-col items-center" aria-hidden>
                <span className={cn("mt-4 size-3 shrink-0 rounded-full border-2", NODE[row.status])} />
                {!isLast && <span className="w-0.5 flex-1 bg-line" />}
              </span>

              <Link
                href={`/gap-map/${capability.id}`}
                className={cn(
                  "flex flex-1 items-center gap-3 rounded-[var(--radius-card)] border p-3.5 transition-colors",
                  STYLE[row.status],
                )}
              >
                <span className="min-w-0 flex-1">
                  {isNext && (
                    <span className="block text-[10px] font-bold tracking-[0.12em] text-primary-ink uppercase">
                      Up next
                    </span>
                  )}
                  <span className="mt-0.5 flex items-center gap-1.5 text-[15px] leading-snug font-bold">
                    {row.status === "verified" && (
                      <Check className="size-4 shrink-0 text-success" aria-hidden />
                    )}
                    {capability.name}
                  </span>
                  <span className="mt-0.5 block text-[12.5px] leading-snug text-ink-muted">
                    {row.status === "verified"
                      ? "You proved this in a challenge."
                      : summaryFor(capability, row.classification)}
                  </span>
                </span>

                <span
                  className={cn(
                    "shrink-0 text-[11px] font-bold tracking-[0.06em] uppercase",
                    PILL[row.status],
                  )}
                >
                  {LABEL[row.status]}
                  {row.status === "skip" && " ✓"}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 flex flex-col gap-2.5">
        <PandaAside
          reaction="helpful"
          message={
            counts.verified > 0
              ? "One gap closed. Your next challenge is ready. Let's go! 🧭"
              : "Pick a gap and we'll turn it into your next challenge. 🎯"
          }
        />

        {upNext?.capability && (
          <Button
            size="lg"
            full
            href={
              nextChallenge
                ? `/challenge/${nextChallenge.id}`
                : `/gap-map/${upNext.capability.id}`
            }
          >
            Continue to {upNext.capability.name} →
          </Button>
        )}

        {counts.verified > 0 && (
          <Button size="md" full variant="outline" href="/challenges">
            Choose a different challenge
          </Button>
        )}
      </div>

      <BottomNav active="route" />
    </div>
  );
}
