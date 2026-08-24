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
import { useStartDiagnostic } from "@/lib/landing/use-start-diagnostic";

/* ---------------------------------------------------------------------------
   PandaRoute's marketing landing page.

   A different audience than the rest of the app: someone who hasn't decided
   to use PandaRoute yet, arriving from a search or a link rather than mid
   product. Every "start the diagnostic" control here calls the same
   `useStartDiagnostic` hook, so the loading state, the panda reaction and the
   navigation are one behaviour shared by four buttons, not four copies of it.
--------------------------------------------------------------------------- */

export function LandingPage() {
  const { starting, start } = useStartDiagnostic();
  const heroRef = useRef<HTMLElement>(null);
  const finalCtaRef = useRef<HTMLElement>(null);

  return (
    <div className="min-h-dvh bg-canvas">
      <SiteHeader onStart={start} starting={starting} />

      {/* The hero's own <h1> is the page's one heading-level-one — see
          hero-section.tsx. No duplicate here. */}
      <main>
        <HeroSection onStart={start} starting={starting} heroRef={heroRef} />
        <RouteSection />
        <SkillMapSection />
        <BenefitsSection />
        <QuestCardSection />
        <TestimonialSection />
        <FinalCtaSection onStart={start} starting={starting} finalCtaRef={finalCtaRef} />
      </main>

      <SiteFooter />

      <FloatingCta
        heroRef={heroRef}
        finalCtaRef={finalCtaRef}
        onStart={start}
        starting={starting}
      />

      <DiagnosticStatus starting={starting} />
    </div>
  );
}
