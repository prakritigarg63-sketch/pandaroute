"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PandaAside } from "@/components/panda/panda-aside";
import {
  CAPABILITY_BY_ID,
  CLASSIFICATION_LABEL,
  CLASSIFICATION_MEANING,
  reasonFor,
  type Classification,
} from "@/lib/diagnostic/capabilities";
import { classifyAnswers } from "@/lib/diagnostic/scoring";
import { useDiagnostic } from "@/lib/diagnostic/use-diagnostic";
import { challengeForCapability } from "@/lib/challenge/challenges";

/* ---------------------------------------------------------------------------
   Why a capability landed where it did.

   This is where the diagnostic pays out: the classification, the reason in the
   learner's own terms, and the one thing to do next. Skip gets a reason too —
   it is a finding, not an absence.
--------------------------------------------------------------------------- */

const PILL: Record<Classification, string> = {
  learn: "bg-learn-soft text-learn border-learn/35",
  practice: "bg-practice-soft text-practice border-practice/35",
  skip: "bg-skip-soft text-skip border-skip/35",
};

export function CapabilityDetail({ capabilityId }: { capabilityId: string }) {
  const state = useDiagnostic();
  const capability = CAPABILITY_BY_ID.get(capabilityId);
  const result = classifyAnswers(state.answers).find(
    (r) => r.capabilityId === capabilityId,
  );

  if (!capability || !result) return null;

  const classification = result.classification;
  const isSkip = classification === "skip";
  const challenge = challengeForCapability(capabilityId);

  return (
    <div className="screen">
      <Link
        href="/gap-map"
        className="-ml-2 flex min-h-11 w-fit items-center gap-1 rounded-full pr-3 pl-2 text-[14px] font-semibold text-ink-muted transition-colors hover:text-ink"
      >
        <ChevronLeft className="size-5" aria-hidden />
        Gap Map
      </Link>

      <div className="gps-rise mt-2 flex flex-1 flex-col">
        <span
          className={cn(
            "w-fit rounded-[var(--radius-pill)] border px-2.5 py-1 text-[11px] font-bold tracking-[0.08em] uppercase",
            PILL[classification],
          )}
        >
          {CLASSIFICATION_LABEL[classification]}
          {isSkip && " ✓"}
        </span>

        <h1 className="mt-2.5 text-[26px] leading-tight font-extrabold text-balance">
          {capability.name}
        </h1>
        <p className="mt-1 text-[13px] text-ink-muted">
          {CLASSIFICATION_MEANING[classification]}
        </p>

        <Card className="mt-4">
          <h2 className="text-[15px] font-bold">
            Why this is {CLASSIFICATION_LABEL[classification]}
          </h2>
          <p className="mt-1.5 text-[14px] leading-relaxed text-ink-muted">
            {reasonFor(capability, classification)}
          </p>
        </Card>

        {!isSkip && (
          <Card className="mt-2.5">
            <h2 className="text-[15px] font-bold">Your next step</h2>
            <p className="mt-1.5 text-[14px] leading-relaxed text-ink-muted">
              {capability.nextStep}
            </p>
          </Card>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        <PandaAside
          reaction={isSkip ? "celebrate" : "helpful"}
          message={
            isSkip
              ? "Your QA experience already gives you a strong foundation here. No need to start from scratch."
              : "You won't be starting cold — this builds on what you already do."
          }
        />

        {isSkip ? (
          <Button size="lg" full variant="outline" href="/gap-map">
            Back to my Gap Map
          </Button>
        ) : (
          <Button size="lg" full href={challenge ? `/challenge/${challenge.id}` : "/route"}>
            {challenge ? "Start challenge →" : "Back to my route"}
          </Button>
        )}
      </div>
    </div>
  );
}
