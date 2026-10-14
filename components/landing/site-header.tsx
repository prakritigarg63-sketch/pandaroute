"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Compass } from "lucide-react";
import { cn } from "@/lib/cn";

/* ---------------------------------------------------------------------------
   Home's header: the logo, "How it works" and "Sign in" — nothing else.
   Starting the diagnostic is the hero's job; a second Start button up here
   would split attention with it.

   `withAppNav`: a returning learner also has the app nav, which becomes a
   sidebar carrying its own logo on desktop, so the header drops its copy
   there rather than show the brand twice.
--------------------------------------------------------------------------- */

export function SiteHeader({ withAppNav }: { withAppNav: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300",
        scrolled
          ? "border-b border-line bg-cream/90 shadow-warm backdrop-blur-md"
          : "border-b border-transparent bg-cream",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-5 lg:h-20 lg:px-8">
        <Link
          href="/home"
          className={cn(
            "-ml-1 flex min-h-11 items-center gap-2.5 rounded-[var(--radius-tile)] px-1",
            withAppNav && "lg:hidden",
          )}
        >
          <span className="grid size-9 place-items-center rounded-full bg-primary-soft text-quest-deep lg:size-11">
            <Compass className="size-5 lg:size-6" aria-hidden />
          </span>
          <span className="font-display text-[18px] font-extrabold tracking-tight text-navy lg:text-[22px]">
            PandaRoute
          </span>
        </Link>

        <nav aria-label="Site" className="ml-auto flex items-center gap-1 sm:gap-4">
          <a
            href="#how-it-works"
            className="hidden min-h-11 items-center rounded-[var(--radius-pill)] px-3 text-[15px] font-semibold text-navy transition-colors hover:bg-primary-soft min-[400px]:inline-flex lg:text-[16px]"
          >
            How it works
          </a>
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center rounded-[var(--radius-pill)] border-2 border-quest/60 px-5 text-[15px] font-bold text-quest-deep transition-colors hover:border-quest hover:bg-primary-soft lg:min-h-12 lg:px-7 lg:text-[16px]"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
