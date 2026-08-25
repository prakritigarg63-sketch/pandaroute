"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Clock3,
  Code2,
  Gauge,
  LayoutGrid,
  Lightbulb,
  TrendingUp,
  Trophy,
  Users2,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { PandaAside } from "@/components/panda/panda-aside";
import { BottomNav } from "@/components/layout/bottom-nav";
import { DemoJump } from "@/components/route/next-screens";
import { CAPABILITY_BY_ID } from "@/lib/diagnostic/capabilities";
import { useDiagnostic } from "@/lib/diagnostic/use-diagnostic";
import { CAPSTONE_REQUIREMENT } from "@/lib/challenge/challenges";
import { progression, useLoop } from "@/lib/challenge/use-challenge";
import { useCareer } from "@/lib/career/use-career";
import {
  SECTIONS,
  recommendedReason,
  resolveLibrary,
  type LibrarySection,
  type ResolvedEntry,
} from "@/lib/challenge/library";

/* ---------------------------------------------------------------------------
   The Challenge Library.

   "What should I practice next?" answered three ways at once: one clear
   recommendation up top, a full browsable set below it, and an honest label
   on anything that isn't playable yet. Nothing here is locked without a real
   prerequisite — a card with no content behind it says "Coming soon," not
   a padlock.
--------------------------------------------------------------------------- */

const SECTION_ICON: Record<LibrarySection, typeof Lightbulb> = {
  "product-thinking": Lightbulb,
  "data-decisions": BarChart3,
  "technical-fluency": Code2,
  collaboration: Users2,
  "career-growth": TrendingUp,
};

const BADGE: Record<ResolvedEntry["state"], { label: string; className: string }> = {
  recommended: { label: "RECOMMENDED", className: "bg-primary text-ink" },
  new: { label: "NEW", className: "bg-primary-soft text-primary-ink" },
  "in-progress": { label: "IN PROGRESS", className: "bg-primary-soft text-primary-ink" },
  completed: { label: "✓ COMPLETED", className: "bg-skip-soft text-skip" },
  verified: { label: "✓ CAPABILITY VERIFIED", className: "bg-skip-soft text-success" },
  "coming-soon": { label: "COMING SOON", className: "bg-sunk text-ink-faint" },
};

function ChallengeCard({ entry, index }: { entry: ResolvedEntry; index: number }) {
  const badge = BADGE[entry.state];
  const disabled = entry.state === "coming-soon";
  const style = { animationDelay: `${Math.min(index, 9) * 40}ms` };

  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        <span className="text-[26px] leading-none" aria-hidden>
          {entry.emoji}
        </span>
        <span
          className={cn(
            "shrink-0 rounded-[var(--radius-pill)] px-2 py-0.5 text-[10px] font-bold tracking-[0.06em] whitespace-nowrap uppercase",
            badge.className,
          )}
        >
          {badge.label}
        </span>
      </div>

      <p className="mt-2.5 text-[15.5px] leading-snug font-extrabold">{entry.title}</p>
      <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">{entry.description}</p>

      <span className="mt-2.5 inline-flex w-fit rounded-[var(--radius-pill)] bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-primary-ink">
        {entry.tag}
      </span>

      <div className="mt-3 flex items-center justify-between border-t border-line pt-2.5">
        <span className="flex items-center gap-3 text-[12px] text-ink-muted">
          <span className="flex items-center gap-1">
            <Clock3 className="size-3.5" aria-hidden />
            {entry.minutes} min
          </span>
          <span className="flex items-center gap-1">
            <Gauge className="size-3.5" aria-hidden />
            {entry.difficulty}
          </span>
        </span>
        {!disabled && (
          <span className="text-[13px] font-bold text-primary-ink">{entry.cta}</span>
        )}
      </div>
    </>
  );

  const className = cn(
    "route-chip flex flex-col rounded-[var(--radius-card)] border bg-surface p-4 shadow-warm transition-[background-color,transform] duration-200",
    entry.state === "recommended" ? "border-primary-strong/45" : "border-line",
    disabled ? "opacity-60" : "hover:bg-sunk/30 active:scale-[0.98]",
  );

  if (disabled) {
    return (
      <div className={className} style={style} aria-disabled="true" title="Coming soon">
        {body}
      </div>
    );
  }

  return (
    <Link href={entry.href!} className={className} style={style}>
      {body}
    </Link>
  );
}

