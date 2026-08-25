"use client";

import { motion } from "framer-motion";
import { Compass, Star, Target } from "lucide-react";
import { revealOnce } from "@/lib/landing/motion";
import { useReducedMotionPreference } from "@/lib/landing/use-reduced-motion";

/* ---------------------------------------------------------------------------
   "Your journey is waiting" — a reminder, not a new pitch.

   Distinct from the landing page's benefit cards: those sell the product to
   someone who hasn't joined yet, this one nudges someone who already has.
--------------------------------------------------------------------------- */

const ITEMS = [
  { id: "route", icon: Compass, label: "Continue your route" },
  { id: "xp", icon: Star, label: "Keep earning XP" },
  { id: "quest", icon: Target, label: "Complete your next quest" },
];

export function JourneyReminderCard() {
  const reduced = useReducedMotionPreference();

  return (
    <motion.div
      className="rounded-[20px] border border-line bg-primary-soft p-4"
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealOnce}
      transition={{ duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-start gap-3">
        <motion.ul
          className="min-w-0 flex-1"
          initial="hidden"
          whileInView="show"
          viewport={revealOnce}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } }}
        >
          <p className="mb-2.5 text-[15.5px] leading-snug font-extrabold">Your journey is waiting</p>
          {ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <motion.li
                key={item.id}
                className="flex items-center gap-2 py-1 text-[13.5px] font-semibold text-ink"
                variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
              >
                <Icon className="size-4 shrink-0 text-primary-strong" aria-hidden />
                {item.label}
              </motion.li>
            );
          })}
        </motion.ul>

        <motion.div
          aria-hidden
          className="shrink-0"
          initial={reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: 8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={revealOnce}
          transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <JourneyMap reduced={reduced} />
        </motion.div>
      </div>
    </motion.div>
  );
}

/** A tiny folded map: dotted route, one mountain, one flag. Decorative only. */
function JourneyMap({ reduced }: { reduced: boolean }) {
  return (
    <svg viewBox="0 0 84 76" className="h-[64px] w-[70px]" aria-hidden>
      <rect x="3" y="8" width="78" height="60" rx="8" fill="var(--color-surface)" stroke="var(--color-line)" />
      <line x1="30" y1="10" x2="27" y2="66" stroke="var(--color-line)" strokeDasharray="1 4" />
      <line x1="57" y1="10" x2="54" y2="66" stroke="var(--color-line)" strokeDasharray="1 4" />
      <path d="M12 52 Q 24 44 30 50 T 52 40 T 66 26" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 5.5" />
      <path d="M46 30 L 56 44 L 36 44 Z" fill="var(--color-primary-fill)" stroke="var(--color-primary-strong)" strokeWidth="1" />
      <motion.g
        style={{ transformOrigin: "66px 26px" }}
        initial={reduced ? { rotate: 0 } : { rotate: -5 }}
        whileInView={{ rotate: 0 }}
        viewport={revealOnce}
        transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <line x1="66" y1="26" x2="66" y2="12" stroke="var(--color-primary-strong)" strokeWidth="1.5" />
        <path d="M66 12 L 76 15.5 L 66 19 Z" fill="var(--color-primary)" />
      </motion.g>
      <circle cx="12" cy="52" r="2.2" fill="var(--color-primary-strong)" />
    </svg>
  );
}
