"use client";

import Link from "next/link";
import { Compass, Home, Puzzle, TrendingUp, User } from "lucide-react";
import { cn } from "@/lib/cn";

/* ---------------------------------------------------------------------------
   Bottom navigation.

   Hidden during the diagnostic — that flow is deliberately one-way — and shown
   once the learner has a route to come back to.

   Route, Challenges and Progress exist. Home and Profile are drawn but inert
   rather than linked to empty screens: a tab that goes nowhere is worse than a
   tab that says "not yet".
--------------------------------------------------------------------------- */

const ITEMS = [
  { id: "home", label: "Home", icon: Home, href: null },
  { id: "route", label: "Route", icon: Compass, href: "/route" },
  { id: "challenges", label: "Challenges", icon: Puzzle, href: "/challenges" },
  { id: "progress", label: "Progress", icon: TrendingUp, href: "/milestone" },
  { id: "profile", label: "Profile", icon: User, href: null },
] as const;

export function BottomNav({ active }: { active: string }) {
  return (
    <nav
      aria-label="Main"
      className="sticky bottom-0 z-20 -mx-5 mt-4 border-t border-line bg-surface px-2 pt-1.5 pb-[max(env(safe-area-inset-bottom),0.375rem)]"
    >
      <ul className="flex items-stretch justify-between">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === active;
          const body = (
            <>
              <Icon className="size-5" aria-hidden />
              <span className="text-[10px] leading-none font-semibold">{item.label}</span>
            </>
          );

          return (
            <li key={item.id} className="flex-1">
              {item.href ? (
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 flex-col items-center justify-center gap-1 rounded-[var(--radius-tile)] py-1 transition-colors",
                    isActive ? "text-primary-ink" : "text-ink-faint hover:text-ink-muted",
                  )}
                >
                  {body}
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  title="Coming soon"
                  className="flex min-h-11 cursor-not-allowed flex-col items-center justify-center gap-1 py-1 text-ink-faint/55"
                >
                  {body}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
