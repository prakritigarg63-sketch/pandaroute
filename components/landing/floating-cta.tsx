"use client";

import { useEffect, type RefObject } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { cn } from "@/lib/cn";
import { DiagnosticButtonContent } from "@/components/landing/shared";
import type { HomeCtaPhase } from "@/lib/landing/use-home-cta";

/* ---------------------------------------------------------------------------
   The floating "Start diagnostic" bar.

   Visible once the hero's own CTA has scrolled out of view, and hidden again
   the moment either the hero or the final conversion card comes back into
   view — the whole point is to stand in for a CTA that's currently off
   screen, not to duplicate one that's already visible.

   When Home carries the app nav, this sits just above the mobile tab bar and
   beside the desktop sidebar, so the two never overlap.
--------------------------------------------------------------------------- */

const CTA_LABEL: Record<HomeCtaPhase, string> = {
  new: "Start my diagnostic →",
  resume: "Continue my journey →",
  return: "Continue my journey →",
};

const HIDDEN_PADDING_PX = 72;

export function FloatingCta({
  heroRef,
  finalCtaRef,
  onStart,
  starting,
  phase,
  withAppNav,
}: {
  heroRef: RefObject<HTMLElement | null>;
  finalCtaRef: RefObject<HTMLElement | null>;
  onStart: () => void;
  starting: boolean;
  phase: HomeCtaPhase;
  withAppNav: boolean;
}) {
  const heroInView = useInView(heroRef, { margin: "-10% 0px 0px 0px" });
  const finalInView = useInView(finalCtaRef, { margin: "0px 0px -10% 0px" });
  const show = !heroInView && !finalInView;

  // The bar occupies real space once shown, so the page gets matching padding
  // rather than the bar simply covering the last few pixels of content.
  // BottomNav needs no such compensation — it's sticky, not fixed, so it
  // already reserves its own space in normal flow.
  useEffect(() => {
    document.body.style.paddingBottom = show ? `${HIDDEN_PADDING_PX}px` : "";
    return () => {
      document.body.style.paddingBottom = "";
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={cn(
            "fixed right-0 bottom-0 left-0 z-40 border-t border-line bg-canvas/95 px-4 pt-2.5 backdrop-blur-md",
            // 4rem = the mobile tab bar's height; 14rem = the desktop sidebar.
            withAppNav && "max-lg:bottom-16 lg:left-56",
          )}
          initial={{ y: 64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 64, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mx-auto max-w-[430px] pb-2.5">
            <button
              type="button"
              onClick={onStart}
              disabled={starting}
              aria-busy={starting}
              className="quest-cta flex min-h-13 w-full items-center justify-center rounded-[var(--radius-pill)] bg-quest text-[15px] font-extrabold text-navy disabled:cursor-default"
            >
              <DiagnosticButtonContent starting={starting} idleLabel={CTA_LABEL[phase]} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
