"use client";

import { Brain, Cpu, Users } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { AnimatedCounter } from "@/components/landing/shared";
import { ACCENT_LINE, ACCENT_TILE, SKILLS, type Skill } from "@/lib/landing/content";
import { revealOnce } from "@/lib/landing/motion";

/* ---------------------------------------------------------------------------
   Skill map preview.

   A continuous fill reads as "progress" the instant it starts moving; the
   counted percentage only confirms the number, so it finishes a beat after
   its own bar rather than racing it. `viewport={{ once: true }}` on the
   section is what makes this run once per visit — scrolling past it again
   does not replay the fill.
--------------------------------------------------------------------------- */

const SKILL_ICON = { "problem-solving": Brain, collaboration: Users, "ai-mindset": Cpu } as const;

const ROW_GAP = 0.18;

export function SkillMapSection() {
  return (
    <section id="skill-map" className="mx-auto w-full max-w-[430px] px-5 py-18 lg:max-w-3xl">
      <motion.div
        className="quest-card rounded-[22px] border border-line bg-surface p-4 shadow-warm-lg"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={revealOnce}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="font-display text-[19px] leading-tight font-extrabold">
          Your skill map preview
        </h2>

        <ul className="mt-4 flex flex-col gap-4">
          {SKILLS.map((skill, index) => (
            <SkillProgressRow key={skill.id} skill={skill} rowIndex={index} />
          ))}
        </ul>

        <p className="mt-4 border-t border-line pt-3 text-[12.5px] font-semibold text-ink-muted">
          Detailed results after your diagnostic
        </p>
      </motion.div>
    </section>
  );
}

function SkillProgressRow({ skill, rowIndex }: { skill: Skill; rowIndex: number }) {
  const Icon = SKILL_ICON[skill.id as keyof typeof SKILL_ICON];
  const rowDelay = rowIndex * ROW_GAP;
  const barDelay = rowDelay + 0.1;

  return (
    <motion.li
      className="flex items-center gap-3"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealOnce}
      transition={{ duration: 0.3, delay: rowDelay, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className={cn("grid size-9 shrink-0 place-items-center rounded-[12px]", ACCENT_TILE[skill.accent])}>
        <Icon className="size-4.5" aria-hidden />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-[13.5px] font-bold">{skill.name}</span>
          <span className="tnum shrink-0 text-[12px] font-extrabold text-ink-muted">
            <AnimatedCounter to={skill.percent} suffix="%" />
          </span>
        </div>

        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-sunk">
          <motion.span
            className={cn("quest-shine relative block h-full rounded-full", ACCENT_LINE[skill.accent])}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: skill.percent / 100 }}
            viewport={revealOnce}
            style={{ transformOrigin: "left" }}
            transition={{ duration: 0.6, delay: barDelay, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </motion.li>
  );
}
