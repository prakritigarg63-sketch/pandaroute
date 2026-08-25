"use client";

import { useSyncExternalStore } from "react";
import {
  ROLE_REQUIREMENTS,
  ROLE_TITLE,
  SEEDED_DECISION,
  type EvidenceStatus,
  type PrioritizationOption,
  type RoleRequirement,
} from "@/lib/target-role/data";
import { verifyCapability } from "@/lib/challenge/use-challenge";

/* ---------------------------------------------------------------------------
   The target role.

   One record, persisted like every other flow in this app. Only two pieces of
   it ever change after analysis: whether Prioritization has been proven (which
   also verifies the shared "prioritization" capability, so the rest of
   Pandaroute sees it) and whether Roadmap Thinking has — the two gaps this
   role actually asks the learner to close.
--------------------------------------------------------------------------- */

export type TargetRoleStatus = "none" | "analyzing" | "gaps-found" | "preparing" | "prepared";

export interface PrioritizationDecision {
  choice: PrioritizationOption["id"];
  reasoning: string;
  notPrioritizing: string;
  tradeoff: string;
}

export interface TargetRoleState {
  roleTitle: string;
  company: string;
  jobDescription: string;
  status: TargetRoleStatus;
  prioritizationProven: boolean;
  roadmapProven: boolean;
  decision: PrioritizationDecision | null;
  portfolioSelected: boolean;
}

const STORAGE_KEY = "pandaroute:target-role:v1";

const EMPTY: TargetRoleState = {
  roleTitle: ROLE_TITLE,
  company: "",
  jobDescription: "",
  status: "none",
  prioritizationProven: false,
  roadmapProven: false,
  decision: null,
  portfolioSelected: false,
};

const listeners = new Set<() => void>();
let snapshot: TargetRoleState | null = null;

function available(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function read(): TargetRoleState {
  if (!available()) return EMPTY;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<TargetRoleState>) };
  } catch {
    return EMPTY;
  }
}

function write(next: TargetRoleState): void {
  snapshot = next;

  try {
    if (available()) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // A blocked store must not take the flow down with it.
  }

  listeners.forEach((listener) => listener());
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function getSnapshot(): TargetRoleState {
  snapshot ??= read();
  return snapshot;
}

function getServerSnapshot(): TargetRoleState {
  return EMPTY;
}

export function startRoleAnalysis(jobDescription: string, company: string): void {
  write({
    ...getSnapshot(),
    jobDescription,
    company,
    status: "analyzing",
  });
}

export function finishRoleAnalysis(): void {
  const current = getSnapshot();
  write({ ...current, status: "gaps-found" });
}

export function recordPrioritizationDecision(decision: PrioritizationDecision): void {
  write({ ...getSnapshot(), decision });
}

/** Completing the challenge is real evidence, so it verifies the shared
 *  "prioritization" capability too — Progress and Career Readiness see it. */
export function verifyPrioritization(): void {
  write({ ...getSnapshot(), prioritizationProven: true });
  verifyCapability("prioritization");
}

/** No shared capability exists for this one yet, so it's proven only inside
 *  the role flow — exactly what the brief allows ("simulate completion"). */
export function proveRoadmapThinking(): void {
  const current = getSnapshot();
  write({ ...current, roadmapProven: true, status: "preparing" });
}

export function selectPortfolioCase(selected: boolean): void {
  write({ ...getSnapshot(), portfolioSelected: selected });
}

export function markRolePrepared(): void {
  write({ ...getSnapshot(), status: "prepared" });
}

export function resetTargetRole(): void {
  write(EMPTY);
}

export function useTargetRole(): TargetRoleState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** The nine requirements, with Prioritization and Roadmap Thinking's status
 *  swapped to "proven" once the learner has actually closed those gaps. */
export function resolveRequirements(state: TargetRoleState): RoleRequirement[] {
  return ROLE_REQUIREMENTS.map((requirement) => {
    if (requirement.id === "prioritization" && state.prioritizationProven) {
      return {
        ...requirement,
        evidenceStatus: "proven" as EvidenceStatus,
        evidence: ["Sprint Prioritization Challenge"],
        gapNote: undefined,
        recommendedAction: "none" as const,
      };
    }

    if (requirement.id === "roadmap-thinking" && state.roadmapProven) {
      return {
        ...requirement,
        evidenceStatus: "proven" as EvidenceStatus,
        evidence: ["Roadmap Thinking Challenge"],
        gapNote: undefined,
        recommendedAction: "none" as const,
      };
    }

    return requirement;
  });
}

export const DEFAULT_DECISION_CHOICE = SEEDED_DECISION;
