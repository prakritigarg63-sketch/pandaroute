import { cn } from "@/lib/cn";
import { JOURNEY_MILESTONES } from "@/lib/landing/content";

/* ---------------------------------------------------------------------------
   The four-stop journey under the hero ("How it works").

   Desktop: four stops in a row joined by a gently curved dotted amber path.
   Mobile: the same stops as a short vertical list on a dotted spine, so the
   path survives the narrow screen without any sideways scrolling.

   The first stop is highlighted because it is where every visitor stands:
   the diagnostic is step one.
--------------------------------------------------------------------------- */

// Through the four stop centres (12.5%, 37.5%, 62.5%, 87.5% of the width),
// dipping and rising between them like the reference.
const DESKTOP_PATH = "M125 28 C 200 8, 300 48, 375 28 S 550 8, 625 28 S 800 48, 875 28";

export function JourneySection() {
  return (
    <section id="how-it-works" aria-labelledby="journey-title" className="scroll-mt-20 bg-cream">
      <div className="mx-auto w-full max-w-6xl px-5 pt-4 pb-14 lg:px-8 lg:pt-2 lg:pb-20">
        <h2 id="journey-title" className="sr-only">
          How it works
        </h2>

        <div className="relative">
          <svg
            aria-hidden
            viewBox="0 0 1000 56"
            preserveAspectRatio="none"
            className="absolute inset-x-0 top-0 hidden h-14 w-full lg:block"
          >
            <path
              d={DESKTOP_PATH}
              fill="none"
              stroke="var(--color-quest)"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeDasharray="0.1 9"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Mobile spine, behind the stop circles. */}
          <span
            aria-hidden
            className="absolute top-6 bottom-6 left-6 border-l-[2.5px] border-dotted border-quest lg:hidden"
          />

          <ol className="relative flex flex-col gap-4 lg:grid lg:grid-cols-4 lg:gap-6">
            {JOURNEY_MILESTONES.map((milestone, index) => {
              const current = index === 0;
              return (
                <li
                  key={milestone.id}
                  aria-current={current ? "step" : undefined}
                  className="flex items-center gap-4 lg:flex-col lg:gap-0 lg:text-center"
                >
                  <span className="relative grid size-12 shrink-0 place-items-center lg:size-14">
                    {current && <SunRays />}
                    <span
                      className={cn(
                        "relative grid size-12 place-items-center rounded-full font-display text-[18px] font-extrabold lg:size-14 lg:text-[21px]",
                        current
                          ? "bg-quest text-navy shadow-[0_3px_0_var(--color-quest-deep)]"
                          : "border-2 border-primary-fill bg-primary-soft text-navy",
                      )}
                    >
                      {index + 1}
                    </span>
                  </span>

                  <span className="flex flex-col lg:mt-3">
                    <span className="font-display text-[17px] leading-tight font-extrabold text-navy lg:text-[20px]">
                      {milestone.label}
                    </span>
                    <span className="mt-0.5 text-[14px] leading-snug text-ink-muted lg:mt-1 lg:text-[16px]">
                      {milestone.detail}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** Five short strokes fanned above the current stop, like a small sunrise. */
function SunRays() {
  return (
    <svg
      aria-hidden
      viewBox="-40 -40 80 80"
      className="absolute -inset-3 size-[calc(100%+1.5rem)] overflow-visible text-quest"
    >
      {[-150, -115, -90, -65, -30].map((angle) => (
        <line
          key={angle}
          x1={0}
          y1={-31}
          x2={0}
          y2={-38}
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          transform={`rotate(${angle + 90})`}
        />
      ))}
    </svg>
  );
}
