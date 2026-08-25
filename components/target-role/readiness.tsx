"use client";

import { Building2, Target } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PandaAside } from "@/components/panda/panda-aside";
import { RoleBackBar } from "@/components/target-role/shared";
import { ROLE_PANDA, TRACKED_REQUIREMENT_IDS } from "@/lib/target-role/data";
import { resolveRequirements, useTargetRole } from "@/lib/target-role/use-target-role";
import { useCareer } from "@/lib/career/use-career";

/* ---------------------------------------------------------------------------
   Final role readiness.

   The metric cards are counted, never invented: "supported" is how many of
   the tracked requirements actually resolve to proven, and the case/story
   counts are whatever the Career Kit genuinely holds — this app produces one
   of each, so it says one, not a mockup's illustrative two.
--------------------------------------------------------------------------- */

export function RoleReadiness() {
  const state = useTargetRole();
  const career = useCareer();
  const requirements = resolveRequirements(state).filter((r) =>
    TRACKED_REQUIREMENT_IDS.includes(r.id),
  );
  const supported = requirements.filter((r) => r.evidenceStatus === "proven").length;

  const evidenceRow = (id: string) => requirements.find((r) => r.id === id);

  const strongest = [
    { label: "Product Discovery", req: evidenceRow("product-discovery") },
    { label: "Prioritization", req: evidenceRow("prioritization") },
    { label: "Technical Collaboration", req: evidenceRow("engineering-collaboration") },
    { label: "Metrics", req: evidenceRow("product-metrics") },
  ].filter((row) => row.req?.evidence?.length);

  const metrics = [
    { value: requirements.length, label: "Capabilities identified" },
    { value: supported, label: "Capabilities supported" },
    { value: career.caseStatus !== "none" ? 1 : 0, label: "Relevant cases" },
    { value: career.interview?.status === "ready" ? 1 : 0, label: "Stories ready" },
  ];

  return (
    <div className="screen">
      <RoleBackBar href="/role/match-updated" />

      <div className="gps-rise mt-3 flex flex-1 flex-col">
        <h1 className="text-[23px] leading-tight font-extrabold">Your evidence is aligned 🎯</h1>

        <p className="mt-4 text-[11px] font-extrabold tracking-[0.12em] text-ink-faint uppercase">
          Target role
        </p>
        <div className="mt-1.5 flex items-center gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-3.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-tile)] bg-primary-soft text-primary-ink">
            <Target className="size-4.5" aria-hidden />
          </span>
          <span>
            <span className="block text-[16px] leading-snug font-extrabold">
              {state.roleTitle}
            </span>
            {state.company && (
              <span className="flex items-center gap-1 text-[12.5px] text-ink-muted">
                <Building2 className="size-3.5" aria-hidden />
                {state.company}
              </span>
            )}
          </span>
        </div>

        <ul className="mt-4 grid grid-cols-4 gap-2">
          {metrics.map((metric) => (
            <li
              key={metric.label}
              className="rounded-[var(--radius-card)] border border-line bg-surface px-1 py-2.5 text-center"
            >
              <p className="tnum text-[18px] leading-none font-extrabold">{metric.value}</p>
              <p className="mt-1 text-[10px] leading-tight text-ink-muted">{metric.label}</p>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-[11px] font-extrabold tracking-[0.12em] text-ink-faint uppercase">
          Strongest evidence for this role
        </p>
        <ul className="mt-2 flex flex-col gap-2">
          {strongest.map((row) => (
            <li key={row.label}>
              <Card padded={false} className="p-3.5">
                <p className="text-[14px] leading-snug font-extrabold">{row.label}</p>
                <p className="mt-0.5 text-[13px] leading-snug text-ink-muted">
                  {row.req!.evidence!.join(", ")}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside message={ROLE_PANDA.readiness} />
          <Button size="lg" full href="/role/prepare">
            Prepare my application →
          </Button>
        </div>
      </div>
    </div>
  );
}
