"use client";

import Link from "next/link";
import { ChevronLeft, Compass, Shield, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { PandaExplorer } from "@/components/quest/panda-explorer";
import {
  QUEST_COPY,
  TONE,
  type MissionDetail,
  type ScoringCategory,
} from "@/components/quest/quest-data";

/* ---------------------------------------------------------------------------
   The pieces of the Thinking Quest screen.

   Each part owns its own entrance delay through a --delay custom property, so
   the sequence is visible in the markup that composes them rather than hidden
   inside keyframes.
--------------------------------------------------------------------------- */

export function QuestHeader({ xp, awarded }: { xp: string; awarded: boolean }) {
  return (
    <header className="quest-drop flex items-center gap-2" style={{ "--delay": "0ms" } as React.CSSProperties}>
      <Link
        href="/onboarding/transition"
        aria-label="Back to your transition"
        className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-tile)] border border-line bg-surface text-ink-muted transition-colors hover:text-ink"
      >
        <ChevronLeft className="size-5" aria-hidden />
      </Link>

      <span className="compass-settle grid size-8 shrink-0 place-items-center rounded-full border border-line bg-surface text-quest-deep">
        <Compass className="size-4" aria-hidden />
      </span>

      <h1 className="min-w-0 truncate font-display text-[18px] leading-none font-extrabold tracking-tight">
        {QUEST_COPY.title}
      </h1>

      <span className="ml-auto flex shrink items-center gap-1.5">
        <span className="shrink-0 rounded-[var(--radius-pill)] bg-primary-soft px-1.5 py-1 text-[10.5px] font-bold tracking-[0.04em] text-quest-deep uppercase">
          {QUEST_COPY.level}
        </span>
        <span
          aria-live="polite"
          className={cn(
            "tnum flex items-center gap-1 text-[13px] font-bold transition-colors",
            awarded ? "text-quest-deep" : "text-ink-muted",
          )}
        >
          <span
            aria-hidden
            className="grid size-5 place-items-center rounded-full bg-quest-bright text-[9px] font-extrabold text-ink"
          >
            XP
          </span>
          {xp}
        </span>
      </span>
    </header>
  );
}

export function MissionHero({ celebrating }: { celebrating: boolean }) {
  return (
    <section
      className="quest-rise relative mt-3 overflow-hidden rounded-[26px] bg-quest p-4 pr-0 shadow-[0_16px_32px_-20px_rgba(185,111,0,0.75)]"
      style={{ "--delay": "120ms" } as React.CSSProperties}
    >
      {/* The route, drawing itself once. Low contrast, behind everything. */}
      <svg
        aria-hidden
        viewBox="0 0 320 200"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-30"
      >
        <path
          d="M10 180 C 80 170, 90 120, 150 110 S 240 70, 300 30"
          fill="none"
          stroke="#fffdf8"
          strokeWidth="3"
          strokeLinecap="round"
          className="path-draw"
        />
        <path d="M200 200 L250 120 L300 200 Z" fill="#fffdf8" opacity="0.22" />
        <path d="M250 200 L295 135 L320 200 Z" fill="#fffdf8" opacity="0.16" />
      </svg>

      <div className="relative flex items-start gap-2">
        <div className="min-w-0 flex-1 pb-1">
          <span className="inline-block rounded-[var(--radius-pill)] bg-canvas/90 px-2.5 py-1 text-[10px] font-extrabold tracking-[0.14em] text-quest-deep uppercase">
            {QUEST_COPY.eyebrow}
          </span>

          <h2 className="mt-2.5 font-display text-[26px] leading-[1.1] font-extrabold text-balance text-ink">
            {QUEST_COPY.heading}
          </h2>

          <p className="mt-2.5 border-t border-ink/10 pt-2.5 text-[13.5px] leading-snug text-ink/80">
            {QUEST_COPY.standfirst}
          </p>
        </div>

        {/* Overlaps the card edge for depth. */}
        <div className={cn("-mt-2 -mr-2 shrink-0", celebrating && "quest-cheer")}>
          <PandaExplorer variant="hero" animate={!celebrating} />
          {celebrating && <SparkBurst />}
        </div>
      </div>
    </section>
  );
}

