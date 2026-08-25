"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Compass, Sparkles } from "lucide-react";
import { PandaGuide } from "@/components/landing/panda-guide";
import { useReducedMotionPreference } from "@/lib/landing/use-reduced-motion";
import { motionTokens } from "@/lib/landing/motion";

/* ---------------------------------------------------------------------------
   The waving panda and its speech bubble.

   Three phases, one component: "enter" (fade/scale up, per the brief's
   opening beat), "wave" (a one-shot greeting), then "idle" (a very slow
   breathe). PandaGuide's own idle loop is switched off here — this component
   drives the panda's transform for its whole life on this screen, so the two
   never compound into a jittery double animation.

   Only one panda asset exists (see panda-guide.tsx), so "waving" rotates the
   whole figure around a pivot near the raised hand rather than isolating an
   arm that was never drawn as a separate layer. That reads as a wave without
   distorting the artwork — see the summary for this tradeoff.
--------------------------------------------------------------------------- */

const WAVE_START_MS = 650;
const WAVE_DURATION_S = 1.4;
// The brief's preferred keyframes are tuned for an isolated arm layer. This
// asset has none — the whole figure rotates around a pivot near the raised
// hand instead (see the file note above) — so the shape is kept but scaled
// to about 75% amplitude: at full amplitude, rotating the whole body (more
// mass, farther from the pivot, than a shoulder-only arm) reads as a wobble,
// not a wave.
const WAVE_ROTATE = [0, -9, 11, -8, 9, -4, 0];

const PULSE_SCALE = [1, 1.03, 1];

const SPARK_COLORS = ["#F59A00", "#FFB800", "#FFD67A"];
const SPARK_POSITIONS = [
  { top: "8%", right: "6%", delay: "0ms" },
  { top: "-2%", right: "26%", delay: "110ms" },
  { top: "22%", right: "-6%", delay: "200ms" },
];

function Sparks() {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      {SPARK_POSITIONS.map((position, i) => (
        <Sparkles
          key={i}
          className="quest-spark absolute size-2.5"
          style={
            {
              ...position,
              color: SPARK_COLORS[i % SPARK_COLORS.length],
              "--dx": "0px",
              "--dy": "-10px",
              "--delay": position.delay,
            } as unknown as React.CSSProperties
          }
        />
      ))}
    </span>
  );
}

export function PandaWelcome({
  celebrate = false,
  pulse = false,
  title = "Welcome back!",
  message = "Your route is saved and ready when you are.",
}: {
  celebrate?: boolean;
  /** A quick, non-blocking acknowledgement for a social-login tap — lighter
   *  and faster than `celebrate`, and never delays the auth it accompanies. */
  pulse?: boolean;
  title?: string;
  message?: string;
}) {
  const reduced = useReducedMotionPreference();
  const [phase, setPhase] = useState<"enter" | "wave" | "idle">("enter");

  useEffect(() => {
    if (reduced) return;
    const toWave = window.setTimeout(() => setPhase("wave"), WAVE_START_MS);
    const toIdle = window.setTimeout(
      () => setPhase("idle"),
      WAVE_START_MS + WAVE_DURATION_S * 1000,
    );
    return () => {
      window.clearTimeout(toWave);
      window.clearTimeout(toIdle);
    };
  }, [reduced]);

  const animate = celebrate
    ? { opacity: 1, scale: [1, 1.04, 1], y: [0, -6, 0], rotate: [0, -8, 9, 0] }
    : pulse && !reduced
      ? { opacity: 1, scale: PULSE_SCALE, y: 0, rotate: [0, -4, 4, 0] }
      : phase === "wave" && !reduced
        ? { opacity: 1, scale: 1, y: 0, rotate: WAVE_ROTATE }
        : phase === "idle" && !reduced
          ? { opacity: 1, scale: 1, y: [0, -2, 0], rotate: [0, 1, 0] }
          : { opacity: 1, scale: 1, y: 0, rotate: 0 };

  const transition = celebrate
    ? { duration: 0.5, ease: motionTokens.easing.gentle }
    : pulse && !reduced
      ? { duration: 0.32, ease: motionTokens.easing.gentle }
      : phase === "wave" && !reduced
        ? { duration: WAVE_DURATION_S, ease: "easeInOut" as const }
        : phase === "idle" && !reduced
          ? {
              y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" as const },
              rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" as const },
            }
          : { duration: reduced ? 0 : 0.55, ease: motionTokens.easing.standard };

  const showSparks = !reduced && (celebrate || pulse || phase === "wave");

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        className="relative"
        style={{ transformOrigin: "76% 34%" }}
        initial={reduced ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.92, y: 12 }}
        animate={animate}
        transition={transition}
      >
        <PandaGuide variant="explorer" mood="welcoming" size="large" animate={false} />
        {showSparks && <Sparks />}
      </motion.div>

      <motion.div
        role="status"
        className="relative -mt-2 max-w-[19.5rem] rounded-[21px] border border-line bg-surface px-4 py-3 text-center shadow-warm"
        initial={reduced ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: reduced ? 0 : 0.4,
          delay: reduced ? 0 : 0.85,
          ease: [0.34, 1.15, 0.64, 1],
        }}
      >
        <span
          aria-hidden
          className="absolute -top-[7px] left-1/2 size-3.5 -translate-x-1/2 rotate-45 border-t border-l border-line bg-surface"
        />
        <p className="text-[15px] leading-snug font-extrabold">{title}</p>
        <p className="mt-0.5 flex items-center justify-center gap-1 text-[13.5px] leading-snug text-ink-muted">
          {message}
          <Compass className="size-3.5 shrink-0 text-primary-strong" aria-hidden />
        </p>
      </motion.div>
    </div>
  );
}
