"use client";

import { useSyncExternalStore } from "react";
import {
  EMPTY_PROFILE,
  loadTransitionProfile,
  saveTransitionProfile,
  type TransitionProfile,
} from "@/lib/transition-profile";

/* ---------------------------------------------------------------------------
   The saved transition profile, as a React store.

   localStorage is an external store, so it is read through
   useSyncExternalStore rather than copied into state inside an effect: the
   server snapshot is the empty profile, the client snapshot is whatever was
   saved, and React reconciles the two after hydration without a flash of
   "nothing selected" that outlives a frame.
--------------------------------------------------------------------------- */

const listeners = new Set<() => void>();

/** Cached so getSnapshot returns a stable reference between renders. */
let snapshot: TransitionProfile | null = null;

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function getSnapshot(): TransitionProfile {
  snapshot ??= loadTransitionProfile();
  return snapshot;
}

function getServerSnapshot(): TransitionProfile {
  return EMPTY_PROFILE;
}

function setProfile(next: TransitionProfile): void {
  snapshot = next;
  saveTransitionProfile(next);
  listeners.forEach((listener) => listener());
}

export function useTransitionProfile(): [
  TransitionProfile,
  (next: TransitionProfile) => void,
] {
  const profile = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return [profile, setProfile];
}
