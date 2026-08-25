"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Lock } from "lucide-react";
import { PandaWelcome } from "@/components/auth/panda-welcome";
import { LoginForm } from "@/components/auth/login-form";
import { SocialButtons } from "@/components/auth/social-buttons";
import { JourneyReminderCard } from "@/components/auth/journey-reminder-card";
import { useLogin } from "@/lib/auth/use-login";
import { useReducedMotionPreference } from "@/lib/landing/use-reduced-motion";

/* ---------------------------------------------------------------------------
   The login screen.

   Distraction-free by design (no hamburger, no full nav) — this is a
   returning user's fastest way back into their route, not a marketing page.
   Every entrance delay below is the millisecond sequence from the brief,
   converted to seconds for Framer Motion.
--------------------------------------------------------------------------- */

/** Mountains, a cloud, a dotted route and one pin — a watermark, not a scene. */
function AdventureWatermark() {
  return (
    <svg
      viewBox="0 0 390 220"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
      className="pointer-events-none absolute inset-x-[-1.25rem] top-0 h-[220px] opacity-[0.06]"
    >
      <path d="M0 170 L55 100 L100 150 L150 80 L215 170 Z" fill="var(--color-primary-strong)" />
      <path d="M180 175 L235 115 L275 155 L330 95 L390 175 Z" fill="var(--color-primary-strong)" />
      <circle cx="60" cy="40" r="14" fill="var(--color-ink)" />
      <circle cx="76" cy="34" r="18" fill="var(--color-ink)" />
      <circle cx="330" cy="30" r="11" fill="var(--color-ink)" />
      <circle cx="344" cy="26" r="15" fill="var(--color-ink)" />
      <path
        d="M20 190 Q 100 150 150 185 T 300 165 T 375 130"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="2"
        strokeDasharray="2 8"
        strokeLinecap="round"
      />
      <path d="M348 108 q0-10 8-10 8 0 8 10 0 8-8 16-8-8-8-16Z" fill="var(--color-ink)" />
    </svg>
  );
}

export function LoginPage() {
  const { phase, submit } = useLogin();
  const reduced = useReducedMotionPreference();
  const [socialPulse, setSocialPulse] = useState(false);

  // A quick, non-blocking panda reaction on the social button itself —
  // never gates the (simulated) auth call, which fires in the same tick.
  const continueWithSocial = useCallback(() => {
    setSocialPulse(true);
    window.setTimeout(() => setSocialPulse(false), 320);
    submit("pathfinder@pandaroute.app", "sso");
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

        <div className="relative mt-6">
          <AdventureWatermark />
          <PandaWelcome celebrate={phase === "success"} pulse={socialPulse} />
        </div>

        <motion.p
          className="mt-6 text-center text-[13px] font-extrabold tracking-[0.14em] text-primary-ink uppercase"
          {...rise(1.0)}
        >
          Welcome back, Pathfinder
        </motion.p>

        <motion.h1
          className="mt-1.5 text-center font-display text-[38px] leading-[1.05] font-extrabold tracking-tight text-balance"
          {...rise(1.1)}
        >
          Continue your learning journey
        </motion.h1>

        <motion.p
          className="mx-auto mt-3 max-w-[21rem] text-center text-[15.5px] leading-relaxed text-ink-muted"
          {...rise(1.2)}
        >
          Sign in to pick up where you left off, continue your quests and keep
          building your Tech &amp; AI skills.
        </motion.p>

        <div className="mt-6">
          <LoginForm phase={phase} onSubmit={submit} entranceDelayS={1.3} />
        </div>

        <motion.div className="my-6 flex items-center gap-3" {...rise(1.65)}>
          <span className="h-px flex-1 bg-line" aria-hidden />
          <span className="text-[13px] font-semibold text-ink-faint">or</span>
          <span className="h-px flex-1 bg-line" aria-hidden />
        </motion.div>

        <motion.div {...rise(1.7)}>
          <SocialButtons providers={["google"]} onContinue={continueWithSocial} />
        </motion.div>

        <div className="mt-6">
          <JourneyReminderCard />
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[13px] text-ink-muted">
          <Lock className="size-3.5 shrink-0" aria-hidden />
          Your progress is securely saved.
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
