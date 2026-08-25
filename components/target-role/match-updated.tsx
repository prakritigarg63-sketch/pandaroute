"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, Check, Target } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { PandaAside } from "@/components/panda/panda-aside";
import { RoleBackBar } from "@/components/target-role/shared";
import { ROLE_PANDA } from "@/lib/target-role/data";
import { proveRoadmapThinking } from "@/lib/target-role/use-target-role";

/* ---------------------------------------------------------------------------
   Job match updated — one gap closed, one remains.

   Roadmap Thinking has no shared challenge behind it yet, so this is where the
   brief's allowance to "simulate completion... rather than build a large
   additional curriculum" is used: continuing here is what proves it, in the
   same beat as seeing the remaining gap named. No second attempt/feedback
   loop is built for a single-capability gap this app doesn't otherwise track.
--------------------------------------------------------------------------- */

const ROUTE = [
  { label: "Product Discovery", done: true },
  { label: "Product Metrics", done: true },
  { label: "Prioritization", done: true },
  { label: "Roadmap Thinking", done: false },
];

export function JobMatchUpdated() {
  const router = useRouter();

  const proceed = useCallback(() => {
    proveRoadmapThinking();
    router.push("/role/readiness");
  }, [router]);

  return (
    <div className="screen">
      <RoleBackBar href="/role/challenge/check" />

      <div className="gps-rise mt-3 flex flex-1 flex-col">
        <h1 className="text-[23px] leading-tight font-extrabold">One gap closed ↑</h1>

        <div className="mt-4 flex flex-col items-center gap-1.5">
          <div className="w-full rounded-[var(--radius-card)] border border-line bg-surface p-3.5 text-center">
            <p className="text-[10px] font-bold tracking-[0.1em] text-ink-faint uppercase">Before</p>
            <p className="mt-1 text-[15px] font-extrabold">Prioritization</p>
            <p className="mt-1 text-[11px] font-bold text-primary-ink">◐ Developing</p>
          </div>
          <ArrowDown className="size-4 text-ink-faint" aria-hidden />
          <div className="w-full rounded-[var(--radius-card)] border border-success/35 bg-skip-soft p-3.5 text-center">
            <p className="text-[10px] font-bold tracking-[0.1em] text-success uppercase">Now</p>
            <p className="mt-1 text-[15px] font-extrabold">Prioritization</p>
            <p className="mt-1 flex items-center justify-center gap-1 text-[11px] font-bold text-success">
              <Check className="size-3.5" aria-hidden /> Proven
            </p>
          </div>
        </div>

        <h2 className="mt-5 text-[11px] font-extrabold tracking-[0.12em] text-ink-faint uppercase">
          Remaining gap
        </h2>
        <div className="mt-2 rounded-[var(--radius-card)] border border-error/25 bg-error-soft p-3.5">
          <p className="text-[15px] font-extrabold">Roadmap Thinking</p>
          <p className="mt-1 text-[11px] font-bold text-error">○ Not yet proven</p>
        </div>

        <ol className="mt-5 flex flex-col gap-1.5">
          {ROUTE.map((step, i) => (
            <li key={step.label} className="flex items-center gap-2 text-[13.5px] font-semibold">
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border-2 text-[9px]",
                  step.done ? "border-success bg-success text-canvas" : "border-primary-strong bg-primary-soft text-primary-strong",
                )}
              >
                {step.done ? <Check className="size-3" /> : i + 1}
              </span>
              {step.label}
            </li>
          ))}
          <li className="flex items-center gap-2 text-[13.5px] font-extrabold text-primary-ink">
            <Target className="size-4 shrink-0" aria-hidden />
            Application Ready
          </li>
        </ol>
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside message={ROLE_PANDA.matchUpdated} />
          <Button size="lg" full onClick={proceed}>
            Continue my route →
          </Button>
        </div>
      </div>
    </div>
  );
}
