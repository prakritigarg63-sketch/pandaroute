"use client";

import { motion } from "framer-motion";
import { Clock, Lock, Sparkles, Star } from "lucide-react";
import { XPBadge } from "@/components/landing/shared";
import { SAMPLE_QUEST } from "@/lib/landing/content";
import { revealOnce } from "@/lib/landing/motion";

/* ---------------------------------------------------------------------------
   The sample quest — not yet a real quest to take, just a preview of one.

   Everything here is content and disabled-state only; the card's structure,
   sizing and motion timing are untouched from the version this replaces.
   "Coming soon" reads as a product-level status, not a lock a learner needs
   to earn their way past — see the brief's own list of words this
   deliberately avoids.
--------------------------------------------------------------------------- */

export function QuestCardSection() {
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
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={revealOnce}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Star className="size-6" aria-hidden />
          </motion.span>

          <motion.div
            className="relative min-w-0 flex-1"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealOnce}
            transition={{ duration: 0.35, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-primary-fill px-2.5 py-1 text-[10.5px] font-extrabold tracking-[0.1em] text-primary-strong uppercase">
              <Sparkles className="size-3" aria-hidden />
              {SAMPLE_QUEST.eyebrow}
            </span>
            {/* One tiny sparkle beside the badge, once, not the continuous
                pulse the brief explicitly rules out. */}
            <motion.span
              aria-hidden
              className="absolute top-0 left-[6.5rem]"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.8] }}
              viewport={revealOnce}
              transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
            >
              <Sparkles className="size-3 text-primary" />
            </motion.span>

            <h2 className="mt-1.5 font-display text-[16px] leading-snug font-extrabold">
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

        <motion.p
          className="mt-2.5 text-[12px] leading-snug text-ink-faint"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={revealOnce}
          transition={{ duration: 0.3, delay: 0.46 }}
        >
          {SAMPLE_QUEST.skills.join(" · ")}
        </motion.p>

        <motion.button
          type="button"
          disabled
          aria-disabled="true"
          className="mt-4 flex min-h-13 w-full cursor-not-allowed items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-primary-fill text-[15px] font-extrabold text-primary-strong"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealOnce}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Lock className="size-4" aria-hidden />
          {SAMPLE_QUEST.cta}
        </motion.button>

        <motion.p
          className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-[12.5px] text-ink-muted"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={revealOnce}
          transition={{ duration: 0.3, delay: 0.58 }}
        >
          <Sparkles className="size-3 shrink-0 text-primary-strong/70" aria-hidden />
          New practical quests are on the way.
        </motion.p>
      </motion.div>
    </section>
  );
}
