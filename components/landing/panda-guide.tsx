"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useReducedMotionPreference } from "@/lib/landing/use-reduced-motion";

/* ---------------------------------------------------------------------------
   PandaGuide — the one panda asset, framed for four jobs.

   TO REPLACE THE ARTWORK: change GUIDE_ART below to the new file's path (drop
   the file in public/ first). Every size and layout on the page is set by the
   `size` prop, not by the image's own dimensions, so swapping the file cannot
   shift anything around it. Its natural aspect ratio (256×240) is preserved —
   a taller or wider replacement will letterbox rather than distort.

   Only one PNG exists today, so `mood` does not switch images; it switches the
   frame around the same artwork (a compass ring for "compass", a lift for
   "celebrating") rather than mirroring or stretching a face that was drawn to
   look one way.
--------------------------------------------------------------------------- */

export const GUIDE_ART = "/panda-mascot.png";
const ART_RATIO = 240 / 256;

export type GuideVariant = "explorer" | "coach" | "celebrating" | "compass";
export type GuideMood = "encouraging" | "neutral";

const SIZE_PX: Record<"small" | "medium" | "large", number> = {
  small: 72,
  medium: 128,
  large: 208,
};

export function PandaGuide({
  variant = "explorer",
  mood = "encouraging",
  size = "medium",
  animate = true,
  celebrate = false,
  className,
}: {
  variant?: GuideVariant;
  mood?: GuideMood;
  size?: keyof typeof SIZE_PX;
  /** Idle breathing + occasional tilt. Off during the CTA celebration, which
   *  drives its own motion instead. */
  animate?: boolean;
  /** One short lift-and-settle, played once. */
  celebrate?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotionPreference();
  const width = SIZE_PX[size];
  const height = Math.round(width * ART_RATIO);
  const idle = animate && !reduced && !celebrate;

  return (
    <motion.span
      className={cn("relative inline-flex shrink-0", className)}
      style={{ width, height }}
      animate={
        celebrate
          ? { y: [0, -14, 0], scale: [1, 1.06, 1] }
          : idle
            ? { y: [0, -4, 0], rotate: [0, -0.8, 0, 0.8, 0] }
            : { y: 0, rotate: 0 }
      }
      transition={
        celebrate
          ? { duration: 0.55, ease: [0.34, 1.3, 0.64, 1] }
          : idle
            ? { duration: 6, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0 }
      }
    >
      <Image
        src={GUIDE_ART}
        alt={
          mood === "encouraging"
            ? "Panda, your PandaRoute guide, ready to explore with you"
            : ""
        }
        width={width}
        height={height}
        priority={variant === "explorer"}
        loading={variant === "explorer" ? "eager" : "lazy"}
        className="h-full w-full object-contain"
      />

      {variant === "compass" && (
        <motion.span
          aria-hidden
          className="absolute top-0 right-0 grid size-7 place-items-center rounded-full border-2 border-primary-strong bg-canvas text-primary-strong shadow-warm"
          initial={reduced ? undefined : { rotate: -20 }}
          animate={reduced ? undefined : { rotate: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span aria-hidden className="text-[13px] leading-none">
            ✦
          </span>
        </motion.span>
      )}
    </motion.span>
  );
}
