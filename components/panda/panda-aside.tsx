"use client";

import { cn } from "@/lib/cn";
import { PandaMascot } from "@/components/panda/panda-mascot";
import type { PandaReaction } from "@/components/panda/panda-reactions";

/**
 * Panda, small and beside its words.
 *
 * The form-heavy screens have no room for the mascot the introduction uses, so
 * Panda sits inline at avatar size with the bubble to its right.
 *
 * Nothing renders until Panda has something to say, and the component takes no
 * space when silent — screens that cannot afford a jump float it above their
 * own furniture rather than letting it push controls down the page.
 */
export function PandaAside({
  reaction = "idle",
  message,
  className,
}: {
  reaction?: PandaReaction;
  message?: string;
  className?: string;
}) {
  return (
    // Never intercepts a tap: while Panda is talking, the controls underneath
    // stay live.
    <div className={cn("pointer-events-none", className)}>
      {message && (
        <div className="panda-bubble-in flex items-start gap-2.5">
          <PandaMascot reaction={reaction} size="small" className="shrink-0" />

          <div className="relative flex-1 rounded-[var(--radius-card)] border border-line bg-surface py-2.5 pr-3.5 pl-4 shadow-warm">
            {/* Teal rail — the same accent the icon tiles use. */}
            <span
              className="absolute top-2.5 bottom-2.5 left-1.5 w-[3px] rounded-full bg-primary"
              aria-hidden
            />
            <p className="text-[13px] leading-snug text-ink">{message}</p>
            {/* Tail, pointing back at Panda. */}
            <span
              aria-hidden
              className="absolute top-5 -left-[5px] size-2.5 rotate-45 border-b border-l border-line bg-surface"
            />
          </div>

          <p role="status" aria-live="polite" className="sr-only">
            {message}
          </p>
        </div>
      )}
    </div>
  );
}
