"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { Lock } from "lucide-react";
import { PandaWelcome } from "@/components/auth/panda-welcome";
import { SignupForm } from "@/components/auth/signup-form";
import { SocialButtons } from "@/components/auth/social-buttons";
import { useSignup } from "@/lib/auth/use-signup";
import { useReducedMotionPreference } from "@/lib/landing/use-reduced-motion";

/* ---------------------------------------------------------------------------
   The signup screen.

   Structurally the login screen's sibling — same header lockup, same waving
   panda, same field styling, same guarded-submit CTA pattern — with a
   different form (name added, password confirmed) and a different close: no
   journey-reminder card (there's no journey yet), straight into the
   diagnostic's entry point instead.
--------------------------------------------------------------------------- */

export function SignupPage() {
  const { phase, submit } = useSignup();
  const reduced = useReducedMotionPreference();
  const [socialPulse, setSocialPulse] = useState(false);

  const continueWithSocial = useCallback(() => {
    setSocialPulse(true);
    window.setTimeout(() => setSocialPulse(false), 320);
    submit("Pathfinder", "pathfinder@pandaroute.app", "sso-account", "sso-account");
  }, [submit]);

  const rise = (delayS: number) => ({
    initial: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduced ? 0 : 0.32, delay: reduced ? 0 : delayS, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <main className="quest-paper relative min-h-dvh overflow-hidden bg-canvas">
      <div className="mx-auto flex w-full max-w-[430px] flex-col px-5 pt-[max(env(safe-area-inset-top),1.25rem)] pb-[max(env(safe-area-inset-bottom),2rem)]">
        <motion.div
          className="flex items-center gap-2.5"
          initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary-soft">
            <Image src="/panda-logo.png" alt="" width={36} height={36} priority />
          </span>
          <motion.span
            className="font-display text-[22px] font-extrabold tracking-tight text-ink"
            initial={reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            PandaRoute
          </motion.span>
        </motion.div>

        <div className="mt-6">
          <PandaWelcome
            celebrate={phase === "success"}
            title="Welcome, future pathfinder!"
            message="Let's create your account and start your learning adventure."
            pulse={socialPulse}
          />
        </div>

        <motion.p
          className="mt-6 text-center text-[13px] font-extrabold tracking-[0.14em] text-primary-ink uppercase"
          {...rise(1.0)}
        >
          Create your account
        </motion.p>

        <motion.h1
          className="mt-1.5 text-center font-display text-[36px] leading-[1.08] font-extrabold tracking-tight text-balance"
          {...rise(1.1)}
        >
          Start your learning journey today
        </motion.h1>

        <motion.p
          className="mx-auto mt-3 max-w-[21rem] text-center text-[15.5px] leading-relaxed text-ink-muted"
          {...rise(1.2)}
        >
          Join PandaRoute and get your personalized learning route in Tech &amp; AI.
        </motion.p>

        <div className="mt-6">
          <SignupForm phase={phase} onSubmit={submit} entranceDelayS={1.3} />
        </div>

        <motion.div className="my-6 flex items-center gap-3" {...rise(1.9)}>
          <span className="h-px flex-1 bg-line" aria-hidden />
          <span className="text-[13px] font-semibold text-ink-faint">or</span>
          <span className="h-px flex-1 bg-line" aria-hidden />
        </motion.div>

        <motion.div {...rise(1.95)}>
          <SocialButtons
            providers={["google"]}
            verb="Sign up"
            context="signup"
            onContinue={continueWithSocial}
          />
        </motion.div>

        <p className="mt-6 text-center text-[14.5px] text-ink-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-primary-ink hover:underline">
            Sign in
          </Link>
        </p>

        <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-[13px] text-ink-muted">
          <Lock className="size-3.5 shrink-0" aria-hidden />
          Your data is safe and private with us.
        </p>

        <nav aria-label="Footer" className="mt-4">
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            {["Privacy", "Help", "Terms"].map((label) => (
              <li key={label}>
                <a
                  href="#"
                  className="flex min-h-11 items-center text-[12.5px] font-semibold text-ink-faint transition-colors hover:text-ink-muted"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
