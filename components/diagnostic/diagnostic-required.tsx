"use client";

import { Button } from "@/components/ui/Button";
import { PandaMascot } from "@/components/panda/panda-mascot";
import { BottomNav } from "@/components/layout/bottom-nav";
import { TOTAL_QUESTIONS } from "@/lib/diagnostic/questions";
import { answeredCount, useDiagnostic } from "@/lib/diagnostic/use-diagnostic";

/* ---------------------------------------------------------------------------
   Shown in place of any screen built from diagnostic results when there are
   no results yet.

   Without this, those screens classify an empty answer set — every capability
   comes back Learn — and present that as the learner's map. That is an
   invented finding, which is the one thing this product promises not to make.

   Destinations match the Home CTA (use-home-cta.ts): a new learner goes
   through Signup, someone partway through goes back to the diagnostic entry,
   which offers "Continue" from where they stopped.
--------------------------------------------------------------------------- */

export function DiagnosticRequired({ title, active }: { title: string; active: string }) {
  const diagnostic = useDiagnostic();
  const answered = answeredCount(diagnostic);
  const resuming = answered > 0;

  return (
    <div className="screen screen-flush">
      <h1 className="text-[24px] leading-tight font-extrabold text-balance">{title}</h1>

      <div className="gps-rise flex flex-1 flex-col items-center justify-center gap-3 py-8 text-center">
        <PandaMascot reaction="welcome" size="medium" />

        <p className="text-[18px] leading-snug font-extrabold text-balance">
          {resuming ? "Your route is still being drawn" : "Your route starts with the diagnostic"}
        </p>
        <p className="max-w-[20rem] text-[14px] leading-relaxed text-ink-muted text-balance">
          {resuming
            ? `You've worked through ${answered} of ${TOTAL_QUESTIONS} scenarios. Finish them and this fills in with what you already have and what to work on next.`
            : `${TOTAL_QUESTIONS} workplace scenarios, 10–15 minutes. Once they're done, this shows what you already have and what to work on next.`}
        </p>

        <Button size="lg" full className="mt-2 max-w-xs" href={resuming ? "/onboarding" : "/signup"}>
          {resuming ? "Continue the diagnostic →" : "Start the diagnostic →"}
        </Button>
      </div>

      <BottomNav active={active} />
    </div>
  );
}