export function ChooseNextChallenge() {
  const diagnostic = useDiagnostic();
  const loop = useLoop();
  const career = useCareer();
  const counts = progression(loop);
  const capstoneUnlocked = counts.coreVerified >= CAPSTONE_REQUIREMENT;

  const [filter, setFilter] = useState<LibrarySection | null>(null);

  const { entries, recommended } = useMemo(
    () => resolveLibrary(diagnostic.answers, loop, career),
    [diagnostic.answers, loop, career],
  );

  const shown = filter ? entries.filter((e) => e.section === filter) : entries;

  const pandaReaction = capstoneUnlocked ? "celebrate" : "helpful";
  const pandaMessage = capstoneUnlocked
    ? "Every core gap on your route is closed. You're ready for the Capstone."
    : recommended
      ? `${CAPABILITY_BY_ID.get(recommended.capabilityId ?? "")?.name ?? recommended.tag} is your biggest opportunity right now. Want to strengthen it?`
      : "Not sure what to pick? I'd start with the challenge that strengthens your biggest gap.";

  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col px-5 pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1.25rem)]">
      <div className="gps-rise">
        <h1 className="text-[24px] leading-tight font-extrabold text-balance">
          Choose your next challenge
        </h1>
        <p className="mt-1 text-[14px] leading-snug text-ink-muted">
          Pick a new challenge to continue building your PM capabilities.
        </p>
      </div>

      <div
        className="gps-rise mt-4 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ animationDelay: "60ms" }}
        role="group"
        aria-label="Filter challenges"
      >
        <button
          type="button"
          aria-pressed={filter === null}
          onClick={() => setFilter(null)}
          className={cn(
            "flex min-h-10 shrink-0 items-center gap-1.5 rounded-[var(--radius-pill)] border px-3.5 text-[13px] font-semibold whitespace-nowrap transition-colors",
            filter === null
              ? "border-primary-strong bg-primary-fill text-ink"
              : "border-line bg-surface text-ink-muted hover:bg-sunk/60",
          )}
        >
          <LayoutGrid className="size-3.5" aria-hidden />
          All
        </button>
        {SECTIONS.map((section) => {
          const Icon = SECTION_ICON[section.id];
          const isOn = filter === section.id;
          return (
            <button
              key={section.id}
              type="button"
              aria-pressed={isOn}
              onClick={() => setFilter(isOn ? null : section.id)}
              className={cn(
                "flex min-h-10 shrink-0 items-center gap-1.5 rounded-[var(--radius-pill)] border px-3.5 text-[13px] font-semibold whitespace-nowrap transition-colors",
                isOn
                  ? "border-primary-strong bg-primary-fill text-ink"
                  : "border-line bg-surface text-ink-muted hover:bg-sunk/60",
              )}
            >
              <Icon className="size-3.5" aria-hidden />
              {section.label}
            </button>
          );
        })}
      </div>

      {capstoneUnlocked && (
        <div className="gps-rise mt-4 rounded-[var(--radius-card)] border border-success/40 bg-skip-soft p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-[0.1em] text-success uppercase">
            <Trophy className="trophy-in size-4" aria-hidden />
            Route milestone
          </p>
          <p className="mt-1.5 text-[17px] leading-snug font-extrabold">
            Your PM Capstone is unlocked
          </p>
          <p className="mt-1 text-[13.5px] leading-relaxed text-ink-muted">
            You&apos;ve built enough evidence across the core capabilities. Now combine them in
            one realistic product problem.
          </p>
          <Button size="lg" full className="mt-3" href="/capstone">
            Start my Capstone →
          </Button>
        </div>
      )}

      {!filter && recommended && (
        <div className="mt-5">
          <p className="text-[11px] font-extrabold tracking-[0.12em] text-ink-faint uppercase">
            Recommended for you
          </p>
          <p className="mt-0.5 text-[13px] text-ink-muted">
            Based on your current capability gaps.
          </p>

          <Link
            href={recommended.href ?? "#"}
            className="mt-2 flex flex-col rounded-[var(--radius-card)] border border-primary-strong/45 bg-primary-soft p-4 shadow-warm-lg transition-transform active:scale-[0.99]"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-[30px] leading-none" aria-hidden>
                {recommended.emoji}
              </span>
              <span className="shrink-0 rounded-[var(--radius-pill)] bg-primary px-2.5 py-1 text-[10px] font-bold tracking-[0.06em] text-ink uppercase">
                Recommended
              </span>
            </div>

            <p className="mt-2.5 text-[19px] leading-snug font-extrabold">{recommended.title}</p>
            <span className="mt-1.5 inline-flex w-fit rounded-[var(--radius-pill)] bg-surface/80 px-2.5 py-1 text-[11px] font-semibold text-primary-ink">
              {recommended.tag}
            </span>

            <p className="mt-2.5 text-[14px] leading-relaxed">{recommended.description}</p>

            <p className="mt-2.5 rounded-[var(--radius-tile)] bg-surface/70 px-3 py-2 text-[12.5px] leading-snug text-ink-muted">
              <span className="font-bold text-ink">Why this challenge? </span>
              {recommendedReason(recommended)}
            </p>

            <div className="mt-3 flex items-center gap-3 text-[12px] text-ink-muted">
              <span className="flex items-center gap-1">
                <Clock3 className="size-3.5" aria-hidden />~{recommended.minutes} min
              </span>
              <span className="flex items-center gap-1">
                <Gauge className="size-3.5" aria-hidden />
                {recommended.difficulty}
              </span>
            </div>

            {/* Visual only — the whole card above is already the link, and an
                <a> (Button's href form) can't nest inside this outer <a>. */}
            <span className="mt-3 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-primary text-base font-semibold text-ink">
              {recommended.cta}
            </span>
          </Link>
        </div>
      )}

      {(filter ? SECTIONS.filter((s) => s.id === filter) : SECTIONS).map((section) => {
        const rows = shown.filter((e) => e.section === section.id);
        if (rows.length === 0) return null;

        return (
          <div key={`${section.id}-${filter ?? "all"}`} className="mt-6">
            <p className="text-[11px] font-extrabold tracking-[0.12em] text-ink-faint uppercase">
              {section.label}
            </p>
            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {rows.map((entry, i) => (
                <ChallengeCard key={entry.id} entry={entry} index={i} />
              ))}
            </div>
          </div>
        );
      })}

      {shown.length === 0 && (
        <div className="gps-rise mt-8 flex flex-col items-center gap-2 text-center">
          <span className="text-[36px] leading-none" aria-hidden>
            🐼
          </span>
          <p className="text-[15px] leading-snug font-bold">
            No challenges here yet. Try another capability area.
          </p>
          <Button size="md" variant="outline" className="mt-1" onClick={() => setFilter(null)}>
            Show all challenges
          </Button>
        </div>
      )}

      <div className="mt-auto flex flex-col gap-2.5 pt-6">
        <PandaAside reaction={pandaReaction} message={pandaMessage} />
        {capstoneUnlocked ? (
          <Button size="lg" full href="/capstone">
            Start my Capstone →
          </Button>
        ) : (
          <DemoJump label="Simulate finishing more challenges" target={5} />
        )}
      </div>

      <BottomNav active="challenges" />
    </div>
  );
}
