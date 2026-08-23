"use client";

import { useSyncExternalStore } from "react";
import { QUESTIONS, TOTAL_QUESTIONS } from "@/lib/diagnostic/questions";

/* ---------------------------------------------------------------------------
   Diagnostic progress.

   Answers are written as they are chosen, so leaving at question seven and
   coming back resumes at question seven rather than starting again — the
   whole point of asking someone for fifteen minutes.

   Read through useSyncExternalStore for the same reason as the other stores:
   localStorage is external, and copying it into state inside an effect gives a
   flash of "nothing answered" on every mount.
--------------------------------------------------------------------------- */

export interface DiagnosticState {
  /** question id → option id */
  answers: Record<string, string>;
  /** Zero-based index of the furthest question reached. */
  cursor: number;
  completedAt: number | null;
}

const STORAGE_KEY = "pandaroute:diagnostic:v1";

const EMPTY: DiagnosticState = { answers: {}, cursor: 0, completedAt: null };

const listeners = new Set<() => void>();
let snapshot: DiagnosticState | null = null;

function available(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function read(): DiagnosticState {
  if (!available()) return EMPTY;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;

    const parsed = JSON.parse(raw) as Partial<DiagnosticState>;
    const answers =
      parsed.answers && typeof parsed.answers === "object" ? parsed.answers : {};
    const cursor = Number.isInteger(parsed.cursor)
      ? Math.min(Math.max(parsed.cursor as number, 0), TOTAL_QUESTIONS - 1)
      : 0;

    return {
      answers,
      cursor,
      completedAt: typeof parsed.completedAt === "number" ? parsed.completedAt : null,
    };
  } catch {
    return EMPTY;
  }
}

function write(next: DiagnosticState): void {
  snapshot = next;

  try {
    if (available()) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // A blocked store must not take the diagnostic down with it.
  }

  listeners.forEach((listener) => listener());
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function getSnapshot(): DiagnosticState {
  snapshot ??= read();
  return snapshot;
}

function getServerSnapshot(): DiagnosticState {
  return EMPTY;
}

export function answerQuestion(questionId: string, optionId: string, index: number): void {
  const current = getSnapshot();
  write({
    ...current,
    answers: { ...current.answers, [questionId]: optionId },
    cursor: Math.max(current.cursor, index),
  });
}

export function markCursor(index: number): void {
  const current = getSnapshot();
  if (current.cursor >= index) return;
  write({ ...current, cursor: index });
}

export function completeDiagnostic(): void {
  write({ ...getSnapshot(), completedAt: Date.now() });
}

export function resetDiagnostic(): void {
  write(EMPTY);
}

export function useDiagnostic(): DiagnosticState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** How many questions carry an answer — what the progress bar counts. */
export function answeredCount(state: DiagnosticState): number {
  return Object.keys(state.answers).length;
}

/**
 * Where "continue" should land: the first scenario without an answer. Someone
 * who stopped at seven comes back to seven, not to the six they finished.
 */
export function resumeIndex(state: DiagnosticState): number {
  const unanswered = QUESTIONS.findIndex((question) => !state.answers[question.id]);
  return unanswered === -1 ? TOTAL_QUESTIONS - 1 : unanswered;
}
