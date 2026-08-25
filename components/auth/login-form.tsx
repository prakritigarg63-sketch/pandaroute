"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Compass, Lock, Mail } from "lucide-react";
import { FormField } from "@/components/auth/form-field";
import { DiagnosticButtonContent } from "@/components/landing/shared";
import { useReducedMotionPreference } from "@/lib/landing/use-reduced-motion";
import { type LoginFieldErrors, type LoginPhase } from "@/lib/auth/use-login";

/* ---------------------------------------------------------------------------
   Email, password, forgot-password, submit — the screen's actual job.

   Errors are per-field and appear only on submit, not while typing: a
   returning user shouldn't see "enter a valid email" flash red while they're
   still mid-keystroke.
--------------------------------------------------------------------------- */

export function LoginForm({
  phase,
  onSubmit,
  entranceDelayS = 0,
}: {
  phase: LoginPhase;
  onSubmit: (email: string, password: string) => LoginFieldErrors;
  /** Base delay the field-by-field entrance sequence starts from. */
  entranceDelayS?: number;
}) {
  const reduced = useReducedMotionPreference();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginFieldErrors>({});
  const [shake, setShake] = useState(false);

  const submitting = phase === "submitting";
  const succeeded = phase === "success";

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (submitting || succeeded) return;

      const next = onSubmit(email, password);
      setErrors(next);

      if (Object.keys(next).length > 0) {
        setShake(true);
        window.setTimeout(() => setShake(false), 220);
      }
    },
    [email, password, onSubmit, submitting, succeeded],
  );

  const rise = (delayS: number) => ({
    initial: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduced ? 0 : 0.32, delay: reduced ? 0 : delayS, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      <motion.div {...rise(entranceDelayS)}>
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
          disabled={submitting || succeeded}
        />
      </motion.div>

      <motion.div
        {...rise(entranceDelayS + 0.08)}
        animate={shake ? { x: [0, -3, 3, -2, 0], opacity: 1, y: 0 } : { opacity: 1, y: 0, x: 0 }}
      >
        <FormField
          label="Password"
          icon={Lock}
          revealable
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          disabled={submitting || succeeded}
        />
      </motion.div>

      <motion.div className="flex justify-end" {...rise(entranceDelayS + 0.16)}>
        <a
          href="#"
          className="flex min-h-11 items-center text-[13.5px] font-bold text-primary-ink transition-colors hover:text-primary-strong"
        >
          Forgot password?
        </a>
      </motion.div>

      <motion.button
        type="submit"
        disabled={submitting || succeeded}
        aria-busy={submitting}
        className="quest-cta mt-1 flex min-h-14 w-full items-center justify-center gap-2.5 rounded-[18px] bg-primary text-[17px] font-bold text-ink disabled:cursor-default"
        whileTap={submitting || succeeded ? undefined : { scale: 0.98 }}
        whileHover={submitting || succeeded ? undefined : { y: -2 }}
        {...rise(entranceDelayS + 0.24)}
      >
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-canvas text-ink">
          {submitting ? (
            <Compass className="size-4 animate-spin [animation-duration:1.1s]" aria-hidden />
          ) : (
            <Compass className="size-4" aria-hidden />
          )}
        </span>
        <DiagnosticButtonContent
          starting={submitting}
          busyLabel="Finding your route…"
          idleLabel={succeeded ? "Welcome back! →" : "Continue my journey →"}
        />
      </motion.button>

      <p role="status" aria-live="polite" className="sr-only">
        {submitting ? "Finding your route…" : succeeded ? "Welcome back." : ""}
      </p>
    </form>
  );
}
