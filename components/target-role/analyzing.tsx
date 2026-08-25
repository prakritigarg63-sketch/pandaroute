"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { PandaMascot } from "@/components/panda/panda-mascot";
import { Progress } from "@/components/ui/Progress";
import { finishRoleAnalysis } from "@/lib/target-role/use-target-role";

/* ---------------------------------------------------------------------------
   Mapping the role.

   The same shape as the capstone's route-mapping screen: not a spinner, a
   short sequence of real steps, shown while they happen, advancing on its own
   once they're done. ~1.5s total, matching the brief.
--------------------------------------------------------------------------- */

const CHECKS = [
  "Core PM capabilities",
  "Technical expectations",
  "Domain knowledge",
  "Collaboration skills",
  "Evidence requirements",
];

const PIPELINE = [
  { id: "jd", label: "Job description", tone: "sky" },
  { id: "capabilities", label: "Capabilities", tone: "success" },
  { id: "proof", label: "Your proof", tone: "success" },
  { id: "gaps", label: "Gaps", tone: "error" },
] as const;

const CHECK_STEP_MS = 180;
const TOTAL_MS = 1500;

export function AnalyzingRole() {
  const router = useRouter();
  const [checked, setChecked] = useState(0);

  useEffect(() => {
    const checkTimers = CHECKS.map((_, i) =>
      window.setTimeout(() => setChecked(i + 1), (i + 1) * CHECK_STEP_MS),
    );
    const done = window.setTimeout(() => {
      finishRoleAnalysis();
      router.replace("/role/breakdown");
    }, TOTAL_MS);

    return () => {
      checkTimers.forEach(window.clearTimeout);
      window.clearTimeout(done);
    };
  }, [router]);

  return (
    <div className="screen items-center justify-center gap-5 text-center">
      <h1 className="text-[24px] leading-tight font-extrabold">Mapping this role… 📈</h1>

      <PandaMascot reaction="thinking" size="large" />

      <ul className="flex w-full flex-col gap-1.5 text-left">
        {CHECKS.map((label, i) => (
          <li
            key={label}
            className="flex items-center gap-2.5 rounded-[var(--radius-tile)] px-1 py-1 text-[13.5px] leading-snug font-semibold transition-opacity duration-300"
            style={{ opacity: i < checked ? 1 : 0.35 }}
          >
            <span
              className={cn(
                "flex size-4.5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                i < checked ? "border-success bg-success" : "border-line",
              )}
            >
              {i < checked && <Check className="size-3 text-canvas" aria-hidden />}
            </span>
            {label}
          </li>
        ))}
      </ul>

      <div className="flex w-full flex-col items-center gap-1.5" aria-hidden>
        {PIPELINE.map((step, i) => (
          <div key={step.id} className="flex w-full flex-col items-center gap-1.5">
            <span
              className={cn(
                "w-full rounded-[var(--radius-tile)] border py-2 text-center text-[12.5px] font-bold tracking-[0.04em] uppercase",
                step.tone === "sky" && "border-sky/35 bg-sky-soft text-sky",
                step.tone === "success" && "border-success/30 bg-skip-soft text-success",
                step.tone === "error" && "border-error/25 bg-error-soft text-error",
              )}
            >
              {step.label}
            </span>
            {i < PIPELINE.length - 1 && (
              <span className="text-[13px] text-ink-faint">↓</span>
            )}
          </div>
        ))}
      </div>

      <div className="w-full">
        <p className="text-[12.5px] font-semibold text-ink-muted">
          This will just take a few seconds…
        </p>
        <Progress
          value={checked}
          max={CHECKS.length}
          label="Mapping this role"
          className="mt-2"
        />
      </div>
    </div>
  );
}
