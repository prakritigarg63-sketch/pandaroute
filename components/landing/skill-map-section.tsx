"use client";

import { Award, Cpu, Users, Wrench } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { ACCENT_TILE, SKILLS, type Skill } from "@/lib/landing/content";
import { revealOnce } from "@/lib/landing/motion";

/* ---------------------------------------------------------------------------
   Skill map preview.

   Segment fill is what a user actually reads as "progress"; the status word
   only confirms it, so the label animates in a beat after its own segments
   finish rather than alongside them. `viewport={{ once: true }}` on the
   section is what makes this run once per visit — scrolling past it again
   does not replay the fill.
--------------------------------------------------------------------------- */

const SKILL_ICON = { "ai-fluency": Cpu, "technical-collaboration": Users, "product-judgment": Award, "building-with-tools": Wrench } as const;

const ROW_GAP = 0.18;
const SEGMENT_GAP = 0.06;

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
  const labelDelay = rowDelay + skill.totalLevels * SEGMENT_GAP + 0.12;

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
          <motion.span
            className="shrink-0 text-[11px] font-bold text-ink-muted"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={revealOnce}
            transition={{ duration: 0.25, delay: labelDelay }}
          >
            {skill.status}
          </motion.span>
        </div>

        <div className="mt-1.5 flex gap-1">
          {Array.from({ length: skill.totalLevels }, (_, segment) => {
            const filled = segment < skill.level;
            return (
              <span
                key={segment}
                className="h-1.5 flex-1 overflow-hidden rounded-full bg-sunk"
              >
                {filled && (
                  <motion.span
                    className="quest-shine relative block h-full rounded-full bg-primary"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={revealOnce}
                    style={{ transformOrigin: "left" }}
                    transition={{
                      duration: 0.28,
                      delay: rowDelay + segment * SEGMENT_GAP,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                )}
              </span>
            );
          })}
        </div>
      </div>
    </motion.li>
  );
}
