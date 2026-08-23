"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";
import { PandaSpeechBubble } from "@/components/panda/panda-speech-bubble";
import {
  REACTION_ART,
  REACTION_GLOW,
  REACTION_MOTION,
  type PandaReaction,
} from "@/components/panda/panda-reactions";

/* ---------------------------------------------------------------------------
   Panda.

   Presentational on purpose: the mascot plays whatever reaction it is handed
   and says whatever message comes with it. Timing — when a reaction settles,
   when a bubble fades — belongs to usePandaCue, so one screen can drive Panda
   from several different triggers without two clocks fighting each other.

   The artwork is a single asset. Reactions are motion, not expressions.
--------------------------------------------------------------------------- */

export type PandaSize = "small" | "medium" | "large";

/** Intrinsic ratio of public/panda-mascot.png (360 × 337). */
const BOX: Record<PandaSize, { width: number; height: number }> = {
  small: { width: 72, height: 67 },
  medium: { width: 96, height: 90 },
  large: { width: 120, height: 112 },
};

export interface PandaMascotProps {
  reaction?: PandaReaction;
  message?: string;
  size?: PandaSize;
  /** Makes Panda a button. Leave off where Panda is only illustration. */
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function PandaMascot({
  reaction = "idle",
  message,
  size = "medium",
  interactive = false,
  onClick,
  className,
}: PandaMascotProps) {
  const box = BOX[size];
  const glow = REACTION_GLOW.has(reaction);

  const panda = (
    // Keyed by the reaction so a CSS one-shot restarts on every change — cheaper
    // and simpler than tracking "currently playing" in React state.
    <span key={reaction} className={cn("relative inline-flex", REACTION_MOTION[reaction])}>
      {glow && <span className="panda-glow" aria-hidden />}
      {reaction === "celebrate" && (
        <span className="panda-sparkles" aria-hidden>
          <span />
          <span />
          <span />
        </span>
      )}
      <Image
        src={REACTION_ART[reaction]}
        alt={interactive ? "" : "Panda, your Pandaroute buddy"}
        width={box.width}
        height={box.height}
        priority
        className="relative"
      />
    </span>
  );

  return (
    // Full width only when a bubble has to centre on the column rather than on
    // the mascot; inline uses of Panda must stay their own size.
    <div className={cn("relative flex justify-center", message && "w-full", className)}>
      {message && <PandaSpeechBubble message={message} />}

      {/* Panda's words reach a screen reader here rather than from the bubble,
          which is decorative markup that comes and goes. */}
      <p role="status" aria-live="polite" className="sr-only">
        {message ?? ""}
      </p>

      <span className="panda-idle inline-flex">
        {interactive ? (
          <button
            type="button"
            onClick={onClick}
            aria-label="Talk to Panda"
            className="inline-flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            {panda}
          </button>
        ) : (
          panda
        )}
      </span>
    </div>
  );
}
