"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Check, ClipboardList, FolderOpen, Mic } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RoleBackBar } from "@/components/target-role/shared";
import { CAPSTONE } from "@/lib/capstone/capstone";
import { CATEGORY_LABEL, TRACKED_REQUIREMENT_IDS } from "@/lib/target-role/data";
import {
  markRolePrepared,
  resolveRequirements,
  selectPortfolioCase,
  useTargetRole,
} from "@/lib/target-role/use-target-role";

/* ---------------------------------------------------------------------------
   Application prep — three things to walk in with: a case, likely interview
   ground, and a checklist confirming the evidence actually exists.
--------------------------------------------------------------------------- */

const INTERVIEW_FOCUS = ["Prioritization", "Product Metrics", "Stakeholder Management"];

export function ApplicationPrep() {
  const router = useRouter();
  const state = useTargetRole();
  const requirements = resolveRequirements(state).filter((r) =>
    TRACKED_REQUIREMENT_IDS.includes(r.id),
  );

  // One row per category the role breakdown groups by, checked once every
  // tracked requirement inside it resolves to proven.
  const checklist = (Object.keys(CATEGORY_LABEL) as Array<keyof typeof CATEGORY_LABEL>).map(
    (category) => {
      const rows = requirements.filter((r) => r.category === category);
      const proven = rows.length === 0 || rows.every((r) => r.evidenceStatus === "proven");
      return { category, label: CATEGORY_LABEL[category], proven };
    },
  );

  const finish = useCallback(() => {
    markRolePrepared();
    router.push("/career-kit");
  }, [router]);

  return (
    <div className="screen">
      <RoleBackBar href="/role/readiness" />

      <div className="gps-rise mt-3 flex flex-1 flex-col">
        <h1 className="text-[23px] leading-tight font-extrabold">Prepare for this role 💼</h1>

        <p className="mt-5 flex items-center gap-2 text-[13px] font-extrabold tracking-[0.1em] text-ink-faint uppercase">
          <FolderOpen className="size-4 text-primary-strong" aria-hidden />
          Choose portfolio proof
        </p>
        <Card
          padded={false}
          role="checkbox"
          aria-checked={state.portfolioSelected}
          tabIndex={0}
          onClick={() => selectPortfolioCase(!state.portfolioSelected)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              selectPortfolioCase(!state.portfolioSelected);
            }
          }}
          className={cn(
            "mt-2 cursor-pointer p-3.5 outline-none",
            state.portfolioSelected && "border-success/35 bg-skip-soft",
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-[15px] leading-snug font-extrabold">{CAPSTONE.proof.title}</p>
            {state.portfolioSelected && (
              <span className="flex shrink-0 items-center gap-1 text-[11px] font-bold text-success">
                <Check className="size-3.5" aria-hidden />
                Selected
              </span>
            )}
          </div>
          <p className="mt-1 text-[12.5px] leading-snug text-ink-muted">
            Relevant to Product Discovery, Metrics and AI Product Thinking.
          </p>
        </Card>

        <p className="mt-5 flex items-center gap-2 text-[13px] font-extrabold tracking-[0.1em] text-ink-faint uppercase">
          <Mic className="size-4 text-primary-strong" aria-hidden />
          Practice likely interview areas
        </p>
        <p className="mt-1.5 text-[13px] text-ink-muted">Based on what this role emphasizes:</p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {INTERVIEW_FOCUS.map((focus) => (
            <li
              key={focus}
              className="rounded-[var(--radius-pill)] border border-line bg-surface px-2.5 py-1 text-[12px] font-semibold"
            >
              {focus}
            </li>
          ))}
        </ul>
        <Button size="md" full className="mt-3" href="/interview">
          Practice interview →
        </Button>

        <p className="mt-5 flex items-center gap-2 text-[13px] font-extrabold tracking-[0.1em] text-ink-faint uppercase">
          <ClipboardList className="size-4 text-primary-strong" aria-hidden />
          Evidence checklist
        </p>
        <ul className="mt-2 flex flex-col gap-1.5">
          {checklist.map((row) => (
            <li
              key={row.category}
              className="flex items-center gap-2.5 rounded-[var(--radius-card)] border border-line bg-surface px-3.5 py-2.5"
            >
              {row.proven ? (
                <Check className="size-4 shrink-0 text-success" aria-hidden />
              ) : (
                <span className="size-3.5 shrink-0 rounded-full border-2 border-line" aria-hidden />
              )}
              <span className="text-[13.5px] leading-snug font-semibold">{row.label}</span>
            </li>
          ))}
        </ul>
        <Button size="md" full variant="outline" className="mt-3" href="/role/evidence">
          View evidence →
        </Button>
      </div>

      <div className="sticky-cta">
        <Button size="lg" full onClick={finish}>
          Finish role prep →
        </Button>
      </div>
    </div>
  );
}
