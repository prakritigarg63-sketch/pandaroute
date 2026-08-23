"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * A single-choice chip group.
 *
 * Selection is carried by border, fill and a tick — never by colour alone —
 * and every chip clears a 44px tap target.
 */
export function ChoiceChips<T extends string>({
  name,
  options,
  value,
  onChange,
  className,
}: {
  /** Accessible name for the group, e.g. the question above it. */
  name: string;
  options: Array<{ id: T; label: string }>;
  value: T | null;
  onChange: (id: T) => void;
  className?: string;
}) {
  return (
    <div role="group" aria-label={name} className={cn("grid grid-cols-2 gap-2", className)}>
      {options.map((option) => {
        const selected = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.id)}
            className={cn(
              "flex min-h-11 items-center justify-center gap-1.5 rounded-[var(--radius-tile)]",
              "border px-3 text-[14px] leading-tight font-semibold transition-colors",
              selected
                ? "border-primary-strong bg-primary-fill text-ink"
                : "border-line bg-surface text-ink hover:bg-sunk/60",
            )}
          >
            {selected && (
              <Check className="size-4 shrink-0 text-primary-strong" aria-hidden />
            )}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
