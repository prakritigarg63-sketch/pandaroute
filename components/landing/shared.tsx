"use client";

import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { cn } from "@/lib/cn";
import { revealOnce, riseIn } from "@/lib/landing/motion";

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
 * What every `startDiagnostic()` button shows once pressed: the arrow is
 * replaced by a spinning compass and the label becomes "Preparing your
 * route…", so all the CTAs on the page read as one action in progress rather
 * than buttons each doing their own thing.
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
 *  change exactly once, regardless of which CTA triggered it. */
export function DiagnosticStatus({ starting }: { starting: boolean }) {
  return (
    <p role="status" aria-live="polite" className="sr-only">
      {starting ? "Preparing your route…" : ""}
    </p>
  );
}
