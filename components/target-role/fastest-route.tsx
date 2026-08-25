"use client";

import { Check, Target } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { PandaAside } from "@/components/panda/panda-aside";
import { RoleBackBar } from "@/components/target-role/shared";
import { ROLE_PANDA } from "@/lib/target-role/data";
import { resolveRequirements, useTargetRole } from "@/lib/target-role/use-target-role";

/* ---------------------------------------------------------------------------
   The fastest route — the same vertical-spine pattern as the main career
   route, scoped to just this role's two gaps. Proven items are checkpoints
   already passed; the two gaps are numbered stops; "Application Ready" is the
   destination, not yet reached.
--------------------------------------------------------------------------- */

export function FastestRoute() {
  const state = useTargetRole();
  const requirements = resolveRequirements(state);

  const productDiscovery = requirements.find((r) => r.id === "product-discovery")!;
  const productMetrics = requirements.find((r) => r.id === "product-metrics")!;
  const prioritization = requirements.find((r) => r.id === "prioritization")!;
  const roadmap = requirements.find((r) => r.id === "roadmap-thinking")!;

  const remainingMinutes =
    (state.prioritizationProven ? 0 : (prioritization.minutes ?? 0)) +
    (state.roadmapProven ? 0 : (roadmap.minutes ?? 0));

  const stops = [
    { kind: "proven" as const, label: productDiscovery.capability, sub: "Already proven" },
    { kind: "proven" as const, label: productMetrics.capability, sub: "Already proven" },
    {
      kind: state.prioritizationProven ? ("proven" as const) : ("todo" as const),
      number: "01",
      label: prioritization.capability,
      sub: state.prioritizationProven ? "Already proven" : "Strengthen",
      minutes: prioritization.minutes,
    },
    {
      kind: state.roadmapProven ? ("proven" as const) : ("todo" as const),
      number: "02",
      label: roadmap.capability,
      sub: state.roadmapProven ? "Already proven" : "Build proof",
      minutes: roadmap.minutes,
    },
  ];

  const nextHref = !state.prioritizationProven
    ? "/role/challenge"
    : !state.roadmapProven
      ? "/role/match-updated"
      : "/role/readiness";

  const nextLabel = !state.prioritizationProven
    ? "Start with Prioritization →"
    : !state.roadmapProven
      ? "Continue to Roadmap Thinking →"
      : "See my role readiness →";

  return (
    <div className="screen">
      <RoleBackBar href="/role/gaps" />

      <div className="gps-rise mt-3 flex flex-1 flex-col">
        <h1 className="text-[23px] leading-tight font-extrabold text-balance">
          Your fastest route to stronger evidence 🧭
        </h1>

        <p className="mt-4 text-[11px] font-extrabold tracking-[0.14em] text-ink-faint uppercase">
          Start
        </p>

        <ol className="mt-2 flex flex-col">
          {stops.map((stop, index) => {
            const isLast = index === stops.length - 1;
            return (
              <li key={stop.label} className="relative flex gap-3 pb-2">
                <span className="flex w-6 shrink-0 flex-col items-center" aria-hidden>
                  <span
                    className={cn(
                      "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-[10.5px] font-extrabold",
                      stop.kind === "proven"
                        ? "border-success bg-success text-canvas"
                        : "border-primary-strong bg-primary text-ink",
                    )}
                  >
                    {stop.kind === "proven" ? <Check className="size-3.5" /> : stop.number}
                  </span>
                  {!isLast && <span className="w-0.5 flex-1 bg-line" />}
                </span>

                <div className="min-w-0 pb-1">
                  <p className="text-[14.5px] leading-snug font-extrabold">{stop.label}</p>
                  <p
                    className={cn(
                      "mt-0.5 text-[12px] leading-snug font-bold",
                      stop.kind === "proven" ? "text-success" : "text-primary-ink",
                    )}
                  >
                    {stop.sub}
                    {stop.minutes ? ` · ~${stop.minutes} min` : ""}
                  </p>
                </div>
              </li>
            );
          })}

          <li className="flex gap-3">
            <span className="flex w-6 shrink-0 justify-center" aria-hidden>
              <span className="grid size-6 shrink-0 place-items-center rounded-full border-2 border-primary-strong bg-primary-soft text-primary-strong">
                <Target className="size-3.5" aria-hidden />
              </span>
            </span>
            <p className="text-[14.5px] leading-snug font-extrabold">Application Ready</p>
          </li>
        </ol>

        <div className="mt-5 rounded-[var(--radius-card)] border border-line bg-surface p-4 text-center">
          <p className="text-[11px] font-semibold tracking-[0.1em] text-ink-faint uppercase">
            Estimated focused preparation
          </p>
          <p className="tnum mt-1 text-[22px] leading-none font-extrabold text-primary-ink">
            {remainingMinutes > 0 ? `~${remainingMinutes} minutes` : "Done"}
          </p>
        </div>
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside message={ROLE_PANDA.fastestRoute} />
          <Button size="lg" full href={nextHref}>
            {nextLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
