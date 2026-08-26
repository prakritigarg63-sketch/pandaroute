"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, Check, ChevronRight, Compass, Star, Trophy, Zap } from "lucide-react";
import { cn } from "@/lib/cn";
import { PandaMascot } from "@/components/panda/panda-mascot";
import { PandaAside } from "@/components/panda/panda-aside";
import { SkillDetailSheet } from "@/components/diagnostic/skill-detail-sheet";
import { CAPABILITY_BY_ID, type Capability } from "@/lib/diagnostic/capabilities";
import type { CapabilityResult } from "@/lib/diagnostic/scoring";

/* ---------------------------------------------------------------------------
   The no-gaps state of the Gap Map.

   Rendered by gap-map.tsx in place of the plain list when every assessed
   capability came back Demonstrated. The product rule this exists to serve:
   a learner who has already shown a skill does not get sent back through
   Learn/Strengthen content for it — the route moves to application instead.

   Growth-path selection is local, session-only state (not persisted): the
   brief asks for something to compare while on this screen, not a standing
   preference to remember across visits.
--------------------------------------------------------------------------- */

type GrowthPath = "apply" | "deeper" | "prove";

interface GrowthPathConfig {
  id: GrowthPath;
  icon: typeof Zap;
  label: string;
  description: string;
  exampleLabel: string;
  example: string;
  iconTile: string;
  accentBorder: string;
  accentText: string;
  panda: string;
}

const GROWTH_PATHS: GrowthPathConfig[] = [
  {
    id: "apply",
    icon: Zap,
    label: "⚡ Apply",
    description: "Use your existing skills in realistic PM scenarios.",
    exampleLabel: "Example",
    example: "Prioritize features when engineering capacity is limited.",
    iconTile: "bg-primary-soft text-primary-ink",
    accentBorder: "border-primary-strong/45",
    accentText: "text-primary-ink",
    panda: "Great choice. Let's put your skills to work in realistic product situations.",
  },
  {
    id: "deeper",
    icon: Brain,
    label: "🧠 Go deeper",
    description: "Take advanced challenges that test judgment, ambiguity, and trade-offs.",
    exampleLabel: "Example",
    example: "Choose the right success metric when stakeholders disagree.",
    iconTile: "bg-lavender-soft text-lavender",
    accentBorder: "border-lavender/45",
    accentText: "text-lavender",
    panda: "Ready for harder decisions? We'll increase the ambiguity and trade-offs.",
  },
  {
    id: "prove",
    icon: Trophy,
    label: "🏆 Prove it",
    description: "Complete portfolio-worthy challenges that demonstrate your capability.",
    exampleLabel: "Example",
    example: "Create a product recommendation from user feedback + behavioral data.",
    iconTile: "bg-skip-soft text-skip",
    accentBorder: "border-skip/45",
    accentText: "text-skip",
    panda: "Let's turn what you know into evidence you can actually show.",
  },
];

const LOADING_LINES = [
  "Finding the right challenge level…",
  "Matching challenges to your strengths…",
  "Adding real-world practice…",
  "Preparing your route…",
];

