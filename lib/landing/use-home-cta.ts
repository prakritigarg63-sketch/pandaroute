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

   "new" is the one phase with no progress to protect, so it's also the one
   place a sign-in gate belongs: send them to create an account first — this
   is by definition someone who has never been through the diagnostic here,
   so Signup's "welcome, future pathfinder" framing is the one that's true,
   not Login's "welcome back". Login stays one tap away from Signup for
   anyone who already has progress on another device. Signup hands off to
   the diagnostic's entry point from there (see use-signup.ts). Someone
   already mid-diagnostic or already done isn't asked to sign in again just
   to keep going.
--------------------------------------------------------------------------- */

export type HomeCtaPhase = "new" | "resume" | "return";

export function useHomeCta() {
  const diagnostic = useDiagnostic();
  const answered = Object.keys(diagnostic.answers).length > 0;
  const completed = diagnostic.completedAt !== null;

  const phase: HomeCtaPhase = completed ? "return" : answered ? "resume" : "new";
  const destination = phase === "return" ? "/route" : phase === "new" ? "/signup" : undefined; // undefined → the diagnostic entry point

  const { starting, start } = useStartDiagnostic(destination);

  return { phase, starting, start } as const;
}
