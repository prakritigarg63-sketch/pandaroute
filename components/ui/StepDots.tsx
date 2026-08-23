import { cn } from "@/lib/cn";

/**
 * Step indicator for a short flow. Dots rather than a bar: at two or three
 * steps a bar reads as "loading", while dots read as "how far along am I".
 */
export function StepDots({
  value,
  max,
  label,
  className,
}: {
  value: number;
  max: number;
  /** Accessible name. Required — bare dots tell a screen reader nothing. */
  label: string;
  className?: string;
}) {
  const safeMax = Math.max(1, max);

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-label={label}
      className={cn("flex items-center justify-center gap-1.5", className)}
    >
      {Array.from({ length: safeMax }, (_, i) => (
        <span
          key={i}
          aria-hidden
          className={cn(
            "size-1.5 rounded-full transition-colors",
            i < value ? "bg-primary" : "bg-line",
          )}
        />
      ))}
    </div>
  );
}
