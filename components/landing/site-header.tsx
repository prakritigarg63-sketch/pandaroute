"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Compass, Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { NAV_LINKS } from "@/lib/landing/content";
import type { HomeCtaPhase } from "@/lib/landing/use-home-cta";

const MENU_CTA_LABEL: Record<HomeCtaPhase, string> = {
  new: "Start diagnostic",
  resume: "Continue diagnostic",
  return: "Continue my journey",
};

/* ---------------------------------------------------------------------------
   Header, scroll-progress rail and the mobile menu it opens.

   Three things that share one piece of state (is the header "scrolled") live
   in one file rather than three, since the progress rail's position depends on
   the header's own height and border.
--------------------------------------------------------------------------- */

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 300, damping: 40, mass: 0.3 });
  // Hidden at the very top rather than a 3px sliver sitting at zero width.
  const opacity = useTransform(scrollYProgress, [0, 0.01], [0, 1]);

  return (
    <motion.div
      aria-hidden
      className="fixed top-[56px] right-0 left-0 z-40 h-[3px] origin-left bg-primary"
      style={{ scaleX: width, opacity }}
    />
  );
}

export function SiteHeader({
  onStart,
  starting,
  phase,
}: {
  onStart: () => void;
  starting: boolean;
  phase: HomeCtaPhase;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuId = "site-menu";
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Locks page scroll while open, closes on Escape or an outside tap.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !toggleRef.current?.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const selectLink = useCallback(() => setOpen(false), []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300",
          scrolled
            ? "border-b border-line bg-canvas/85 shadow-warm backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-14 w-full max-w-[430px] items-center gap-2 px-5">
          <motion.div
            className="flex min-w-0 items-center gap-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-[var(--radius-tile)] bg-primary-soft text-primary-ink">
              <Compass className="size-4.5" aria-hidden />
            </span>
            <motion.span
              className="truncate font-display text-[16px] font-extrabold tracking-tight"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              PandaRoute
            </motion.span>
          </motion.div>

          <button
            type="button"
            onClick={onStart}
            disabled={starting}
            aria-busy={starting}
            className="ml-auto hidden min-h-9 shrink-0 items-center rounded-[var(--radius-pill)] bg-primary px-3 text-[13px] font-bold text-ink disabled:opacity-60 [@media(min-width:380px)]:inline-flex"
          >
            {starting ? "…" : "Start"}
          </button>

          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
            className="ml-2 flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-tile)] text-ink transition-colors hover:bg-sunk"
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>

        {open && (
          <div
            id={menuId}
            ref={panelRef}
            role="menu"
            className="quest-rise mx-4 mb-3 overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-warm-lg"
            style={{ "--delay": "0ms" } as React.CSSProperties}
          >
            <ul className="flex flex-col p-1.5">
              {NAV_LINKS.map((link) => (
                <li key={link.id} role="none">
                  <a
                    role="menuitem"
                    href={link.href}
                    onClick={selectLink}
                    className="flex min-h-11 items-center rounded-[var(--radius-tile)] px-3 text-[15px] font-semibold text-ink transition-colors hover:bg-sunk"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li role="none">
                <a
                  role="menuitem"
                  href="#"
                  onClick={selectLink}
                  className="flex min-h-11 items-center rounded-[var(--radius-tile)] px-3 text-[15px] font-semibold text-ink-muted transition-colors hover:bg-sunk"
                >
                  Sign in
                </a>
              </li>
            </ul>

            <div className="p-2 pt-0">
              <button
                type="button"
                onClick={() => {
                  selectLink();
                  onStart();
                }}
                disabled={starting}
                aria-busy={starting}
                className="flex min-h-12 w-full items-center justify-center rounded-[var(--radius-pill)] bg-primary text-[15px] font-extrabold text-ink disabled:opacity-60"
              >
                {starting ? "Preparing your route…" : MENU_CTA_LABEL[phase]}
              </button>
            </div>
          </div>
        )}
      </header>

      <ScrollProgressBar />
    </>
  );
}
