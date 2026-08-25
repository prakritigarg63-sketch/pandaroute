"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Compass, Lock, Mail, UserRound } from "lucide-react";
import { FormField } from "@/components/auth/form-field";
import { DiagnosticButtonContent } from "@/components/landing/shared";
import { useReducedMotionPreference } from "@/lib/landing/use-reduced-motion";
import { type SignupFieldErrors, type SignupPhase } from "@/lib/auth/use-signup";

/* ---------------------------------------------------------------------------
   Full name, email, password, confirm password — the account itself.

   Same shape as login-form.tsx (per-field errors on submit, not while
   typing; one guarded submit), one field longer.
--------------------------------------------------------------------------- */

export function SignupForm({
  phase,
  onSubmit,
  entranceDelayS = 0,
}: {
  phase: SignupPhase;
  onSubmit: (name: string, email: string, password: string, confirmPassword: string) => SignupFieldErrors;
  entranceDelayS?: number;
}) {
  const reduced = useReducedMotionPreference();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<SignupFieldErrors>({});
  const [shake, setShake] = useState(false);

  const submitting = phase === "submitting";
  const succeeded = phase === "success";

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (submitting || succeeded) return;

      const next = onSubmit(name, email, password, confirmPassword);
      setErrors(next);

      if (Object.keys(next).length > 0) {
        setShake(true);
        window.setTimeout(() => setShake(false), 220);
      }
    },
    [name, email, password, confirmPassword, onSubmit, submitting, succeeded],
  );

  const rise = (delayS: number) => ({
    initial: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduced ? 0 : 0.32, delay: reduced ? 0 : delayS, ease: [0.22, 1, 0.36, 1] as const },
  });

  const disabled = submitting || succeeded;

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      <motion.div {...rise(entranceDelayS)}>
        <FormField
          label="Full name"
          icon={UserRound}
          type="text"
          autoComplete="name"
          placeholder="Enter your full name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={errors.name}
          disabled={disabled}
        />
      </motion.div>

      <motion.div {...rise(entranceDelayS + 0.06)}>
        <FormField
          label="Email address"
          icon={Mail}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
          disabled={disabled}
        />
      </motion.div>

      <motion.div
        {...rise(entranceDelayS + 0.12)}
        animate={shake ? { x: [0, -3, 3, -2, 0], opacity: 1, y: 0 } : { opacity: 1, y: 0, x: 0 }}
      >
        <FormField
          label="Password"
          icon={Lock}
          revealable
          autoComplete="new-password"
          placeholder="Create a password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          disabled={disabled}
        />
      </motion.div>

      <motion.div
        {...rise(entranceDelayS + 0.18)}
        animate={shake ? { x: [0, -3, 3, -2, 0], opacity: 1, y: 0 } : { opacity: 1, y: 0, x: 0 }}
      >
        <FormField
          label="Confirm password"
          icon={Lock}
          revealable
          autoComplete="new-password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          error={errors.confirmPassword}
          disabled={disabled}
        />
      </motion.div>

      <motion.button
        type="submit"
        disabled={disabled}
        aria-busy={submitting}
        className="quest-cta mt-1 flex min-h-14 w-full items-center justify-center gap-2.5 rounded-[18px] bg-primary text-[17px] font-bold text-ink disabled:cursor-default"
        whileTap={disabled ? undefined : { scale: 0.98 }}
        whileHover={disabled ? undefined : { y: -2 }}
        {...rise(entranceDelayS + 0.26)}
      >
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-canvas text-ink">
          <Compass
            className={submitting ? "size-4 animate-spin [animation-duration:1.1s]" : "size-4"}
            aria-hidden
          />
        </span>
        <DiagnosticButtonContent
          starting={submitting}
          busyLabel="Creating your account…"
          idleLabel={succeeded ? "Welcome to PandaRoute! →" : "Create my account →"}
        />
      </motion.button>

      <p role="status" aria-live="polite" className="sr-only">
        {submitting ? "Creating your account…" : succeeded ? "Account created." : ""}
      </p>
    </form>
  );
}
