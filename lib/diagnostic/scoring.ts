/* ---------------------------------------------------------------------------
   Turning answers into a route.

   One scenario per capability in this prototype, so the mapping is direct:
   strong evidence skips the basics, partial evidence goes to practice, and low
   evidence starts at learn. The number never leaves this file — the learner
   sees Learn, Practice or Skip and the reason behind it, never a score.

   An unanswered capability is Learn rather than nothing: no evidence is not
   evidence of strength.
--------------------------------------------------------------------------- */

import { CAPABILITIES, type Classification } from "@/lib/diagnostic/capabilities";
import { QUESTIONS } from "@/lib/diagnostic/questions";

export interface CapabilityResult {
  capabilityId: string;
  /** Internal only. Never rendered. */
  score: number;
  classification: Classification;
}

function classify(score: number): Classification {
  if (score >= 2) return "skip";
  if (score >= 1) return "practice";
  return "learn";
}

/** answers: question id → option id. */
export function classifyAnswers(answers: Record<string, string>): CapabilityResult[] {
  const scores = new Map<string, number>();

  for (const question of QUESTIONS) {
    const chosen = question.options.find((option) => option.id === answers[question.id]);
    const evidence = chosen?.evidence ?? 0;
    scores.set(question.capabilityId, (scores.get(question.capabilityId) ?? 0) + evidence);
  }

  return CAPABILITIES.map((capability) => {
    const score = scores.get(capability.id) ?? 0;
    return { capabilityId: capability.id, score, classification: classify(score) };
  });
}

export function countBy(results: CapabilityResult[]): Record<Classification, number> {
  return results.reduce(
    (totals, result) => {
      totals[result.classification] += 1;
      return totals;
    },
    { learn: 0, practice: 0, skip: 0 } as Record<Classification, number>,
  );
}
