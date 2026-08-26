"use client";

import { useEffect } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/cn";

/* ---------------------------------------------------------------------------
   Editing one preference at a time — the same bottom-sheet contract as the
   Gap Map's skill detail (body-scroll lock, Escape, backdrop tap).
--------------------------------------------------------------------------- */

export function PreferenceEditSheet({
  label,
  options,
  current,
  onSelect,
  onClose,
}: {
  label: string;
  options: readonly string[];
  current: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-ink/35" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className="quest-rise relative w-full max-w-[430px] rounded-t-[24px] border border-line bg-surface p-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] shadow-warm-lg"
      >
        <span aria-hidden className="mx-auto block h-1 w-10 rounded-full bg-line" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-sunk hover:text-ink"
        >
          <X className="size-4.5" aria-hidden />
        </button>

        <h2 className="mt-3 text-[18px] leading-tight font-extrabold">{label}</h2>

        <ul className="mt-3 flex flex-col gap-1.5">
          {options.map((option) => {
            const isOn = option === current;
            return (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(option);
                    onClose();
                  }}
                  className={cn(
                    "flex min-h-12 w-full items-center justify-between rounded-[14px] border px-3.5 text-[14.5px] font-semibold transition-colors",
                    isOn
                      ? "border-primary-strong bg-primary-soft text-ink"
                      : "border-line bg-canvas text-ink-muted hover:bg-sunk/60",
                  )}
                >
                  {option}
                  {isOn && <Check className="size-4 text-primary-strong" aria-hidden />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
