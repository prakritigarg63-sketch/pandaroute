"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Sparkles, Wrench } from "lucide-react";
import { XPBadge } from "@/components/landing/shared";
import { SAMPLE_QUEST } from "@/lib/landing/content";
import { revealOnce } from "@/lib/landing/motion";

/* ---------------------------------------------------------------------------
   The sample quest — a taste of the real thing, not the diagnostic itself.

   Its own small CTA plays one sparkle on press and nothing else: the brief is
   explicit that confetti belongs to an actually completed quest, not a
   preview of one.
--------------------------------------------------------------------------- */

export function QuestCardSection() {
  const [sparked, setSparked] = useState(false);

  return (
    <section id="sample-quest" className="mx-auto w-full max-w-[430px] px-5 py-18 lg:max-w-3xl">
      <motion.div
        className="quest-paper relative overflow-hidden rounded-[22px] border border-line bg-surface p-4 shadow-warm-lg"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={revealOnce}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-start gap-3">
          <motion.span
            className="grid size-14 shrink-0 place-items-center rounded-[16px] bg-primary-soft text-primary-ink"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={revealOnce}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Wrench className="size-6" aria-hidden />
          </motion.span>

          <motion.div
            className="min-w-0 flex-1"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealOnce}
            transition={{ duration: 0.35, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[11px] font-extrabold tracking-[0.14em] text-primary-ink uppercase">
              {SAMPLE_QUEST.eyebrow}
            </p>
            <h2 className="mt-1 font-display text-[16px] leading-snug font-extrabold">
              {SAMPLE_QUEST.title}
            </h2>
          </motion.div>
        </div>

        <motion.p
          className="mt-3 text-[13.5px] leading-relaxed text-ink-muted"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealOnce}
          transition={{ duration: 0.3, delay: 0.28 }}
        >
          {SAMPLE_QUEST.description}
        </motion.p>

        <motion.div
          className="mt-3 flex items-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={revealOnce}
          transition={{ duration: 0.3, delay: 0.35 }}
        >
          <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-muted">
            <Clock className="size-3.5" aria-hidden />
            {SAMPLE_QUEST.minutes} min
          </span>
          <motion.span
            initial={{ rotate: -8, opacity: 0 }}
            whileInView={{ rotate: 0, opacity: 1 }}
            viewport={revealOnce}
            transition={{ duration: 0.35, delay: 0.42, ease: [0.34, 1.3, 0.64, 1] }}
          >
            <XPBadge value={`+${SAMPLE_QUEST.xp} XP`} />
          </motion.span>
        </motion.div>

        <motion.button
          type="button"
          onClick={() => setSparked(true)}
          className="quest-cta relative mt-4 flex min-h-12 w-full items-center justify-center rounded-[var(--radius-pill)] bg-primary text-[15px] font-extrabold text-ink"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealOnce}
          transition={{ duration: 0.3, delay: 0.5 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          {SAMPLE_QUEST.cta}
          {sparked && (
            <motion.span
              aria-hidden
              className="absolute top-1"
              initial={{ opacity: 1, scale: 0.6, y: 0 }}
              animate={{ opacity: 0, scale: 1.1, y: -10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              onAnimationComplete={() => setSparked(false)}
            >
              <Sparkles className="size-4 text-canvas" />
            </motion.span>
          )}
        </motion.button>
      </motion.div>
    </section>
  );
}
