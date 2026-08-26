"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics";
import { isValidEmail } from "@/lib/auth/use-login";
import { saveProfileIdentity } from "@/lib/profile/use-profile";

/* ---------------------------------------------------------------------------
   Signup — the same honest prototype as login.

   No backend, no Firebase, no account store — see use-login.ts for the full
   reasoning. "Create an account" here means: validate the form for real,
   then treat any syntactically valid submission as a new signup and hand off
   to Home. There is no way to check whether the email "already exists"
   without a real user store, so that branch from the brief isn't
   implemented — every valid submission takes the new-user path.
--------------------------------------------------------------------------- */

const DESTINATION = "/home";
const SUBMIT_MS = 550;
const CELEBRATE_MS = 550;
const MIN_PASSWORD_LENGTH = 6;

export interface SignupFieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function validateSignup(
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
): SignupFieldErrors {
  const errors: SignupFieldErrors = {};
  if (!name.trim()) errors.name = "Enter your full name.";
  if (!email.trim()) errors.email = "Enter your email address.";
  else if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
  if (!password) errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  else if (password.length < MIN_PASSWORD_LENGTH)
    errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  if (!confirmPassword) errors.confirmPassword = "Confirm your password.";
  else if (confirmPassword !== password) errors.confirmPassword = "Passwords don't match.";
  return errors;
}

export type SignupPhase = "idle" | "submitting" | "success";

export function useSignup() {
  const router = useRouter();
  const [phase, setPhase] = useState<SignupPhase>("idle");
  const guard = useRef(false);

  const submit = useCallback(
    (name: string, email: string, password: string, confirmPassword: string): SignupFieldErrors => {
      const errors = validateSignup(name, email, password, confirmPassword);
      if (Object.keys(errors).length > 0) return errors;
      if (guard.current) return {};
      guard.current = true;

      setPhase("submitting");
      track("signup_started");

      window.setTimeout(() => {
        setPhase("success");
        track("signup_succeeded");
        saveProfileIdentity({ name: name.trim(), email: email.trim() });
        window.setTimeout(() => router.push(DESTINATION), CELEBRATE_MS);
      }, SUBMIT_MS);

      return {};
    },
    [router],
  );

  return { phase, submit } as const;
}
