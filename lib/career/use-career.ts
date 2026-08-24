"use client";

import { useSyncExternalStore } from "react";
import type { InterviewPractice, PortfolioCase } from "@/lib/career/portfolio";

/* ---------------------------------------------------------------------------
   The career kit's own state.

   Only the learner's edits and their interview answers live here — the case
   itself is derived from the capstone every time, so the two can never drift.
--------------------------------------------------------------------------- */

export interface CareerState {
  /** Portfolio edits layered over the derived case. */
  caseEdits: Partial<PortfolioCase>;
  caseStatus: "none" | "draft" | "ready";
  interview: InterviewPractice | null;
}

const STORAGE_KEY = "pandaroute:career:v1";

const EMPTY: CareerState = { caseEdits: {}, caseStatus: "none", interview: null };

const listeners = new Set<() => void>();
let snapshot: CareerState | null = null;

function available(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function read(): CareerState {
  if (!available()) return EMPTY;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;

    const parsed = JSON.parse(raw) as Partial<CareerState>;
    return {
      caseEdits: parsed.caseEdits ?? {},
      caseStatus: parsed.caseStatus ?? "none",
      interview: parsed.interview ?? null,
    };
  } catch {
    return EMPTY;
  }
}

function write(next: CareerState): void {
  snapshot = next;

  try {
    if (available()) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // A blocked store must not take the career kit down with it.
  }

  listeners.forEach((listener) => listener());
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function getSnapshot(): CareerState {
  snapshot ??= read();
  return snapshot;
}

function getServerSnapshot(): CareerState {
  return EMPTY;
}

export function editCase(patch: Partial<PortfolioCase>): void {
  const current = getSnapshot();
  write({
    ...current,
    caseEdits: { ...current.caseEdits, ...patch },
    caseStatus: current.caseStatus === "ready" ? "ready" : "draft",
  });
}

export function markCaseReady(): void {
  write({ ...getSnapshot(), caseStatus: "ready" });
}

export function saveInterview(patch: Partial<InterviewPractice>): void {
  const current = getSnapshot();
  const base: InterviewPractice = current.interview ?? {
    id: "interview-1",
    portfolioCaseId: "ai-activation-case",
    question: "",
    attempt1: "",
    demonstrated: [],
    strengthen: [],
    status: "started",
  };

  write({ ...current, interview: { ...base, ...patch } });
}

export function resetCareer(): void {
  write(EMPTY);
}

export function useCareer(): CareerState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Roughly two sentences — enough to have actually answered. */
export function longEnough(text: string, words = 25): boolean {
  return text.trim().split(/\s+/).filter(Boolean).length >= words;
}
