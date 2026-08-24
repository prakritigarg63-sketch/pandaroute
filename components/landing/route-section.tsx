"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { SectionHeading } from "@/components/landing/shared";
import {
  ACCENT_BORDER,
  ACCENT_LINE,
  ACCENT_TILE,
  ROUTE_STEPS,
  type RouteStep,
} from "@/lib/landing/content";
import { revealOnce } from "@/lib/landing/motion";

/* ---------------------------------------------------------------------------
   "Your route, made for you" — three steps on a dotted amber spine.

   The connector is a plain div rather than an SVG: three fixed stops in a
   straight vertical line don't need a path, and a div scales its height with
   `whileInView` far more cheaply than an SVG stroke would.
--------------------------------------------------------------------------- */

export function RouteSection() {
  return (
    <section className="mx-auto w-full max-w-[430px] px-5 py-18 lg:max-w-3xl">
      <SectionHeading id="how-it-works">Your route, made for you</SectionHeading>

      <ol className="relative mt-8 flex flex-col gap-8">
        <motion.span
          aria-hidden
          className="absolute top-5 bottom-5 left-[19px] w-0.5 origin-top"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, var(--color-primary) 0 6px, transparent 6px 14px)",
          }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={revealOnce}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />

        {ROUTE_STEPS.map((step, index) => (
          <RouteStepCard key={step.id} step={step} index={index} />
        ))}
      </ol>
    </section>
  );
}

function RouteStepCard({ step, index }: { step: RouteStep; index: number }) {
  const Icon = step.icon;

  return (
    <motion.li
      className="relative flex gap-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealOnce}
      transition={{
        duration: 0.5,
        delay: 0.15 + index * 0.14,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.span
        className={cn(
          "relative z-10 grid size-10 shrink-0 place-items-center rounded-full text-[14px] font-extrabold text-ink",
          ACCENT_LINE[step.accent],
        )}
        initial={{ scale: 0.7 }}
        whileInView={{ scale: 1 }}
        viewport={revealOnce}
        transition={{
          duration: 0.35,
          delay: 0.22 + index * 0.14,
          ease: [0.34, 1.3, 0.64, 1],
        }}
      >
        {step.id}
      </motion.span>

      <motion.div
        role="group"
        tabIndex={0}
        className={cn(
          "quest-card min-w-0 flex-1 rounded-[18px] border bg-surface p-4 shadow-warm outline-none focus-visible:ring-2 focus-visible:ring-primary",
          ACCENT_BORDER[step.accent],
        )}
        whileTap={{ scale: 0.985 }}
      >
        <div className="flex items-start gap-3">
          <motion.span
            className={cn(
              "quest-icon grid size-9 shrink-0 place-items-center rounded-[12px]",
              ACCENT_TILE[step.accent],
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={revealOnce}
            transition={{ duration: 0.3, delay: 0.32 + index * 0.14 }}
          >
            <Icon className="size-4.5" aria-hidden />
          </motion.span>
          <div className="min-w-0">
            <p className="text-[15.5px] leading-snug font-extrabold">{step.title}</p>
            <p className="mt-1 text-[13px] leading-snug text-ink-muted">{step.description}</p>
          </div>
        </div>
      </motion.div>
    </motion.li>
  );
}
