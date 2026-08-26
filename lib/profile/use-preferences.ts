"use client";

import { useSyncExternalStore } from "react";

/* ---------------------------------------------------------------------------
   Learning preferences — prototype-local, by design.

   No backend exists to sync these to, so they live in localStorage the same
   way every other piece of state in this app does. Structured as a plain
   key/value record so a real persistence layer could take over the read/write
   functions here without the UI changing.
--------------------------------------------------------------------------- */

export type SessionLength = "5-10 min" | "10-15 min" | "15-30 min" | "30+ min";
export type Difficulty = "Adaptive" | "Comfortable" | "Challenging";
export type LearningStyle = "Practice first" | "Learn then practice" | "Balanced";
export type DailyGoal = "1 challenge" | "2 challenges" | "3 challenges" | "Custom";

export interface LearningPreferences {
  sessionLength: SessionLength;
  difficulty: Difficulty;
  learningStyle: LearningStyle;
  dailyGoal: DailyGoal;
  reminders: boolean;
}

const STORAGE_KEY = "pandaroute:preferences:v1";

const DEFAULT: LearningPreferences = {
  sessionLength: "10-15 min",
  difficulty: "Adaptive",
  learningStyle: "Practice first",
  dailyGoal: "1 challenge",
  reminders: true,
};

const listeners = new Set<() => void>();
let snapshot: LearningPreferences | null = null;

function available(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function read(): LearningPreferences {
  if (!available()) return DEFAULT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...(JSON.parse(raw) as Partial<LearningPreferences>) };
  } catch {
    return DEFAULT;
  }
}

function write(next: LearningPreferences): void {
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

function getSnapshot(): LearningPreferences {
  snapshot ??= read();
  return snapshot;
}

function getServerSnapshot(): LearningPreferences {
  return DEFAULT;
}

export function setPreference<K extends keyof LearningPreferences>(
  key: K,
  value: LearningPreferences[K],
): void {
  write({ ...getSnapshot(), [key]: value });
}

export function usePreferences(): LearningPreferences {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
