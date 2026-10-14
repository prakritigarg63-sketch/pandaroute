"use client";

import Image from "next/image";
import Link from "next/link";
import { Compass, Home, Puzzle, TrendingUp, User } from "lucide-react";
import { cn } from "@/lib/cn";

/* ---------------------------------------------------------------------------
   Bottom navigation.

   Hidden during the diagnostic — that flow is deliberately one-way — and shown
   once the learner has a route to come back to.

   All five tabs are real routes now.
--------------------------------------------------------------------------- */

const ITEMS = [
  { id: "home", label: "Home", icon: Home, href: "/home" },
  { id: "route", label: "Route", icon: Compass, href: "/route" },
  { id: "challenges", label: "Challenges", icon: Puzzle, href: "/challenges" },
  { id: "progress", label: "Progress", icon: TrendingUp, href: "/milestone" },
  { id: "profile", label: "Profile", icon: User, href: "/profile" },
] as const;

export function BottomNav({ active }: { active: string }) {
  return (
    // On desktop (lg) the same nav becomes a fixed left sidebar. `data-app-nav`
    // is what globals.css keys the page offset and wider column off, so any
    // screen that renders this nav gets the desktop shell with no change of
    // its own.
    <nav
      aria-label="Main"
      data-app-nav=""
      className="sticky bottom-0 z-20 -mx-5 mt-4 border-t border-line bg-surface px-2 pt-1.5 pb-[max(env(safe-area-inset-bottom),0.375rem)] lg:fixed lg:inset-y-0 lg:left-0 lg:m-0 lg:flex lg:w-56 lg:flex-col lg:border-t-0 lg:border-r lg:px-3 lg:pt-5 lg:pb-5"
    >
      <Link
        href="/home"
        className="mb-6 hidden items-center gap-2.5 px-3 lg:flex"
      >
        <Image src="/panda-logo.png" alt="" width={32} height={32} className="rounded-[var(--radius-tile)] bg-primary-soft" />
        <span className="font-display text-[17px] font-extrabold tracking-tight text-ink">PandaRoute</span>
      </Link>

      <ul className="flex items-stretch justify-between lg:flex-col lg:justify-start lg:gap-1">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === active;
          const body = (
            <>
              <Icon className="size-5" aria-hidden />
              <span className="text-[10px] leading-none font-semibold lg:text-[14px]">{item.label}</span>
            </>
          );

          return (
            <li key={item.id} className="flex-1 lg:flex-none">
              {item.href ? (
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={(event) => {
                    // Already on Home: scroll to top instead of a no-op
                    // navigation to the page already showing.
                    if (item.id !== "home" || !isActive) return;
                    event.preventDefault();
                    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
                  }}
                  className={cn(
                    "flex min-h-11 flex-col items-center justify-center gap-1 rounded-[var(--radius-tile)] py-1 transition-colors lg:flex-row lg:justify-start lg:gap-3 lg:px-3",
                    isActive
                      ? "text-primary-ink lg:bg-primary-soft"
                      : "text-ink-faint hover:text-ink-muted lg:hover:bg-sunk/60",
                  )}
                >
                  {body}
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  title="Coming soon"
                  className="flex min-h-11 cursor-not-allowed flex-col items-center justify-center gap-1 py-1 text-ink-faint/55 lg:flex-row lg:justify-start lg:gap-3 lg:px-3"
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
