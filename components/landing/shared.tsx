"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Compass, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { PandaGuide } from "@/components/landing/panda-guide";
import { motionTokens, revealOnce, riseIn } from "@/lib/landing/motion";

/* ---------------------------------------------------------------------------
   Small building blocks reused across the landing sections.
--------------------------------------------------------------------------- */

export function SectionHeading({
  id,
  eyebrow,
  children,
}: {
  id?: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      id={id}
      className="scroll-mt-20"
      variants={riseIn}
      initial="hidden"
      whileInView="show"
      viewport={revealOnce}
    >
      {eyebrow && (
        <p className="text-[11px] font-extrabold tracking-[0.16em] text-primary-ink uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-1 font-display text-[24px] leading-tight font-extrabold text-balance">
        {children}
      </h2>
    </motion.div>
  );
}

export function XPBadge({ value, className }: { value: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-primary-strong/30 bg-primary-soft px-2.5 py-1 text-[12px] font-bold text-primary-ink",
        className,
      )}
    >
      <span
        aria-hidden
        className="grid size-4 place-items-center rounded-full bg-primary text-[8px] font-extrabold text-ink"
      >
        XP
      </span>
      {value}
    </span>
  );
}

/**
 * Counts up once, the moment it scrolls into view, and never resets — a
 * counter that replays every time you scroll past it reads as decoration, not
 * a number.
 */
export function AnimatedCounter({
  to,
  suffix = "",
  className,
}: {
  to: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 700;
    const start = performance.now();

    let frame: number;
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setValue(Math.round(to * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frame);
  }, [inView, to]);

  return (
    <span ref={ref} className={cn("tnum", className)}>
      {value}
      {suffix}
    </span>
  );
}

/**
 * The landing page's own coaching bubble. Deliberately not the in-app
 * PandaAside/reaction system — this page has no diagnostic state to react to,
 * just a handful of fixed, encouraging lines beside a small guide.
 */
export function PandaCoach({
  message,
  variant = "coach",
  className,
}: {
  message: string;
  variant?: "coach" | "compass";
  className?: string;
}) {
  return (
    <motion.div
      className={cn("flex items-end gap-2.5", className)}
      variants={riseIn}
      initial="hidden"
      whileInView="show"
      viewport={revealOnce}
    >
      <PandaGuide variant={variant} size="small" />

      <div className="relative flex-1 rounded-[18px] rounded-bl-sm border border-line bg-surface p-3 shadow-warm">
        <Sparkles aria-hidden className="absolute top-2.5 right-2.5 size-3.5 text-quest-bright" />
        <p className="pr-5 text-[13.5px] leading-snug text-ink">{message}</p>
      </div>
    </motion.div>
  );
}

/**
 * What every `startDiagnostic()` button shows once pressed: the arrow is
 * replaced by a spinning compass and the label becomes "Preparing your
 * route…", so all four CTAs on the page read as one action in progress rather
 * than four buttons each doing their own thing.
 */
export function DiagnosticButtonContent({
  starting,
  idleLabel,
  busyLabel = "Preparing your route…",
}: {
  starting: boolean;
  idleLabel: string;
  busyLabel?: string;
}) {
  return starting ? (
    <>
      <Compass className="size-4.5 animate-spin [animation-duration:1.1s]" aria-hidden />
      {busyLabel}
    </>
  ) : (
    idleLabel
  );
}

/** One polite live region for the whole page — screen readers hear the state
 *  change exactly once, regardless of which of the four CTAs triggered it. */
export function DiagnosticStatus({ starting }: { starting: boolean }) {
  return (
    <p role="status" aria-live="polite" className="sr-only">
      {starting ? "Preparing your route…" : ""}
    </p>
  );
}

export const fadeUp = riseIn;
export const durations = motionTokens.duration;