function SparkBurst() {
  const sparks = [
    { dx: "-26px", dy: "-22px", delay: "0ms" },
    { dx: "22px", dy: "-30px", delay: "80ms" },
    { dx: "30px", dy: "6px", delay: "150ms" },
    { dx: "-18px", dy: "10px", delay: "210ms" },
  ];

  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      {sparks.map((spark, i) => (
        <Sparkles
          key={i}
          className="quest-spark absolute top-1/2 left-1/2 size-4 text-canvas"
          style={
            {
              "--dx": spark.dx,
              "--dy": spark.dy,
              "--delay": spark.delay,
            } as React.CSSProperties
          }
        />
      ))}
    </span>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 flex items-center gap-2">
      <span className="h-px flex-1 bg-line" aria-hidden />
      <h3 className="text-[11px] font-extrabold tracking-[0.16em] text-ink-muted uppercase">
        {children}
      </h3>
      <span className="h-px flex-1 bg-line" aria-hidden />
    </div>
  );
}

export function MissionDetailCard({
  detail,
  index,
}: {
  detail: MissionDetail;
  index: number;
}) {
  const Icon = detail.icon;

  return (
    <li
      className="quest-card quest-rise flex items-center gap-2.5 rounded-[18px] border border-line bg-surface p-3 shadow-[0_6px_14px_-12px_rgba(93,71,33,0.6)]"
      style={{ "--delay": `${320 + index * 70}ms` } as React.CSSProperties}
    >
      <span
        className={cn(
          "quest-icon grid size-10 shrink-0 place-items-center rounded-[14px]",
          TONE[detail.tone],
        )}
      >
        <Icon className="size-5" aria-hidden />
      </span>

      <span className="min-w-0 border-l border-line pl-2.5">
        <span className="block text-[15px] leading-tight font-extrabold">
          {detail.headline}
        </span>
        <span className="block text-[13px] leading-tight text-ink-muted">{detail.sub}</span>
      </span>
    </li>
  );
}

export function ScoringCategoryRow({
  category,
  index,
}: {
  category: ScoringCategory;
  index: number;
}) {
  const Icon = category.icon;

  return (
    <li
      className="quest-pop flex items-start gap-2.5"
      style={{ "--delay": `${620 + index * 110}ms` } as React.CSSProperties}
    >
      <span
        className={cn(
          "quest-icon grid size-9 shrink-0 place-items-center rounded-full",
          TONE[category.tone],
        )}
      >
        <Icon className="size-4.5" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-[14px] leading-snug font-bold">{category.name}</span>
        <span className="block text-[12.5px] leading-snug text-ink-muted">
          {category.description}
        </span>
      </span>
    </li>
  );
}

export function NoGradesNote() {
  return (
    <p className="mt-3 flex items-center justify-center gap-2 border-t border-line pt-3 text-[12.5px] font-semibold text-ink-muted">
      <Shield className="size-4 shrink-0 text-quest-deep" aria-hidden />
      {QUEST_COPY.noGrades}
    </p>
  );
}

export function PandaCoach({ celebrating }: { celebrating: boolean }) {
  return (
    <div
      className="quest-rise mt-5 flex items-end gap-2"
      style={{ "--delay": "900ms" } as React.CSSProperties}
    >
      <PandaExplorer variant="coach" animate={!celebrating} className="-mb-1" />

      <div className="relative flex-1 rounded-[18px] rounded-bl-sm border border-line bg-surface p-3 shadow-[0_8px_18px_-14px_rgba(93,71,33,0.6)]">
        <Sparkles
          aria-hidden
          className="absolute top-2.5 right-2.5 size-3.5 text-quest-bright"
        />
        <p className="pr-5 text-[13px] leading-snug text-ink">
          Choose what you&apos;d genuinely do.{" "}
          <span className="font-bold">Honest choices unlock a sharper skill map.</span>
        </p>
      </div>
    </div>
  );
}

export function QuestCTA({
  onAccept,
  accepted,
}: {
  onAccept: () => void;
  accepted: boolean;
}) {
  return (
    <div
      className="quest-rise sticky-cta"
      style={{ "--delay": "1000ms" } as React.CSSProperties}
    >
      <button
        type="button"
        onClick={onAccept}
        disabled={accepted}
        aria-live="polite"
        className={cn(
          "quest-cta flex min-h-13 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)]",
          "bg-quest text-[17px] font-extrabold text-ink",
          "focus-visible:outline-2 focus-visible:outline-offset-2",
          "disabled:cursor-default",
        )}
      >
        {accepted ? (
          <>
            <Compass className="size-5 animate-spin [animation-duration:1.2s]" aria-hidden />
            {QUEST_COPY.ctaAccepted}
          </>
        ) : (
          QUEST_COPY.cta
        )}
      </button>

      <p className="mt-2 flex items-center justify-center gap-1.5 text-[12.5px] font-semibold text-ink-muted">
        <span
          aria-hidden
          className="grid size-5 place-items-center rounded-full bg-quest-bright text-[9px] font-extrabold text-ink"
        >
          XP
        </span>
        {QUEST_COPY.xpPromise}
      </p>
    </div>
  );
}
