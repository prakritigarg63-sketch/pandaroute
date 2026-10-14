"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotionPreference } from "@/lib/landing/use-reduced-motion";

/* ---------------------------------------------------------------------------
   The hero panda: a static illustration that waves.

   The still is always rendered first, so the panda is on screen the moment
   the page paints. The wave is a separate 5s clip (generated with Higgsfield
   from this same still, which is both its first and last frame) laid over the
   still and only revealed once it is actually playing — so a slow network, a
   blocked autoplay or a decode failure all degrade to the still, never to an
   empty box.

   Playback: one wave on arrival, then a rest between waves so the panda
   doesn't compete with the diagnostic button; paused whenever the hero is off
   screen. Nothing is downloaded at all for reduced-motion visitors, or on
   Data Saver / 2G.

   Two encodes (silent H.264, faststart): 768px for the desktop hero (~380 KB)
   and 384px for the small mobile panda (~100 KB), picked by <source media>.
   The 768px source comes first so a browser that ignores `media` gets the
   sharp one rather than a blurry one.
--------------------------------------------------------------------------- */

const POSTER_SMALL = "/landing/panda-wave-poster-384.jpg";
const POSTER = "/landing/panda-wave-poster.jpg";
const POSTER_LARGE = "/landing/panda-wave-poster-1200.jpg";
const CLIP = "/landing/panda-wave.mp4";
const CLIP_SMALL = "/landing/panda-wave-384.mp4";
// Matches the hero's `lg` breakpoint, where the panda grows to full size.
const LARGE_CLIP_MEDIA = "(min-width: 1024px)";
const REST_BETWEEN_WAVES_MS = 7000;

interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: string;
}

function connectionAllowsVideo(): boolean {
  const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  if (!connection) return true;
  if (connection.saveData) return false;
  return !["slow-2g", "2g"].includes(connection.effectiveType ?? "");
}

export function WavingPanda({ className, sizes }: { className?: string; sizes: string }) {
  const reduced = useReducedMotionPreference();
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [clipAllowed, setClipAllowed] = useState(false);
  // Re-checked on every render so switching Reduce Motion on mid-visit removes
  // the clip at once, not just on the next page load.
  const loadClip = clipAllowed && !reduced;
  const [playing, setPlaying] = useState(false);

  // Decide after the page has finished loading, so the clip never competes
  // with the page's own first paint for bandwidth.
  useEffect(() => {
    if (reduced || !connectionAllowsVideo()) return;

    const enable = () => setClipAllowed(true);
    if (document.readyState === "complete") {
      enable();
      return;
    }
    window.addEventListener("load", enable, { once: true });
    return () => window.removeEventListener("load", enable);
  }, [reduced]);

  useEffect(() => {
    const video = videoRef.current;
    const frame = frameRef.current;
    if (!loadClip || !video || !frame) return;

    let inView = false;
    let rest: number | undefined;

    const wave = () => {
      if (!inView) return;
      // A rejected play() (autoplay policy, decode error) just leaves the still.
      video.play().catch(() => {});
    };

    const onEnded = () => {
      window.clearTimeout(rest);
      rest = window.setTimeout(() => {
        video.currentTime = 0;
        wave();
      }, REST_BETWEEN_WAVES_MS);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) {
          // Coming back mid-rest waits out the rest; anything else resumes.
          if (rest === undefined || video.currentTime < video.duration) wave();
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );

    video.addEventListener("ended", onEnded);
    observer.observe(frame);

    return () => {
      observer.disconnect();
      video.removeEventListener("ended", onEnded);
      window.clearTimeout(rest);
    };
  }, [loadClip]);

  return (
    <div
      ref={frameRef}
      aria-hidden
      // Purely decorative and never in the way of a click. The radial mask
      // feathers the square artwork into the page so its cream ground has no
      // visible edge, whatever the video decoder does to the exact colour.
      className={cn(
        "pointer-events-none relative aspect-square select-none [mask-image:radial-gradient(closest-side,#000_80%,transparent_100%)]",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- a fixed-size
          still that must match the video frame exactly; plain srcset keeps it
          off the image optimiser, which this project can't rely on locally. */}
      <img
        src={POSTER}
        srcSet={`${POSTER_SMALL} 384w, ${POSTER} 768w, ${POSTER_LARGE} 1200w`}
        sizes={sizes}
        alt=""
        width={768}
        height={768}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 size-full object-contain"
      />

      {loadClip && (
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          onPlaying={() => setPlaying(true)}
          // The decoded clip lands ~1.6% darker than the still (#FBF5E9 vs
          // #FFF9ED); this brings its ground back to the page colour.
          className={cn(
            "absolute inset-0 size-full object-contain brightness-[1.016] transition-opacity duration-300",
            playing ? "opacity-100" : "opacity-0",
          )}
        >
          <source src={CLIP} media={LARGE_CLIP_MEDIA} type="video/mp4" />
          <source src={CLIP_SMALL} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
