"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PandaAside } from "@/components/panda/panda-aside";
import { RoleBackBar } from "@/components/target-role/shared";
import { ROLE_PANDA, TRACKED_REQUIREMENT_IDS } from "@/lib/target-role/data";
import { resolveRequirements, useTargetRole } from "@/lib/target-role/use-target-role";

/* ---------------------------------------------------------------------------
   The application gap map.

   Same six requirements as the Evidence Match screen, regrouped around what
   to DO rather than what they ARE: ready to use, strengthen, build proof. The
   proven ones get a section too — not everything here is a problem.
--------------------------------------------------------------------------- */

export function ApplicationGapMap() {
  const state = useTargetRole();
  const requirements = resolveRequirements(state).filter((r) =>
    TRACKED_REQUIREMENT_IDS.includes(r.id),
  );

  const ready = requirements.filter((r) => r.evidenceStatus === "proven");
  const strengthen = requirements.find((r) => r.id === "prioritization" && !state.prioritizationProven);
  const buildProof = requirements.find((r) => r.id === "roadmap-thinking" && !state.roadmapProven);

  return (
    <div className="screen">
      <RoleBackBar href="/role/evidence" />

      <div className="gps-rise mt-3 flex flex-1 flex-col">
        <h1 className="text-[23px] leading-tight font-extrabold">Your gap map for this role</h1>

        <h2 className="mt-5 flex items-center gap-1.5 text-[12px] font-extrabold tracking-[0.1em] text-success uppercase">
          Ready to use <Check className="size-3.5" aria-hidden />
        </h2>
        <ul className="mt-2 grid grid-cols-2 gap-2">
          {ready.map((r) => (
            <li
              key={r.id}
              className="rounded-[var(--radius-card)] border border-success/30 bg-skip-soft p-3"
            >
              <p className="text-[13.5px] leading-snug font-extrabold">{r.capability}</p>
              <p className="mt-1 text-[10px] font-bold tracking-[0.08em] text-success uppercase">
                Proven
              </p>
            </li>
          ))}
        </ul>

        {strengthen && (
          <>
            <h2 className="mt-5 text-[12px] font-extrabold tracking-[0.1em] text-primary-ink uppercase">
              Strengthen ◐
            </h2>
            <Card className="mt-2 border-primary-strong/35 bg-primary-soft">
              <p className="text-[15px] leading-snug font-extrabold">{strengthen.capability}</p>
              <p className="mt-1 text-[13px] leading-snug text-ink-muted">{strengthen.gapNote}</p>
              <p className="mt-2 text-[12.5px] font-bold text-primary-ink">
                ~{strengthen.minutes} min challenge
              </p>
              <Button size="md" full className="mt-3" href="/role/challenge">
                Strengthen →
              </Button>
            </Card>
          </>
        )}

        {buildProof && (
          <>
            <h2 className="mt-5 text-[12px] font-extrabold tracking-[0.1em] text-error uppercase">
              Build proof ○
            </h2>
            <Card className="mt-2 border-error/25 bg-error-soft">
              <p className="text-[15px] leading-snug font-extrabold">{buildProof.capability}</p>
              <p className="mt-1 text-[13px] leading-snug text-ink-muted">{buildProof.gapNote}</p>
              <p className="mt-2 text-[12.5px] font-bold text-error">
                ~{buildProof.minutes} min challenge
              </p>
              <Button
                size="md"
                full
                variant="outline"
                className="mt-3 border-error/35"
                href="/role/route"
              >
                Build proof →
              </Button>
            </Card>
          </>
        )}
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside message={ROLE_PANDA.gapMap} />
          <Button size="lg" full href="/role/route">
            See my fastest route →
          </Button>
        </div>
      </div>
    </div>
  );
}
