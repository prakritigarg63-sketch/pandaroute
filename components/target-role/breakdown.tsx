"use client";

import { Award, BarChart3, Blocks, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PandaAside } from "@/components/panda/panda-aside";
import { RoleBackBar, ImportanceBadge } from "@/components/target-role/shared";
import { CATEGORY_LABEL, ROLE_PANDA, ROLE_REQUIREMENTS } from "@/lib/target-role/data";
import type { RequirementCategory } from "@/lib/target-role/data";

/* ---------------------------------------------------------------------------
   Role breakdown — grouped, not a keyword list.

   Nine requirements read as four short cards instead of one long list, which
   is the difference between "here's what this role needs" and a wall of
   extracted nouns.
--------------------------------------------------------------------------- */

const CATEGORY_ICON: Record<RequirementCategory, typeof Blocks> = {
  "product-thinking": Blocks,
  "data-decisions": BarChart3,
  "technical-fluency": Award,
  collaboration: Users,
};

const CATEGORY_ORDER: RequirementCategory[] = [
  "product-thinking",
  "data-decisions",
  "technical-fluency",
  "collaboration",
];

export function RoleBreakdown() {
  return (
    <div className="screen">
      <RoleBackBar href="/role/add" />

      <div className="gps-rise mt-3 flex flex-1 flex-col">
        <h1 className="text-[23px] leading-tight font-extrabold text-balance">
          Here&apos;s what this role actually needs
        </h1>
        <p className="mt-1.5 text-[13.5px] leading-snug text-ink-muted">
          We&apos;ve grouped the requirements into capability areas.
        </p>

        <ul className="mt-4 flex flex-col gap-2.5">
          {CATEGORY_ORDER.map((category) => {
            const Icon = CATEGORY_ICON[category];
            const rows = ROLE_REQUIREMENTS.filter((r) => r.category === category);

            return (
              <li key={category}>
                <Card>
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-8 shrink-0 place-items-center rounded-[var(--radius-tile)] bg-primary-soft text-primary-ink">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <p className="text-[15px] font-extrabold">{CATEGORY_LABEL[category]}</p>
                  </div>

                  <ul className="mt-3 flex flex-col gap-2 border-t border-line pt-3">
                    {rows.map((row) => (
                      <li
                        key={row.id}
                        className="flex items-center justify-between gap-2 text-[14px] font-semibold"
                      >
                        {row.capability}
                        <ImportanceBadge importance={row.importance} />
                      </li>
                    ))}
                  </ul>
                </Card>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside message={ROLE_PANDA.breakdown} />
          <Button size="lg" full href="/role/evidence">
            Check my match →
          </Button>
        </div>
      </div>
    </div>
  );
}