export function StrongFoundation({ results }: { results: CapabilityResult[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<GrowthPath | null>(null);
  const [openSkill, setOpenSkill] = useState<Capability | null>(null);
  const [building, setBuilding] = useState(false);
  const [loadingLine, setLoadingLine] = useState(0);

  useEffect(() => {
    if (!building) return;
    const interval = window.setInterval(() => {
      setLoadingLine((line) => Math.min(line + 1, LOADING_LINES.length - 1));
    }, 320);
    const done = window.setTimeout(() => {
      router.push("/route/advanced");
    }, 1300);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(done);
    };
  }, [building, router]);

  const buildRoute = useCallback(() => {
    if (building) return;
    setBuilding(true);
    setLoadingLine(0);
  }, [building]);

  const selectedConfig = GROWTH_PATHS.find((p) => p.id === selected);

  const demonstrated = results
    .map((result) => CAPABILITY_BY_ID.get(result.capabilityId))
    .filter((capability): capability is Capability => Boolean(capability));

  return (
    <div className="gps-rise flex flex-col">
      {/* Success card */}
      <div className="rounded-[22px] border border-skip/25 bg-skip-soft/40 p-4 shadow-warm">
        <div className="flex justify-center">
          <PandaMascot reaction="celebrate" size="large" />
        </div>

        <div className="mt-3">
          <h2 className="text-center text-[21px] leading-tight font-extrabold text-balance">
            Your foundation is strong 🎉
          </h2>
          <p className="mt-1 text-center text-[14px] font-bold text-skip">
            No critical skill gaps found
          </p>
          <p className="mt-2 text-center text-[13.5px] leading-relaxed text-ink-muted">
            Your diagnostic shows that you already have a strong foundation for this
            transition. Instead of revisiting skills you know, PandaRoute will focus
            your route on application, depth, and real-world practice.
          </p>

          <div className="mt-3">
            {/* mascot=false: the big PandaMascot above is already this card's
                one panda — a second avatar here would be the same mascot
                twice in one card. */}
            <PandaAside
              mascot={false}
              reaction="helpful"
              message="Looks like we don't need to fill gaps. Let's raise the difficulty. 🚀"
            />
          </div>
        </div>
      </div>

      {/* What's next */}
      <p className="mt-6 text-[19px] leading-tight font-extrabold">What&apos;s next for you?</p>
      <p className="mt-1 text-[13.5px] text-ink-muted">Choose how you want to grow next.</p>

      <ul className="mt-3 grid grid-cols-1 gap-2.5">
        {GROWTH_PATHS.map((path, index) => {
          const Icon = path.icon;
          const isSelected = selected === path.id;
          return (
            <li
              key={path.id}
              className="route-chip"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelected(isSelected ? null : path.id)}
                className={cn(
                  "quest-card flex h-full w-full flex-col rounded-[20px] border bg-surface p-4 text-left transition-[transform,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isSelected ? cn(path.accentBorder, "scale-[1.015]") : "border-line",
                )}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={cn(
                      "quest-icon grid size-11 place-items-center rounded-[14px] transition-transform",
                      path.iconTile,
                      isSelected && "scale-105",
                    )}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                  {isSelected && (
                    <span
                      className={cn(
                        "grid size-5 shrink-0 place-items-center rounded-full bg-surface",
                        path.accentText,
                      )}
                    >
                      <Check className="size-4" aria-hidden />
                    </span>
                  )}
                </div>

                <p className="mt-2.5 text-[15.5px] leading-snug font-extrabold">{path.label}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
                  {path.description}
                </p>

                <div className="mt-auto pt-3">
                  <div className="rounded-[14px] bg-sunk/60 p-2.5">
                    <p className={cn("text-[10.5px] font-extrabold tracking-[0.06em] uppercase", path.accentText)}>
                      {path.exampleLabel}
                    </p>
                    <div className="mt-1 flex items-end justify-between gap-2">
                      <p className="text-[12.5px] leading-snug text-ink-muted">{path.example}</p>
                      <span
                        className={cn(
                          "grid size-7 shrink-0 place-items-center rounded-full",
                          path.iconTile,
                        )}
                        aria-hidden
                      >
                        <ChevronRight className="size-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Advanced route CTA */}
      <div className="mt-4 flex flex-col items-stretch gap-3 rounded-[20px] border border-primary-strong/30 bg-primary-soft p-4">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-surface text-primary-strong">
            <Star className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-[15.5px] leading-snug font-extrabold">
              Ready to take the next step?
            </p>
            <p className="mt-0.5 text-[13px] leading-snug text-ink-muted">
              We&apos;ll build an advanced route tailored to your strengths and goals.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={buildRoute}
          disabled={building}
          aria-busy={building}
          className="quest-cta flex min-h-13 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-primary px-5 text-[15px] font-extrabold text-ink disabled:cursor-default"
        >
          {building ? (
            <>
              <Compass className="size-4.5 animate-spin [animation-duration:1.1s]" aria-hidden />
              Building your route…
            </>
          ) : (
            "Build my advanced route →"
          )}
        </button>
      </div>
      {building && (
        <p role="status" aria-live="polite" className="mt-2 text-center text-[12.5px] text-ink-muted">
          {LOADING_LINES[loadingLine]}
        </p>
      )}

      {selectedConfig && !building && (
        <div className="mt-3">
          <PandaAside reaction="helpful" message={selectedConfig.panda} />
        </div>
      )}

      {/* Skills at a glance */}
      <div className="mt-6 flex items-center justify-between gap-2">
        <p className="text-[15.5px] font-extrabold">Your skills at a glance</p>
        <span className="flex shrink-0 items-center gap-1 text-[12.5px] font-bold text-skip">
          {demonstrated.length}/{demonstrated.length} foundations demonstrated
          <Check className="size-3.5" aria-hidden />
        </span>
      </div>

      <ul className="mt-2.5 flex flex-wrap gap-1.5">
        {demonstrated.map((capability, index) => (
          <SkillChip
            key={capability.id}
            capability={capability}
            index={index}
            onOpen={() => setOpenSkill(capability)}
          />
        ))}
      </ul>

      {/* Bottom panda coach */}
      <div className="mt-6">
        <PandaAside
          reaction="excited"
          message="Nice! You're ready for advanced challenges. Pick a path above or start your advanced route. ✨"
        />
      </div>

      {openSkill && (
        <SkillDetailSheet capability={openSkill} onClose={() => setOpenSkill(null)} />
      )}
    </div>
  );
}

function SkillChip({
  capability,
  index,
  onOpen,
}: {
  capability: Capability;
  index: number;
  onOpen: () => void;
}) {
  return (
    <li
      className="route-chip"
      style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
    >
      <button
        type="button"
        onClick={onOpen}
        className="flex min-h-9 items-center gap-1.5 rounded-[var(--radius-pill)] border border-skip/25 bg-skip-soft/50 px-3 py-1.5 text-[12.5px] font-semibold text-ink transition-colors hover:bg-skip-soft"
      >
        <Check className="size-3.5 shrink-0 text-skip" aria-hidden />
        {capability.name}
      </button>
    </li>
  );
}
