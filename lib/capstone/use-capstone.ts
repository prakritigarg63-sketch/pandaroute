"use client";

import { useSyncExternalStore } from "react";

/* ---------------------------------------------------------------------------
   Capstone progress.

   Written on every change rather than on submit: the capstone is five screens
   of a learner's own thinking, and losing it because a phone call arrived would
   be unforgivable.
--------------------------------------------------------------------------- */

export interface CapstoneState {
  started: boolean;
  currentStep: number;

  selectedSignals: string[];

  investigationReasoning: string;
  unknownQuestions: string;

  problemFraming: string;
  supportingEvidence: string;

  problemStatement: string;

  ideas: string[];
  prioritizedIdea: string;
  prioritizationReasoning: string;

  primaryMetric: string;
  metricReasoning: string;
  guardrailMetric: string;
  decisionCriteria: string;

  completed: boolean;
}

const STORAGE_KEY = "pandaroute:capstone:v1";

export const EMPTY_CAPSTONE: CapstoneState = {
  started: false,
  currentStep: 1,
  selectedSignals: [],
  investigationReasoning: "",
  unknownQuestions: "",
  problemFraming: "",
  supportingEvidence: "",
  problemStatement: "",
  ideas: ["", "", ""],
  prioritizedIdea: "",
  prioritizationReasoning: "",
  primaryMetric: "",
  metricReasoning: "",
  guardrailMetric: "",
  decisionCriteria: "",
  completed: false,
};

const listeners = new Set<() => void>();
let snapshot: CapstoneState | null = null;

function available(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function read(): CapstoneState {
  if (!available()) return EMPTY_CAPSTONE;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_CAPSTONE;

    const parsed = JSON.parse(raw) as Partial<CapstoneState>;
    return {
      ...EMPTY_CAPSTONE,
      ...parsed,
      selectedSignals: Array.isArray(parsed.selectedSignals) ? parsed.selectedSignals : [],
      ideas: Array.isArray(parsed.ideas) ? parsed.ideas : ["", "", ""],
    };
  } catch {
    return EMPTY_CAPSTONE;
  }
}

function write(next: CapstoneState): void {
  snapshot = next;

  try {
    if (available()) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // A blocked store must not take the capstone down with it.
  }

  listeners.forEach((listener) => listener());
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function getSnapshot(): CapstoneState {
  snapshot ??= read();
  return snapshot;
}

function getServerSnapshot(): CapstoneState {
  return EMPTY_CAPSTONE;
}

export function patchCapstone(patch: Partial<CapstoneState>): void {
  write({ ...getSnapshot(), ...patch });
}

export function startCapstone(): void {
  patchCapstone({ started: true });
}

export function finishCapstone(): void {
  patchCapstone({ completed: true, currentStep: 5 });
}

export function resetCapstone(): void {
  write(EMPTY_CAPSTONE);
}

export function useCapstone(): CapstoneState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** A step counts as answered when its own fields carry something. */
export function stepComplete(state: CapstoneState, step: number): boolean {
  const filled = (text: string, words = 8) =>
    text.trim().split(/\s+/).filter(Boolean).length >= words;

  switch (step) {
    case 1:
      return (
        state.selectedSignals.length > 0 &&
        filled(state.investigationReasoning) &&
        filled(state.unknownQuestions, 5)
      );
    case 2:
      return filled(state.problemFraming) && filled(state.supportingEvidence);
    case 3:
      return filled(state.problemStatement, 10);
    case 4:
      return (
        state.ideas.filter((idea) => idea.trim().length > 0).length >= 2 &&
        state.prioritizedIdea !== "" &&
        filled(state.prioritizationReasoning)
      );
    case 5:
      return (
        state.primaryMetric !== "" &&
        filled(state.metricReasoning) &&
        state.guardrailMetric.trim().length > 0 &&
        filled(state.decisionCriteria)
      );
    default:
      return false;
  }
}
