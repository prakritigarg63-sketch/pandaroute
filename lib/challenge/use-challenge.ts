"use client";

import { useSyncExternalStore } from "react";
import { CORE_CAPABILITIES } from "@/lib/challenge/challenges";

/* ---------------------------------------------------------------------------
   Challenge progress and the capability profile.

   Two things live here: what happened in each challenge, and what the learner
   has proved. A verified capability outranks whatever the diagnostic decided,
   which is how the route updates the moment a challenge is finished.

   Progression is counted in things the learner did — challenges completed,
   gaps closed, capabilities verified, days active. No points, no currency.
--------------------------------------------------------------------------- */

export type ChallengeStatus =
  | "available"
  | "attempted"
  | "learning"
  | "retry"
  | "completed";

export type CapabilityStatus =
  | "learn"
  | "practice"
  | "skip"
  | "in-progress"
  | "developing"
  | "verified";

export interface ChallengeState {
  challengeId: string;
  status: ChallengeStatus;
  attempt1?: string;
  attempt2?: string;
  criteriaDemonstrated: number;
  criteriaTotal: number;
  /** Demonstrated criterion ids per attempt, for the improvement screen. */
  attempt1Criteria: string[];
  attempt2Criteria: string[];
}

export interface ProofItem {
  id: string;
  title: string;
  at: number;
}

export interface LoopState {
  challenges: Record<string, ChallengeState>;
  /** capabilityId → status, overriding the diagnostic classification. */
  capabilities: Record<string, CapabilityStatus>;
  /** ISO dates (yyyy-mm-dd) the learner did something. */
  activeDays: string[];
  /** Finished capstones, as things the learner can point at. */
  proofItems: ProofItem[];
}

const STORAGE_KEY = "pandaroute:loop:v1";

const EMPTY: LoopState = {
  challenges: {},
  capabilities: {},
  activeDays: [],
  proofItems: [],
};

const listeners = new Set<() => void>();
let snapshot: LoopState | null = null;

function available(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function read(): LoopState {
  if (!available()) return EMPTY;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;

    const parsed = JSON.parse(raw) as Partial<LoopState>;
    return {
      challenges: parsed.challenges ?? {},
      capabilities: parsed.capabilities ?? {},
      activeDays: Array.isArray(parsed.activeDays) ? parsed.activeDays : [],
      proofItems: Array.isArray(parsed.proofItems) ? parsed.proofItems : [],
    };
  } catch {
    return EMPTY;
  }
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function write(next: LoopState): void {
  const day = today();
  const withDay = next.activeDays.includes(day)
    ? next
    : { ...next, activeDays: [...next.activeDays, day] };

  snapshot = withDay;

  try {
    if (available()) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(withDay));
  } catch {
    // A blocked store must not take the loop down with it.
  }

  listeners.forEach((listener) => listener());
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function getSnapshot(): LoopState {
  snapshot ??= read();
  return snapshot;
}

function getServerSnapshot(): LoopState {
  return EMPTY;
}

function blank(challengeId: string, criteriaTotal: number): ChallengeState {
  return {
    challengeId,
    status: "available",
    criteriaDemonstrated: 0,
    criteriaTotal,
    attempt1Criteria: [],
    attempt2Criteria: [],
  };
}

export function challengeState(
  state: LoopState,
  challengeId: string,
  criteriaTotal: number,
): ChallengeState {
  return state.challenges[challengeId] ?? blank(challengeId, criteriaTotal);
}

function patchChallenge(
  challengeId: string,
  criteriaTotal: number,
  patch: Partial<ChallengeState>,
): void {
  const current = getSnapshot();
  const existing = challengeState(current, challengeId, criteriaTotal);

  write({
    ...current,
    challenges: {
      ...current.challenges,
      [challengeId]: { ...existing, ...patch },
    },
  });
}

export function recordAttempt(
  challengeId: string,
  criteriaTotal: number,
  attempt: 1 | 2,
  text: string,
  demonstrated: string[],
): void {
  patchChallenge(challengeId, criteriaTotal, {
    status: attempt === 1 ? "attempted" : "completed",
    ...(attempt === 1
      ? { attempt1: text, attempt1Criteria: demonstrated }
      : { attempt2: text, attempt2Criteria: demonstrated }),
    criteriaDemonstrated: demonstrated.length,
  });
}

export function setChallengeStatus(
  challengeId: string,
  criteriaTotal: number,
  status: ChallengeStatus,
): void {
  patchChallenge(challengeId, criteriaTotal, { status });
}

export function verifyCapability(capabilityId: string): void {
  const current = getSnapshot();
  write({
    ...current,
    capabilities: { ...current.capabilities, [capabilityId]: "verified" },
  });
}

/**
 * Finishing the capstone adds a proof item and records what it showed:
 * prioritization came out developing rather than verified, which is the honest
 * result and the reason the "what's next" screen has something to point at.
 */
export function completeCapstone(id: string, title: string): void {
  const current = getSnapshot();
  if (current.proofItems.some((item) => item.id === id)) return;

  write({
    ...current,
    proofItems: [...current.proofItems, { id, title, at: Date.now() }],
    capabilities: {
      ...current.capabilities,
      prioritization:
        current.capabilities.prioritization === "verified"
          ? "verified"
          : "developing",
    },
  });
}

export function resetLoop(): void {
  write(EMPTY);
}

export function useLoop(): LoopState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export interface Progression {
  capstones: number;
  verified: number;
  challengesCompleted: number;
  gapsClosed: number;
  activeDays: number;
  /** Core capabilities still to prove — what the capstone waits on. */
  coreRemaining: number;
  coreVerified: number;
}

/** The only numbers Pandaroute counts, and all of them are things the learner did. */
export function progression(state: LoopState): Progression {
  const challenges = Object.values(state.challenges);

  const coreVerified = CORE_CAPABILITIES.filter(
    (id) => state.capabilities[id] === "verified",
  ).length;

  return {
    capstones: state.proofItems.length,
    coreVerified,
    coreRemaining: CORE_CAPABILITIES.length - coreVerified,
    verified: Object.values(state.capabilities).filter((s) => s === "verified").length,
    challengesCompleted: challenges.filter((c) => c.status === "completed").length,
    gapsClosed: challenges.reduce(
      (total, c) =>
        total + Math.max(0, c.attempt2Criteria.length - c.attempt1Criteria.length),
      0,
    ),
    activeDays: state.activeDays.length,
  };
}

/* ---------------------------------------------------------------------------
   Prototype progression.

   A tester cannot sit through five challenges to see the milestone and the
   capstone unlock, so this marks the remaining core capabilities as verified
   and records the challenges that would have produced them. It exists behind a
   control labelled as a prototype shortcut and is not a product feature.
--------------------------------------------------------------------------- */
export function seedDemoProgress(target: number): void {
  const current = getSnapshot();
  const capabilities = { ...current.capabilities };
  const challenges = { ...current.challenges };

  let verified = CORE_CAPABILITIES.filter((id) => capabilities[id] === "verified").length;

  for (const id of CORE_CAPABILITIES) {
    if (verified >= target) break;
    if (capabilities[id] === "verified") continue;

    capabilities[id] = "verified";
    verified += 1;

    const demoId = `demo-${id}`;
    challenges[demoId] = {
      challengeId: demoId,
      status: "completed",
      criteriaDemonstrated: 4,
      criteriaTotal: 4,
      attempt1Criteria: ["a", "b", "c"],
      attempt2Criteria: ["a", "b", "c", "d"],
    };
  }

  write({ ...current, capabilities, challenges });
}
