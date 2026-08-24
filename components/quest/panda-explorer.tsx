"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";

/* ---------------------------------------------------------------------------
   The explorer.

   ONE PLACE TO SWAP THE ARTWORK: change EXPLORER_ART below.

   The reference art — panda in a pith helmet with a clipboard and backpack —
   does not exist in this repo yet, so this renders the existing mascot inside a
   fixed-ratio frame and draws the explorer props (hat brim, compass, satchel)
   as simple shapes on top. Drop the real PNG in public/ and point
   EXPLORER_ART at it: the frame, sizes and layout stay exactly as they are, and
   PROPS can be set to false so the drawn stand-ins disappear.
--------------------------------------------------------------------------- */

export const EXPLORER_ART = "/panda-mascot.png";

/**
 * Drawn stand-ins for the explorer hat and satchel. Off by default: sketched
 * props over the detailed mascot look like a bug, not a costume. Turn them on
 * only against a flat placeholder, and leave them off once EXPLORER_ART is the
 * real explorer artwork.
 */
const PROPS = false;

const SIZE = {
  hero: { w: 168, h: 157 },
  coach: { w: 84, h: 78 },
} as const;

export function PandaExplorer({
  variant = "hero",
  className,
  animate = true,
}: {
  variant?: keyof typeof SIZE;
  className?: string;
  /** Off during the celebration, when the parent drives the motion. */
  animate?: boolean;
}) {
  const { w, h } = SIZE[variant];
  const hero = variant === "hero";

  return (
    <span
      className={cn("relative inline-flex shrink-0", animate && "quest-float", className)}
      style={{ width: w, height: h }}
    >
      <Image
        src={EXPLORER_ART}
        alt={
          hero
            ? "Panda, your Pandaroute guide, dressed as an explorer with a clipboard"
            : "Panda, your Pandaroute guide, taking notes"
        }
        width={w}
        height={h}
        priority={hero}
        className="h-full w-full object-contain"
      />

      {PROPS && (
        <>
          {/* Explorer hat: a brim and a crown, sized to the frame. */}
          <span
            aria-hidden
            className="absolute left-1/2 -translate-x-1/2 rounded-[999px] bg-quest-deep/90"
            style={{ top: hero ? 2 : 1, width: w * 0.62, height: h * 0.09 }}
          />
          <span
            aria-hidden
            className="absolute left-1/2 -translate-x-1/2 rounded-t-[999px] bg-quest/95"
            style={{ top: hero ? -h * 0.05 : -h * 0.04, width: w * 0.4, height: h * 0.11 }}
          />
          {/* Compass badge on the hat band. */}
          <span
            aria-hidden
            className="absolute left-1/2 grid -translate-x-1/2 place-items-center rounded-full border-2 border-quest-deep bg-canvas text-[9px] font-bold text-quest-deep"
            style={{ top: hero ? -h * 0.01 : -h * 0.005, width: h * 0.1, height: h * 0.1 }}
          >
            ✦
          </span>
          {hero && (
            /* Satchel strap across the shoulder. */
            <span
              aria-hidden
              className="absolute rounded-full bg-quest-deep/70"
              style={{
                top: h * 0.45,
                right: w * 0.06,
                width: w * 0.1,
                height: h * 0.28,
                transform: "rotate(12deg)",
              }}
            />
          )}
        </>
      )}
    </span>
  );
}
