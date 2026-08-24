"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { SectionHeading } from "@/components/landing/shared";
import { ACCENT_TILE, BENEFITS, type Benefit } from "@/lib/landing/content";
import { revealOnce } from "@/lib/landing/motion";

/* ---------------------------------------------------------------------------
   "Learning that feels like progress" — four benefit cards.

   Rendered in reading order (top-left, top-right, bottom-left, bottom-right),
   which in a two-column grid is also the diagonal the brief asks for: row-major
   order already reads top-left → top-right → bottom-left → bottom-right, so the
   stagger needs nothing cleverer than the card's own index.
--------------------------------------------------------------------------- */

/** Raw box-shadow values — framer animates the CSS property directly, not a
 *  Tailwind class, so these stay actual shadow syntax rather than utilities. */
const GLOW: Record<Benefit["accent"], string> = {
  amber: "0 0 0 6px rgba(231,154,0,0.12)",
  coral: "0 0 0 6px rgba(255,118,93,0.14)",
  lavender: "0 0 0 6px rgba(141,123,198,0.14)",
  teal: "0 0 0 6px rgba(72,170,166,0.14)",
  sky: "0 0 0 6px rgba(142,164,210,0.14)",
};

export function BenefitsSection() {
  return (
    <section className="mx-auto w-full max-w-[430px] px-5 py-18 lg:max-w-3xl">
      <SectionHeading>Learning that feels like progress</SectionHeading>

      <ul className="mt-7 grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 lg:gap-4">
        {BENEFITS.map((benefit, index) => (
          <BenefitCard key={benefit.id} benefit={benefit} index={index} />
        ))}
      </ul>
    </section>
  );
}

function BenefitCard({ benefit, index }: { benefit: Benefit; index: number }) {
  const Icon = benefit.icon;
  const isXp = benefit.id === "xp";

  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealOnce}
      transition={{ duration: 0.45, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        role="group"
        tabIndex={0}
        className={cn(
          "quest-card group flex h-full flex-col gap-2.5 rounded-[18px] border border-line bg-surface p-4 outline-none",
          "focus-visible:ring-2 focus-visible:ring-primary",
        )}
        whileHover={{ y: -3 }}
        whileTap={{ y: -1, scale: 0.99 }}
      >
        <motion.span
          className={cn(
            "quest-icon relative grid size-10 place-items-center rounded-[12px] transition-shadow duration-200",
            ACCENT_TILE[benefit.accent],
          )}
          whileHover={{ scale: 1.06, boxShadow: GLOW[benefit.accent] }}
        >
          <Icon className="size-5" aria-hidden />
          {isXp && (
            <motion.span
              className="absolute -top-1 -right-1"
              initial={{ rotate: 0, opacity: 0, scale: 0.6 }}
              whileInView={{ rotate: 12, opacity: 1, scale: 1 }}
              viewport={revealOnce}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1, ease: [0.34, 1.3, 0.64, 1] }}
            >
              <Sparkles className="size-3.5 text-primary" aria-hidden />
            </motion.span>
          )}
        </motion.span>

        <div>
          <p className="text-[14.5px] leading-snug font-extrabold">{benefit.title}</p>
          <p className="mt-1 text-[12.5px] leading-snug text-ink-muted">
            {benefit.description}
          </p>
        </div>
      </motion.div>
    </motion.li>
  );
}
