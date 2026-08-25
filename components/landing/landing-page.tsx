"use client";

import { useRef } from "react";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { FloatingCta } from "@/components/landing/floating-cta";
import { HeroSection } from "@/components/landing/hero-section";
import { QuestCardSection } from "@/components/landing/quest-card-section";
import { RouteSection } from "@/components/landing/route-section";
import { DiagnosticStatus } from "@/components/landing/shared";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { SkillMapSection } from "@/components/landing/skill-map-section";
import { TestimonialSection } from "@/components/landing/testimonial-section";
import { useHomeCta } from "@/lib/landing/use-home-cta";
import { BottomNav } from "@/components/layout/bottom-nav";

/* ---------------------------------------------------------------------------
   PandaRoute's Home page (formerly a standalone marketing landing page —
   see the summary for that move). Now the app's default destination, for a
   visitor who hasn't started the diagnostic and a returning learner alike.

   Every CTA control here calls the same `useHomeCta` hook, so the loading
   state, the panda reaction and the navigation are one behaviour shared by
   four buttons, not four copies of it. `phase` is the one new thing it adds
   over the plain `useStartDiagnostic` this used to call directly: each
   button maps the same three phases to its own copy, so "Start free
   diagnostic" becomes "Continue my journey" everywhere at once when the
   diagnostic is already done.
--------------------------------------------------------------------------- */

export function LandingPage() {
  const { phase, starting, start } = useHomeCta();
  const heroRef = useRef<HTMLElement>(null);
  const finalCtaRef = useRef<HTMLElement>(null);

  return (
    <div className="min-h-dvh bg-canvas">
      <SiteHeader onStart={start} starting={starting} phase={phase} />

      {/* The hero's own <h1> is the page's one heading-level-one — see
          hero-section.tsx. No duplicate here. */}
      <main>
        <HeroSection onStart={start} starting={starting} phase={phase} heroRef={heroRef} />
        <RouteSection />
        <SkillMapSection />
        <BenefitsSection />
        <QuestCardSection />
        <TestimonialSection />
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
      />

      <DiagnosticStatus starting={starting} />

      {/* BottomNav's own `-mx-5` assumes the `px-5` every `.screen` wrapper
          carries elsewhere in the app — restored here since this page has
          no such ambient padding. */}
      <div className="px-5">
        <BottomNav active="home" />
      </div>
    </div>
  );
}
