"use client";

import { useSyncExternalStore } from "react";

/* ---------------------------------------------------------------------------
   Diagnostic introduction state.

   Session-scoped on purpose: a learner who opened the explanation and came
   back should not have to open it again, but a fresh session starts with the
   short version of the screen.
--------------------------------------------------------------------------- */

export interface DiagnosticIntroState {
  explanationExpanded: boolean;
  diagnosticStarted: boolean;
}

const STORAGE_KEY = "pandaroute:diagnostic-intro:v1";

const EMPTY: DiagnosticIntroState = {
  explanationExpanded: false,
  diagnosticStarted: false,
};

const listeners = new Set<() => void>();

/** Cached so getSnapshot returns a stable reference between renders. */
let snapshot: DiagnosticIntroState | null = null;

function available(): boolean {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

function read(): DiagnosticIntroState {
  if (!available()) return EMPTY;

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;

    const parsed = JSON.parse(raw) as Partial<DiagnosticIntroState>;
    return {
      explanationExpanded: parsed.explanationExpanded === true,
      diagnosticStarted: parsed.diagnosticStarted === true,
    };
  } catch {
    return EMPTY;
  }
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function getSnapshot(): DiagnosticIntroState {
  snapshot ??= read();
  return snapshot;
}

function getServerSnapshot(): DiagnosticIntroState {
  return EMPTY;
}

function setState(next: DiagnosticIntroState): void {
  snapshot = next;

  try {
    if (available()) window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // A blocked store must not take the screen down with it.
  }

  listeners.forEach((listener) => listener());
}

export function useDiagnosticIntroState(): [
  DiagnosticIntroState,
  (patch: Partial<DiagnosticIntroState>) => void,
] {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return [state, (patch) => setState({ ...getSnapshot(), ...patch })];
}
