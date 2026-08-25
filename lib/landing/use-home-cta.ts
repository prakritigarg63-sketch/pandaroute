"use client";

import { useDiagnostic } from "@/lib/diagnostic/use-diagnostic";
import { useStartDiagnostic } from "@/lib/landing/use-start-diagnostic";

/* ---------------------------------------------------------------------------
   What the primary CTA should do, now that this page is Home rather than a
   one-shot marketing page a visitor lands on once.

   There is no authentication in this app — no account, no session — so
   "logged in" isn't a real state to branch on. The nearest honest proxy is
   the diagnostic progress that's already sitting in localStorage, which is
   exactly what the rest of the app already treats as "have they started."
   Three phases, not two: someone mid-diagnostic gets pointed back at it
   rather than being asked to start over.
--------------------------------------------------------------------------- */

export type HomeCtaPhase = "new" | "resume" | "return";

export function useHomeCta() {
  const diagnostic = useDiagnostic();
  const answered = Object.keys(diagnostic.answers).length > 0;
  const completed = diagnostic.completedAt !== null;

  const phase: HomeCtaPhase = completed ? "return" : answered ? "resume" : "new";
  const destination = phase === "return" ? "/route" : undefined; // undefined → the diagnostic entry point

  const { starting, start } = useStartDiagnostic(destination);

  return { phase, starting, start } as const;
}
