"use client";

import Link from "next/link";
import { Award, FolderOpen, Mic } from "lucide-react";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/Button";
import { PandaAside } from "@/components/panda/panda-aside";
import { ROLE_PANDA } from "@/lib/target-role/data";
import { progression, useLoop } from "@/lib/challenge/use-challenge";
import { useCareer } from "@/lib/career/use-career";

/* ---------------------------------------------------------------------------
   "From practice to real opportunities" — the entry point.

   The stat cards are real numbers read from the existing Career Kit stores,
   not restated copy: whatever the learner has actually verified is what shows
   here, so the screen never claims more evidence than exists.
--------------------------------------------------------------------------- */

export function RoleHub() {
  const counts = progression(useLoop());
  const career = useCareer();

  const stats = [
    { icon: Award, value: counts.verified, label: "Verified Capabilities" },
    { icon: FolderOpen, value: career.caseStatus !== "none" ? 1 : 0, label: "Portfolio Case" },
    { icon: Mic, value: career.interview?.status === "ready" ? 1 : 0, label: "Interview Story" },
  ];

  return (
    <div className="screen screen-flush">
      <h1 className="text-[24px] leading-tight font-extrabold text-balance">
        Ready to test yourself against a real PM role? 🎯
      </h1>
      <p className="mt-1.5 text-[13.5px] font-semibold text-ink-muted">You&apos;ve built:</p>

      <ul className="mt-3 flex flex-col gap-2">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <li
              key={stat.label}
              className="flex items-center gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-3.5"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-tile)] bg-primary-soft text-primary-ink">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="flex items-baseline gap-2">
                <span className="tnum text-[20px] leading-none font-extrabold">
                  {stat.value}
                </span>
                <span className="text-[14px] leading-none font-semibold text-ink-muted">
                  {stat.label}
                </span>
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto flex flex-col gap-3 pt-6">
        <PandaAside message={ROLE_PANDA.hub} />

        <Button size="lg" full href="/role/add">
          Analyze a PM role →
        </Button>

        <Link
          href="/career-kit"
          className="flex min-h-11 items-center justify-center text-[14px] font-bold text-primary-ink underline underline-offset-4"
        >
          Explore my Career Kit
        </Link>
      </div>

      <BottomNav active="progress" />
    </div>
  );
}
