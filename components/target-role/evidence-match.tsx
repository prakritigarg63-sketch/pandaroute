"use client";

import { Check, Circle, CircleDot } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PandaAside } from "@/components/panda/panda-aside";
import { RoleBackBar, STATUS_STYLE } from "@/components/target-role/shared";
import { ROLE_PANDA, TRACKED_REQUIREMENT_IDS } from "@/lib/target-role/data";
import { resolveRequirements, useTargetRole } from "@/lib/target-role/use-target-role";
import type { EvidenceStatus } from "@/lib/target-role/data";

/* ---------------------------------------------------------------------------
   Evidence match — proven, developing, not yet proven.

   Deliberately not a percentage. §"Do not become an ATS" is the whole point
   of this screen: three honest categories, each with a reason, never a single
   number pretending to summarise them.
--------------------------------------------------------------------------- */

const ICON: Record<EvidenceStatus, typeof Check> = {
  proven: Check,
  developing: CircleDot,
  "not-proven": Circle,
};

const SECTION_TITLE: Record<EvidenceStatus, string> = {
  proven: "Proven",
  developing: "Developing",
  "not-proven": "Not yet proven",
};

export function EvidenceMatch() {
  const state = useTargetRole();
  const requirements = resolveRequirements(state).filter((r) =>
    TRACKED_REQUIREMENT_IDS.includes(r.id),
  );

  const groups: Record<EvidenceStatus, typeof requirements> = {
    proven: requirements.filter((r) => r.evidenceStatus === "proven"),
    developing: requirements.filter((r) => r.evidenceStatus === "developing"),
    "not-proven": requirements.filter((r) => r.evidenceStatus === "not-proven"),
  };

  return (
    <div className="screen">
      <RoleBackBar href="/role/breakdown" />

      <div className="gps-rise mt-3 flex flex-1 flex-col">
        <h1 className="text-[23px] leading-tight font-extrabold text-balance">
          You already have proof for a lot of this. 👀
        </h1>

        {(["proven", "developing", "not-proven"] as EvidenceStatus[]).map((status) => {
          if (groups[status].length === 0) return null;
          const style = STATUS_STYLE[status];
          const Icon = ICON[status];

          return (
            <section key={status} className="mt-5">
              <h2
                className={cn(
                  "text-[11px] font-extrabold tracking-[0.14em] uppercase",
                  style.text,
                )}
              >
                {SECTION_TITLE[status]}
              </h2>

              <ul className="mt-2 flex flex-col gap-2">
                {groups[status].map((requirement) => (
                  <li key={requirement.id}>
                    <Card padded={false} className={cn("p-3.5", style.border, style.bg)}>
                      <div className="flex items-start gap-2.5">
                        <Icon className={cn("mt-0.5 size-4 shrink-0", style.text)} aria-hidden />
                        <div className="min-w-0">
                          <p className="text-[14.5px] leading-snug font-extrabold">
                            {requirement.capability}
                          </p>
                          {requirement.evidence && (
                            <p className="mt-0.5 text-[13px] leading-snug font-semibold text-ink">
                              {requirement.evidence.join(", ")}
                            </p>
                          )}
                          {requirement.gapNote && (
                            <p className="mt-0.5 text-[12.5px] leading-snug text-ink-muted">
                              {requirement.gapNote}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside message={ROLE_PANDA.evidenceMatch} />
          <Button size="lg" full href="/role/gaps">
            See what to work on →
          </Button>
        </div>
      </div>
    </div>
  );
}
