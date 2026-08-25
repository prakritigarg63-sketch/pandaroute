"use client";

import { motion } from "framer-motion";
import { Award, Check, CloudCheck, ListChecks, Sparkles } from "lucide-react";
import { PandaGuide } from "@/components/landing/panda-guide";
import { DiagnosticButtonContent } from "@/components/landing/shared";
import { JOURNEY_CHECKPOINTS } from "@/lib/landing/content";
import { useReducedMotionPreference } from "@/lib/landing/use-reduced-motion";
import type { HomeCtaPhase } from "@/lib/landing/use-home-cta";

const CTA_LABEL: Record<HomeCtaPhase, string> = {
  new: "Start free diagnostic →",
  resume: "Continue diagnostic →",
  return: "Continue my journey →",
};

/* ---------------------------------------------------------------------------
   The hero.

   Mobile stacking order is fixed by the brief — eyebrow, headline, copy, CTA,
   facts, then the panda and its route — and that order is the actual DOM
   order here, not a visual reorder, so it reads correctly without CSS to a
   screen reader too. Desktop widens into two columns without touching that
   order: the illustration moves beside the text via `lg:` grid placement, it
   never moves before it.
--------------------------------------------------------------------------- */

const FACTS = [
  { id: "scenarios", icon: ListChecks, label: "12 scenarios" },
  { id: "grades", icon: Check, label: "No grades" },
  { id: "saved", icon: CloudCheck, label: "Progress saved" },
];

export function HeroSection({
  onStart,
  starting,
  phase,
  heroRef,
}: {
  onStart: () => void;
  starting: boolean;
  phase: HomeCtaPhase;
  heroRef: React.RefObject<HTMLElement | null>;
}) {
  const reduced = useReducedMotionPreference();

  return (
    <section ref={heroRef} className="quest-paper relative overflow-hidden pt-8 pb-2">
      <div className="mx-auto grid w-full max-w-[430px] gap-8 px-5 lg:max-w-5xl lg:grid-cols-2 lg:items-center lg:gap-12">
        <div className="lg:order-1">
          <motion.p
            className="text-[11px] font-extrabold tracking-[0.16em] text-primary-ink uppercase"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            Your AI &amp; tech journey starts here
          </motion.p>

          <h1 className="mt-2 font-display text-[32px] leading-[1.12] font-extrabold text-balance">
            <motion.span
              className="block overflow-hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.4, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="block">Discover how you think.</span>
            </motion.span>
            <motion.span
              className="block overflow-hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.4, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="block text-primary-ink">Build what comes next.</span>
            </motion.span>
          </h1>

          <motion.p
            className="mt-3.5 max-w-[34ch] text-[15px] leading-relaxed text-ink-muted"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            A 10–15 minute workplace diagnostic with 12 realistic scenarios. No
            grades—just insights to help you grow with confidence.
          </motion.p>

          <motion.button
            type="button"
            onClick={onStart}
            disabled={starting}
            aria-busy={starting}
            className="quest-cta mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-primary text-[16.5px] font-extrabold text-ink disabled:cursor-default lg:w-auto lg:px-8"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <DiagnosticButtonContent starting={starting} idleLabel={CTA_LABEL[phase]} />
          </motion.button>

          <motion.ul
            className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.7 } } }}
          >
            {FACTS.map((fact) => {
              const Icon = fact.icon;
              return (
                <motion.li
                  key={fact.id}
                  className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-muted"
                  variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
                >
                  <Icon className="size-3.5 text-primary-strong" aria-hidden />
                  {fact.label}
                </motion.li>
              );
            })}
          </motion.ul>
        </div>

        <div className="lg:order-2">
          <JourneyIllustration reduced={reduced} celebrate={starting} />
        </div>
      </div>
    </section>
  );
}

function JourneyIllustration({ reduced, celebrate }: { reduced: boolean; celebrate: boolean }) {
  // The path is drawn tall-to-short in the SVG's own coordinates (top of the
  // markup is the bottom checkpoint), so pathLength growing 0 → 1 reads as the
  // route climbing from Discover up to Build — bottom to top, as specced.
  // The top ~90px of the 420px column is left clear of the path and of any
  // checkpoint so the "First Pathfinder" badge has room to sit above the
  // route without overlapping the Build label beneath it.
  const pathD = "M40 400 C 30 330, 55 300, 40 240 S 20 140, 40 90";

  return (
    <div className="relative mx-auto flex max-w-[300px] items-end justify-center gap-2 lg:max-w-none">
      <div className="relative h-[420px] w-[80px] shrink-0">
        <svg
          viewBox="0 0 80 420"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <motion.path
            d={pathD}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray="1 10"
            initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: reduced ? 0 : 1, delay: reduced ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>

        {JOURNEY_CHECKPOINTS.map((checkpoint, index) => (
          <motion.div
            key={checkpoint.id}
            className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-center"
            style={{ bottom: `${6 + index * 23}%` }}
            initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.75 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: reduced ? 0 : 0.32,
              delay: reduced ? 0 : 0.5 + index * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span className="relative grid size-7 place-items-center rounded-full border-2 border-primary-strong bg-primary text-[11px] font-extrabold text-ink">
              {index + 1}
              {!reduced && (
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full border-2 border-primary"
                  initial={{ opacity: 0.6, scale: 1 }}
                  whileInView={{ opacity: 0, scale: 1.9 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: 0.55 + index * 0.12, ease: "easeOut" }}
                />
              )}
            </span>
            <span className="text-[11.5px] leading-none font-bold whitespace-nowrap">
              {checkpoint.label}
            </span>
            <span className="text-[10px] leading-none whitespace-nowrap text-ink-muted">
              {checkpoint.detail}
            </span>
          </motion.div>
        ))}

        <motion.span
          className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-[var(--radius-pill)] border border-primary-strong/40 bg-surface px-2 py-1 text-[9.5px] font-extrabold whitespace-nowrap text-primary-ink shadow-warm"
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: -8, scale: 0.85 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: reduced ? 0 : 0.4,
            delay: reduced ? 0 : 0.9,
            ease: [0.34, 1.3, 0.64, 1],
          }}
        >
          <Award className="size-3" aria-hidden />
          First Pathfinder
        </motion.span>
      </div>

      <motion.div
        className="relative"
        initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <PandaGuide variant="explorer" size="large" celebrate={celebrate} />
        {celebrate && (
          <span aria-hidden className="pointer-events-none absolute inset-0">
            {[
              { top: "6%", left: "4%", delay: "0ms" },
              { top: "0%", right: "8%", delay: "90ms" },
              { top: "40%", right: "-4%", delay: "160ms" },
            ].map(({ delay, ...position }, i) => (
              <Sparkles
                key={i}
                className="quest-spark absolute size-4 text-primary"
                style={
                  {
                    ...position,
                    "--dx": "0px",
                    "--dy": "-14px",
                    "--delay": delay,
                  } as unknown as React.CSSProperties
                }
              />
            ))}
          </span>
        )}
      </motion.div>
    </div>
  );
}
