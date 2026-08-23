import { cn } from "@/lib/cn";

/**
 * Panda's speech bubble.
 *
 * Positioned absolutely above the mascot so a message appearing or leaving
 * never moves the screen underneath it. Width is capped against the viewport,
 * not the container, so it still fits inside the page gutter at 320px.
 *
 * Two elements on purpose: the outer one owns the centring (Tailwind's
 * `-translate-x-1/2` sets the `translate` property) and the inner one owns the
 * entrance (`transform`). Put both on one element and the browser composes
 * them, which slides the bubble off the side of the screen.
 */
export function PandaSpeechBubble({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return (
    <div
      // The live region in PandaMascot announces the text; this is its picture.
      aria-hidden
      className={cn(
        "pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2",
        "w-max max-w-[min(20.5rem,calc(100vw-3rem))]",
        className,
      )}
    >
      <div className="panda-bubble-in relative">
        <div className="relative rounded-[var(--radius-card)] border border-line bg-surface py-2.5 pr-3.5 pl-4 shadow-warm">
          {/* Teal rail — the same accent the icon tiles use. */}
          <span
            className="absolute top-2.5 bottom-2.5 left-1.5 w-[3px] rounded-full bg-primary"
            aria-hidden
          />
          <p className="text-[13px] leading-snug text-balance text-ink">{message}</p>
        </div>

        {/* Tail: a rotated square borrowing the bubble's own border and fill. */}
        <span className="absolute -bottom-[5px] left-1/2 size-2.5 -translate-x-1/2 rotate-45 border-r border-b border-line bg-surface" />
      </div>
    </div>
  );
}
