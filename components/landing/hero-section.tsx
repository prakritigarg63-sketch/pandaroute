"use client";

import { DiagnosticButtonContent } from "@/components/landing/shared";
import { WavingPanda } from "@/components/landing/waving-panda";
import type { HomeCtaPhase } from "@/lib/landing/use-home-cta";

// Anyone with saved progress (mid-diagnostic or finished) is picked up where
// they left off by useHomeCta — the label just says so.
const CTA_LABEL: Record<HomeCtaPhase, string> = {
  new: "Start my diagnostic →",
  resume: "Continue my journey →",
  return: "Continue my journey →",
};

// "Progress saved" is true: diagnostic answers persist as they're chosen
// (lib/diagnostic/use-diagnostic.ts) and resume at the first unanswered one.
const DETAILS = ["10–15 minutes", "No grades", "Progress saved"];

/* ---------------------------------------------------------------------------
   The hero.

   Desktop: copy left, the waving panda right. Mobile: a compact panda and its
   greeting first, so the welcome lands before the pitch — but small enough
   that the headline and button still sit near the top of the screen.

   The greeting is real text rather than part of the artwork, so it stays
   sharp, translatable and readable by a screen reader.
--------------------------------------------------------------------------- */

export function HeroSection({
  onStart,
  starting,
  phase,
  heroRef,
}: {
  onStart: () => void;
  starting: boolean;
  phase: HomeCtaPhase;
  heroRef: React.RefObject<HTMLElement | null>;
}) {
  return (
    <section ref={heroRef} className="relative overflow-hidden bg-cream" aria-labelledby="hero-title">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-3 px-5 pt-2 pb-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-6 lg:px-8 lg:pt-4 lg:pb-6">
        <figure className="relative flex items-end gap-1 lg:order-last lg:block">
          <WavingPanda
            sizes="(min-width: 1024px) 560px, 192px"
            className="-ml-3 w-36 shrink-0 sm:w-48 lg:mx-auto lg:-my-6 lg:w-full lg:max-w-[min(38rem,72vh)]"
          />

          <figcaption className="mb-9 lg:absolute lg:top-[4%] lg:right-[2%] lg:mb-0">
            <SpeechBubble />
          </figcaption>
        </figure>

        <div className="lg:py-10">
          <p className="inline-flex rounded-[var(--radius-pill)] bg-primary-soft px-3.5 py-1.5 text-[11px] font-extrabold tracking-[0.18em] text-primary-ink uppercase lg:text-[12.5px]">
            Your next chapter starts here
          </p>

          <h1
            id="hero-title"
            className="mt-4 font-display text-[34px] leading-[1.08] font-extrabold tracking-tight text-balance text-navy sm:text-[42px] lg:mt-5 lg:text-[clamp(2.4rem,3.85vw,3.15rem)]"
            // Capped so "Discover your strengths." holds one line in the
            // full-width copy column (the line is ~11.5em wide).
          >
            <span className="block">Discover your strengths.</span>
            <span className="block text-quest-deep">Find your next step.</span>
          </h1>

          <p className="mt-4 max-w-[34rem] text-[16px] leading-relaxed text-ink-muted lg:text-[18.5px]">
            12 workplace scenarios to understand how you think, spot your gaps, and build your path
            forward.
          </p>

          <button
            type="button"
            onClick={onStart}
            disabled={starting}
            aria-busy={starting}
            className="quest-cta mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-quest px-8 text-[17px] font-extrabold text-navy disabled:cursor-default sm:w-auto lg:mt-7 lg:min-h-16 lg:px-10 lg:text-[19px]"
          >
            <DiagnosticButtonContent starting={starting} idleLabel={CTA_LABEL[phase]} />
          </button>

          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[14px] font-medium text-ink-muted sm:justify-start sm:pl-4 lg:text-[15px]">
            {DETAILS.map((detail, index) => (
              <li key={detail} className="flex items-center gap-2.5">
                {index > 0 && <span aria-hidden className="size-1.5 rounded-full bg-quest" />}
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function SpeechBubble() {
  return (
    <p className="relative rounded-[22px] border-2 border-quest/70 bg-surface px-4 py-2.5 shadow-warm lg:rounded-[28px] lg:px-6 lg:py-4">
      <span className="block font-display text-[15px] leading-tight font-extrabold whitespace-nowrap text-navy lg:text-[24px]">
        Hi, Pathfinder! <span aria-hidden>👋</span>
      </span>
      <span className="mt-0.5 block text-[13px] leading-snug text-ink lg:mt-1 lg:text-[17px]">
        Let&apos;s find your way forward.
      </span>
      {/* The tail points down-left at the panda on desktop, left on mobile. */}
      <span
        aria-hidden
        className="absolute -bottom-[9px] left-5 size-4 rotate-45 border-r-2 border-b-2 border-quest/70 bg-surface max-lg:top-1/2 max-lg:-left-[9px] max-lg:-translate-y-1/2 max-lg:rotate-[135deg] lg:left-auto lg:right-[58%]"
      />
    </p>
  );
}
