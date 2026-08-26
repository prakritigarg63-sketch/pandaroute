"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics";
import { useDiagnostic } from "@/lib/diagnostic/use-diagnostic";

/* ---------------------------------------------------------------------------
   Login — a prototype, honestly.

   There is no backend anywhere in this app: every screen so far is
   localStorage state (see the use-*.ts hooks under lib/). This form is real — real
   validation, a real disabled/loading state, a real success moment — but
   "authentication" is deterministic, the same way the diagnostic and the
   challenges are: a syntactically valid email plus a non-empty password
   succeeds. Nothing is checked against a stored account, because none exist.
   See the summary for this as a stated assumption, not an oversight.

   Destination: Home's "new" phase sends people to Signup, not here — this
   screen is reached by choice (the "Already have an account? Sign in" link)
   or a bookmark, so it still needs its own fallback: no diagnostic answers
   in this browser yet means there's nothing on /route to show, so that case
   lands on the diagnostic's entry point instead. A returning user with
   progress goes straight to their route.
--------------------------------------------------------------------------- */

const AUTH_MS = 550;
const CELEBRATE_MS = 550;

export interface LoginFieldErrors {
  email?: string;
  password?: string;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function validateLogin(email: string, password: string): LoginFieldErrors {
  const errors: LoginFieldErrors = {};
  if (!email.trim()) errors.email = "Enter your email address.";
  else if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
  if (!password.trim()) errors.password = "Enter your password to continue.";
  return errors;
}

export type LoginPhase = "idle" | "submitting" | "success";

export function useLogin() {
  const router = useRouter();
  const diagnostic = useDiagnostic();
  const isNewUser = Object.keys(diagnostic.answers).length === 0;
  const [phase, setPhase] = useState<LoginPhase>("idle");
  const guard = useRef(false);

  const submit = useCallback(
    (email: string, password: string): LoginFieldErrors => {
      const errors = validateLogin(email, password);
      if (Object.keys(errors).length > 0) return errors;
      if (guard.current) return {};
      guard.current = true;

      setPhase("submitting");
      track("login_started", { newUser: isNewUser });

      window.setTimeout(() => {
        setPhase("success");
        track("login_succeeded");
        window.setTimeout(() => router.push(isNewUser ? "/onboarding" : "/route"), CELEBRATE_MS);
      }, AUTH_MS);

      return {};
    },
    [router, isNewUser],
  );

  return { phase, submit } as const;
}
