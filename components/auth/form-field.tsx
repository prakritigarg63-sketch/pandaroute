"use client";

import { forwardRef, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/cn";

/* ---------------------------------------------------------------------------
   A labelled, icon-led input shared by the two login fields.

   The password field's visibility toggle lives here rather than in the form,
   since it is purely a property of how *this one input* renders its own
   value — the form never needs to know whether the text is currently masked.
--------------------------------------------------------------------------- */

export const FormField = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
    error?: string;
    /** Renders a show/hide toggle and switches the input's own type. */
    revealable?: boolean;
  }
>(function FormField(
  { label, icon: Icon, error, revealable, id, type = "text", className, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const [revealed, setRevealed] = useState(false);

  return (
    <div className={className}>
      <label htmlFor={inputId} className="block text-[14px] font-bold text-ink">
        {label}
      </label>

      <div className="relative mt-1.5">
        <Icon
          className={cn(
            "pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2",
            error ? "text-error" : "text-primary-strong",
          )}
          aria-hidden
        />

        <input
          ref={ref}
          id={inputId}
          type={revealable ? (revealed ? "text" : "password") : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "min-h-14 w-full rounded-[19px] border bg-surface/75 pr-4 pl-12 text-[16px] text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink-faint",
            revealable && "pr-12",
            error
              ? "border-error focus:border-error focus:shadow-[0_0_0_3px_rgba(200,90,74,0.12)]"
              : "border-line focus:border-primary-strong focus:shadow-[0_0_0_3px_rgba(245,154,0,0.10)]",
          )}
          {...rest}
        />

        {revealable && (
          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            aria-label={revealed ? "Hide password" : "Show password"}
            aria-pressed={revealed}
            className="absolute top-1/2 right-2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-ink"
          >
            {revealed ? <EyeOff className="size-[18px]" aria-hidden /> : <Eye className="size-[18px]" aria-hidden />}
          </button>
        )}
      </div>

      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-[12.5px] font-semibold text-error">
          {error}
        </p>
      )}
    </div>
  );
});
