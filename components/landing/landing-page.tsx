"use client";

import { useRef } from "react";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { FloatingCta } from "@/components/landing/floating-cta";
import { HeroSection } from "@/components/landing/hero-section";
import { JourneySection } from "@/components/landing/journey-section";
import { DiagnosticStatus } from "@/components/landing/shared";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { useHomeCta } from "@/lib/landing/use-home-cta";
import { BottomNav } from "@/components/layout/bottom-nav";

/* ---------------------------------------------------------------------------
   PandaRoute's Home page — the app's default destination, for a visitor who
   hasn't started the diagnostic and a returning learner alike.

   Every CTA control here calls the same `useHomeCta` hook, so the loading
   state and the navigation are one behaviour shared by every button, not
   copies of it. Each button maps the hook's three phases to its own copy, so
   "Start my diagnostic" becomes "Continue my journey" everywhere at once.

   The app nav (bottom tabs on mobile, sidebar on desktop) only appears once
   there is something in the app to go back to. A first-time visitor would
   find Route, Progress and Profile all empty, so for them it is noise next to
   the one thing this page asks them to do.
--------------------------------------------------------------------------- */

export function LandingPage() {
  const { phase, starting, start } = useHomeCta();
  const heroRef = useRef<HTMLElement>(null);
  const finalCtaRef = useRef<HTMLElement>(null);
  const withAppNav = phase !== "new";

  return (
    <div className="min-h-dvh bg-canvas">
      <SiteHeader withAppNav={withAppNav} />

      {/* The hero's own <h1> is the page's one heading-level-one — see
          hero-section.tsx. No duplicate here. */}
      <main>
        <HeroSection onStart={start} starting={starting} phase={phase} heroRef={heroRef} />
        <JourneySection />
        <BenefitsSection />
        <FinalCtaSection
          onStart={start}
          starting={starting}
          phase={phase}
          finalCtaRef={finalCtaRef}
        />
      </main>

      <SiteFooter />

      <FloatingCta
        heroRef={heroRef}
        finalCtaRef={finalCtaRef}
        onStart={start}
        starting={starting}
        phase={phase}
        withAppNav={withAppNav}
      />

      <DiagnosticStatus starting={starting} />

      {/* BottomNav's own `-mx-5` assumes the `px-5` every `.screen` wrapper
          carries elsewhere in the app — restored here since this page has
          no such ambient padding. */}
      {withAppNav && (
        <div className="px-5">
          <BottomNav active="home" />
        </div>
      )}
    </div>
  );
}
