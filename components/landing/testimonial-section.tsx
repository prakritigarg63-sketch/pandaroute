"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { TESTIMONIAL } from "@/lib/landing/content";
import { revealOnce } from "@/lib/landing/motion";

/** One sample testimonial, clearly labelled as sample content — not a
 *  verified customer quote, per the brief. */
export function TestimonialSection() {
  return (
    <section className="mx-auto w-full max-w-[430px] px-5 py-18 lg:max-w-2xl">
      <motion.div
        className="quest-card relative rounded-[22px] border border-line bg-surface p-5"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={revealOnce}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.span
          className="grid size-9 place-items-center rounded-full bg-primary-soft text-primary-ink"
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={revealOnce}
          transition={{ duration: 0.35, delay: 0.15, ease: [0.34, 1.3, 0.64, 1] }}
        >
          <Quote className="size-4" aria-hidden />
        </motion.span>

        <blockquote className="mt-3">
          <p className="text-[16px] leading-snug font-semibold text-balance">
            “{TESTIMONIAL.quote}”
          </p>
        </blockquote>

        <motion.figcaption
          className="mt-4 flex items-center gap-2.5 border-t border-line pt-3"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealOnce}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sunk text-[13px] font-extrabold text-ink-muted">
            {TESTIMONIAL.name.charAt(0)}
          </span>
          <span className="min-w-0 text-[12.5px] leading-tight">
            <span className="block font-bold text-ink">
              {TESTIMONIAL.name}, {TESTIMONIAL.role}
            </span>
            <span className="block text-ink-faint">— {TESTIMONIAL.sampleLabel} content</span>
          </span>
        </motion.figcaption>
      </motion.div>
    </section>
  );
}
