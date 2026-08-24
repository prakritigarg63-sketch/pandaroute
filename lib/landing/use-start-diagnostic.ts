"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics";

/* ---------------------------------------------------------------------------
   startDiagnostic().

   Every CTA on the page — hero, header menu, floating bar, final card — calls
   this same function, so "preparing your route…" and the disabled state are
   one piece of shared state rather than four buttons independently guessing
   at each other's timing.

   Destination: this landing page has no diagnostic context of its own — no
   role, no experience level, nothing the diagnostic needs — so it hands off to
   the app's existing entry point (Meet Panda → confirm the transition →
   diagnostic) rather than jumping straight into a QA→PM diagnostic with no
   setup. See the summary for this as a stated assumption.
--------------------------------------------------------------------------- */

const ENTRY_ROUTE = "/onboarding";
const HANDOFF_MS = 650;

export function useStartDiagnostic() {
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const guard = useRef(false);

  const start = useCallback(() => {
    if (guard.current) return;
    guard.current = true;

    setStarting(true);
    track("diagnostic_started", { from: "landing" });

    window.setTimeout(() => router.push(ENTRY_ROUTE), HANDOFF_MS);
  }, [router]);

  return { starting, start } as const;
}
