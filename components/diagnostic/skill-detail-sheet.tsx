"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { CLASSIFICATION_LABEL, reasonFor, type Capability } from "@/lib/diagnostic/capabilities";

/* ---------------------------------------------------------------------------
   The skill-chip detail sheet.

   Reuses the same open/close contract as the site header's mobile menu
   (body-scroll lock, Escape, outside tap) — the one bottom-sheet-shaped
   interaction already proven in this app, rather than a second pattern.

   The "why" is `reasonFor` — the same capability-specific sentence the Gap
   Map's own row and the capability-detail page already show. No new copy is
   invented for this sheet; a capability with no real evidence in the
   diagnostic gets no fabricated evidence here either.
--------------------------------------------------------------------------- */

export function SkillDetailSheet({
  capability,
  onClose,
}: {
  capability: Capability;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

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
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-ink/35"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={capability.name}
        className="quest-rise relative w-full max-w-[430px] rounded-t-[24px] border border-line bg-surface p-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] shadow-warm-lg"
      >
        <span
          aria-hidden
          className="mx-auto block h-1 w-10 rounded-full bg-line"
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-sunk hover:text-ink"
        >
          <X className="size-4.5" aria-hidden />
        </button>

        <h2 className="mt-3 text-[19px] leading-tight font-extrabold text-balance">
          {capability.name}
        </h2>

        <span className="mt-2 inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-skip-soft px-2.5 py-1 text-[11px] font-bold text-skip">
          <Check className="size-3.5" aria-hidden />
          {CLASSIFICATION_LABEL.skip}
        </span>

        <p className="mt-3 text-[11px] font-extrabold tracking-[0.1em] text-ink-faint uppercase">
          Why PandaRoute marked this as demonstrated
        </p>
        <p className="mt-1.5 text-[14px] leading-relaxed text-ink-muted">
          {reasonFor(capability, "skip")}
        </p>

        <Link
          href="/route/advanced"
          onClick={onClose}
          className="mt-4 flex min-h-12 w-full items-center justify-center rounded-[var(--radius-pill)] border border-line bg-canvas text-[14px] font-bold text-ink transition-colors hover:bg-sunk/60"
        >
          Try an advanced challenge →
        </Link>
      </div>
    </div>
  );
}
