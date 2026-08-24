"use client";

import { useSyncExternalStore } from "react";

/**
 * `prefers-reduced-motion`, read once and kept live.
 *
 * `matchMedia` is an external source of truth the same way `localStorage` is
 * for the rest of this app's `use-*` hooks, so it goes through
 * `useSyncExternalStore` rather than a `useState` + `useEffect` pair — that
 * avoids the extra render an effect-driven `setState` would cost on mount, and
 * matches how every other external-value hook in this codebase is written.
 */

function subscribe(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useReducedMotionPreference(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
