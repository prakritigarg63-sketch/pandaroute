import { cn } from "@/lib/cn";

export function Progress({
  value,
  max,
  label,
  className,
}: {
  value: number;
  max: number;
  /** Accessible name. Required — a bare bar tells a screen reader nothing. */
  label: string;
  className?: string;
}) {
  const safeMax = Math.max(1, max);
  const pct = Math.min(100, Math.max(0, (value / safeMax) * 100));

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-label={label}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-sunk", className)}
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
