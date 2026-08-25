"use client";

import { motion } from "framer-motion";
import { PandaGuide } from "@/components/landing/panda-guide";
import { DiagnosticButtonContent } from "@/components/landing/shared";
import { revealOnce } from "@/lib/landing/motion";
import type { HomeCtaPhase } from "@/lib/landing/use-home-cta";

const CTA_LABEL: Record<HomeCtaPhase, string> = {
  new: "Start the 10-minute diagnostic →",
  resume: "Continue where you left off →",
  return: "Continue my journey →",
};

/* ---------------------------------------------------------------------------
   The closing conversion card.

   One more CTA, not a harder sell: same copy discipline as the hero, same
   button, a second chance for whoever scrolled the whole page without acting
   on the first one.
--------------------------------------------------------------------------- */

export function FinalCtaSection({
  onStart,
  starting,
  phase,
  finalCtaRef,
}: {
  onStart: () => void;
  starting: boolean;
  phase: HomeCtaPhase;
  finalCtaRef: React.RefObject<HTMLElement | null>;
}) {
  return (
    <section
      id="faq"
      ref={finalCtaRef}
      className="mx-auto w-full max-w-[430px] px-5 py-18 lg:max-w-3xl"
    >
      <motion.div
        className="relative overflow-hidden rounded-[26px] bg-quest p-5 pb-6 shadow-[0_18px_36px_-22px_rgba(185,111,0,0.75)]"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={revealOnce}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -top-12 -right-12 size-48 rounded-full bg-quest-bright/40 blur-2xl"
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={revealOnce}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />

        <div className="relative">
          <motion.h2
            className="font-display text-[24px] leading-tight font-extrabold text-balance text-ink"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealOnce}
            transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            Ready to find your starting point?
          </motion.h2>

          <motion.p
            className="mt-2 text-[14px] leading-snug text-ink/80"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealOnce}
            transition={{ duration: 0.35, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            It&apos;s free, takes 10–15 minutes and will guide your next steps.
          </motion.p>

          <div className="mt-4 flex items-end justify-between gap-3">
            <motion.button
              type="button"
              onClick={onStart}
              disabled={starting}
              aria-busy={starting}
              className="quest-cta flex min-h-13 flex-1 items-center justify-center rounded-[var(--radius-pill)] bg-canvas px-4 text-[15px] font-extrabold text-ink disabled:cursor-default"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={revealOnce}
              transition={{ duration: 0.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <DiagnosticButtonContent starting={starting} idleLabel={CTA_LABEL[phase]} />
            </motion.button>

            <motion.div
              className="shrink-0"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={revealOnce}
              transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <PandaGuide variant="compass" size="medium" celebrate={starting} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
