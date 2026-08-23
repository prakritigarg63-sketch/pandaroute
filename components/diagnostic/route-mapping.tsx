"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { PandaMascot } from "@/components/panda/panda-mascot";
import { CAPABILITY_BY_ID } from "@/lib/diagnostic/capabilities";
import { classifyAnswers } from "@/lib/diagnostic/scoring";
import { useDiagnostic } from "@/lib/diagnostic/use-diagnostic";

/* ---------------------------------------------------------------------------
   Mapping the route.

   Not a spinner. The capabilities the learner just answered for appear around
   Panda, then sort themselves into Learn, Practice and Skip — the work being
   done, shown while it happens, in about a second and a half.

   Under reduced motion the sort still happens, it just arrives already sorted.
--------------------------------------------------------------------------- */

const APPEAR_MS = 600;
const SORT_MS = 1500;

const COLUMN_STYLE: Record<string, string> = {
  learn: "border-learn/40 bg-learn-soft text-learn",
  practice: "border-practice/40 bg-practice-soft text-practice",
  skip: "border-skip/40 bg-skip-soft text-skip",
};

export function RouteMapping() {
  const router = useRouter();
  const state = useDiagnostic();
  const [phase, setPhase] = useState<"appear" | "sorted">("appear");

  const results = classifyAnswers(state.answers);

  useEffect(() => {
    const sort = window.setTimeout(() => setPhase("sorted"), APPEAR_MS);
    const done = window.setTimeout(() => router.replace("/diagnostic/complete"), SORT_MS);

    return () => {
      window.clearTimeout(sort);
      window.clearTimeout(done);
    };
  }, [router]);

  return (
    <div className="screen items-center justify-center gap-5 text-center">
      <PandaMascot reaction="thinking" size="large" />

      <div>
        <h1 className="text-[24px] leading-tight font-extrabold">Mapping your route…</h1>
        <p className="mt-1.5 text-[14px] leading-relaxed text-ink-muted text-balance">
          Connecting your experience with the capabilities you&apos;ll need as a PM.
        </p>
      </div>

      <ul className="flex flex-wrap items-center justify-center gap-1.5" aria-hidden>
        {results.map((result, i) => {
          const capability = CAPABILITY_BY_ID.get(result.capabilityId);
          if (!capability) return null;

          return (
            <li
              key={result.capabilityId}
              className={cn(
                "route-chip rounded-[var(--radius-pill)] border px-2.5 py-1 text-[12px] font-semibold transition-colors duration-500",
                phase === "sorted"
                  ? COLUMN_STYLE[result.classification]
                  : "border-line bg-surface text-ink-muted",
              )}
              style={{ animationDelay: `${i * 45}ms` }}
            >
              {capability.name}
            </li>
          );
        })}
      </ul>

      <p role="status" className="sr-only">
        Mapping your route
      </p>
    </div>
  );
}
