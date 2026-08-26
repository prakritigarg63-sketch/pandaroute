"use client";

import { useSyncExternalStore } from "react";

/* ---------------------------------------------------------------------------
   Profile identity — name and email, and nothing else.

   There's no real account system anywhere in this app (see lib/auth/*): no
   session, no Google OAuth actually wired, no server. The one real capture
   point is the signup form, so that's the only place this gets written.
   Everyone else — someone who only ever used /login's simulated sign-in, or
   never signed up at all — reads back empty and the Profile page falls back
   to "Pathfinder", the term this app already uses for an unnamed learner,
   rather than a fabricated name.
--------------------------------------------------------------------------- */

export interface ProfileIdentity {
  name: string;
  email: string;
}

const STORAGE_KEY = "pandaroute:profile:v1";
const EMPTY: ProfileIdentity = { name: "", email: "" };

const listeners = new Set<() => void>();
let snapshot: ProfileIdentity | null = null;

function available(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function read(): ProfileIdentity {
  if (!available()) return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<ProfileIdentity>;
    return {
      name: typeof parsed.name === "string" ? parsed.name : "",
      email: typeof parsed.email === "string" ? parsed.email : "",
    };
  } catch {
    return EMPTY;
  }
}

function write(next: ProfileIdentity): void {
  snapshot = next;
  try {
    if (available()) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // A blocked store must not take the page down with it.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function getSnapshot(): ProfileIdentity {
  snapshot ??= read();
  return snapshot;
}

function getServerSnapshot(): ProfileIdentity {
  return EMPTY;
}

/** Called once, by signup — the only screen that actually collects a name. */
export function saveProfileIdentity(identity: ProfileIdentity): void {
  write(identity);
}

/** Sign-out clears identity only — never diagnostic, loop or career progress. */
export function clearProfileIdentity(): void {
  write(EMPTY);
}

export function useProfileIdentity(): ProfileIdentity {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
