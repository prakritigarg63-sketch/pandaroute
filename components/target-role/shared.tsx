import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/cn";
import { Progress } from "@/components/ui/Progress";
import type { EvidenceStatus, Importance } from "@/lib/target-role/data";

/* ---------------------------------------------------------------------------
   Small pieces shared across the target-role screens: the focused-screen back
   bar, and the visual language for the three evidence states. Green/Amber/Red
   here mean exactly what they mean everywhere else in Pandaroute — proven,
   developing, not yet — reused rather than reinvented for this one feature.
--------------------------------------------------------------------------- */

export function RoleBackBar({ href, label }: { href: string; label?: string }) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={href}
        aria-label="Back"
        className="-ml-2 flex size-11 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-ink"
      >
        <ChevronLeft className="size-5" aria-hidden />
      </Link>
      {label && (
        <span className="text-[11px] font-bold tracking-[0.12em] text-ink-faint uppercase">
          {label}
        </span>
      )}
    </div>
  );
}

/** The two-step "Role Prep" challenge header, shared by its intro and decision
 *  screens so the progress bar reads as one continuous strip across both. */
export function RoleChallengeHeader({ href }: { href: string }) {
  return (
    <div>
      <RoleBackBar href={href} />
      <p className="mt-1 text-[11px] font-bold tracking-[0.12em] text-ink-faint uppercase">
        Role prep · Challenge 1 of 2
      </p>
      <Progress value={1} max={2} label="Role prep, challenge 1 of 2" className="mt-1.5" />
    </div>
  );
}

export const STATUS_STYLE: Record<
  EvidenceStatus,
  { border: string; bg: string; text: string; label: string }
> = {
  proven: {
    border: "border-success/30",
    bg: "bg-skip-soft",
    text: "text-success",
    label: "Proven",
  },
  developing: {
    border: "border-primary-strong/30",
    bg: "bg-primary-soft",
    text: "text-primary-ink",
    label: "Developing",
  },
  "not-proven": {
    border: "border-error/25",
    bg: "bg-error-soft",
    text: "text-error",
    label: "Not yet proven",
  },
};

export const IMPORTANCE_LABEL: Record<Importance, string> = {
  important: "Important",
  useful: "Useful",
};

export function ImportanceBadge({ importance }: { importance: Importance }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-[var(--radius-pill)] px-2 py-0.5 text-[10px] font-bold tracking-[0.06em] uppercase",
        importance === "important"
          ? "bg-primary-fill text-primary-ink"
          : "bg-sunk text-ink-muted",
      )}
    >
      {IMPORTANCE_LABEL[importance]}
    </span>
  );
}
