/* ---------------------------------------------------------------------------
   Everything the Profile page shows about progress is derived here, from
   state other screens already own — never a second copy of it, never a
   fabricated number. Two exceptions are prototype formulas rather than real
   systems (there is no XP ledger or achievement table anywhere in this app):
   `computeXp` and `ACHIEVEMENTS`. Both are openly deterministic functions of
   real counts, the same honesty standard as the diagnostic's own scoring —
   not a random or hardcoded display value.
--------------------------------------------------------------------------- */

import type { LoopState } from "@/lib/challenge/use-challenge";

/** Today, then yesterday, then the day before — until the chain breaks. */
export function computeStreak(activeDays: string[]): number {
  if (activeDays.length === 0) return 0;
  const days = new Set(activeDays);
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  // A day not yet active today shouldn't zero the streak before the day is over —
  // start counting from today if it's there, otherwise from yesterday.
  if (!days.has(isoDate(cursor))) cursor.setDate(cursor.getDate() - 1);

  while (days.has(isoDate(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** This week's status per day, Monday first — for the streak dot row. */
export function weekStatus(activeDays: string[]): { label: string; done: boolean }[] {
  const days = new Set(activeDays);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const mondayOffset = (today.getDay() + 6) % 7; // 0 = Monday
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);

  return ["M", "T", "W", "T", "F", "S", "S"].map((label, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    return { label, done: days.has(isoDate(day)) };
  });
}

/**
 * XP formula: 100 per verified core capability, 40 per completed challenge,
 * 400 per finished capstone. A prototype conversion rate, not a hidden real
 * economy — chosen so the numbers move visibly as a learner does real things.
 */
export function computeXp(loop: LoopState): number {
  const verified = Object.values(loop.capabilities).filter((s) => s === "verified").length;
  const challenges = Object.values(loop.challenges).filter((c) => c.status === "completed").length;
  const capstones = loop.proofItems.length;
  return verified * 100 + challenges * 40 + capstones * 400;
}

const LEVEL_STEP = 500;
const LEVEL_ONE_CEILING = 300;

/** Level 1: 0–299 XP. Level 2+: every further 500 XP, per the brief's bands. */
export function computeLevel(xp: number): number {
  if (xp < LEVEL_ONE_CEILING) return 1;
  return 2 + Math.floor((xp - LEVEL_ONE_CEILING) / LEVEL_STEP);
}

export interface AchievementDef {
  id: string;
  icon: "compass" | "flame" | "zap" | "cpu" | "award" | "lock";
  title: string;
  description: string;
  unlocked: boolean;
}

export function deriveAchievements(params: {
  diagnosticComplete: boolean;
  streak: number;
  challengesCompleted: number;
  aiCapabilityVerified: boolean;
  verifiedCount: number;
}): AchievementDef[] {
  const { diagnosticComplete, streak, challengesCompleted, aiCapabilityVerified, verifiedCount } = params;

  return [
    {
      id: "first-step",
      icon: "compass",
      title: "First Step",
      description: "Completed your diagnostic",
      unlocked: diagnosticComplete,
    },
    {
      id: "on-a-roll",
      icon: "flame",
      title: "On a Roll",
      description: "Maintained a 7-day streak",
      unlocked: streak >= 7,
    },
    {
      id: "quick-learner",
      icon: "zap",
      title: "Quick Learner",
      description: "Completed 5 challenges",
      unlocked: challengesCompleted >= 5,
    },
    {
      id: "ai-explorer",
      icon: "cpu",
      title: "AI Explorer",
      description: "Demonstrated an AI capability",
      unlocked: aiCapabilityVerified,
    },
    {
      id: "skill-builder",
      icon: "award",
      title: "Skill Builder",
      description: "Verified 3 capabilities",
      unlocked: verifiedCount >= 3,
    },
    {
      id: "locked",
      icon: "lock",
      title: "???",
      description: "Complete more challenges to discover",
      unlocked: false,
    },
  ];
}
