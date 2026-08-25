/* ---------------------------------------------------------------------------
   The Challenge Library.

   A separate content layer on top of the existing challenge engine, not a
   second one. Sixteen cards describe realistic PM situations; only some of
   them have a real, playable challenge behind them yet (the ones with a
   `challengeId` or `externalHref`). The rest are honestly labelled "Coming
   soon" rather than pretending to be a graded exercise — a library can be
   fully populated without every shelf being stocked.

   Ordering and state are computed from the learner's real diagnostic and
   loop state, never invented: `resolveLibrary` is the only place that decides
   what's "recommended," and it does so from the same classification and
   verification data every other screen in the app reads.
--------------------------------------------------------------------------- */

import { CAPABILITY_BY_ID, reasonFor, type Classification } from "@/lib/diagnostic/capabilities";
import { classifyAnswers } from "@/lib/diagnostic/scoring";
import type { ChallengeStatus, LoopState } from "@/lib/challenge/use-challenge";
import type { CareerState } from "@/lib/career/use-career";

export type LibrarySection =
  | "product-thinking"
  | "data-decisions"
  | "technical-fluency"
  | "collaboration"
  | "career-growth";

export type Difficulty = "Beginner" | "Intermediate";

export interface LibraryEntry {
  id: string;
  emoji: string;
  title: string;
  tag: string;
  /** A real diagnostic capability, when this card tracks one. */
  capabilityId?: string;
  section: LibrarySection;
  description: string;
  minutes: number;
  difficulty: Difficulty;
  /** A real, playable Challenge behind this card. */
  challengeId?: string;
  /** A different existing feature this card should open instead (e.g. interview practice). */
  externalHref?: string;
}

export const SECTIONS: { id: LibrarySection; label: string }[] = [
  { id: "product-thinking", label: "Product Thinking" },
  { id: "data-decisions", label: "Data & Decisions" },
  { id: "technical-fluency", label: "Technical Fluency" },
  { id: "collaboration", label: "Collaboration" },
  { id: "career-growth", label: "Career Growth" },
];

export const LIBRARY: LibraryEntry[] = [
  {
    id: "define-problem",
    emoji: "🎯",
    title: "Define the real problem",
    tag: "Product Discovery",
    capabilityId: "product-discovery",
    section: "product-thinking",
    description: "Cut through the noise and uncover the core user problem worth solving.",
    minutes: 15,
    difficulty: "Beginner",
    challengeId: "01",
  },
  {
    id: "prioritize-confidence",
    emoji: "⚖️",
    title: "Prioritize with confidence",
    tag: "Prioritization",
    capabilityId: "prioritization",
    section: "product-thinking",
    description: "Evaluate competing opportunities and choose what delivers the most impact.",
    minutes: 20,
    difficulty: "Intermediate",
    externalHref: "/role/challenge/decision",
  },
  {
    id: "build-roadmap",
    emoji: "🗺️",
    title: "Build a simple roadmap",
    tag: "Roadmap Thinking",
    section: "product-thinking",
    description: "Turn strategy into a clear roadmap with priorities and trade-offs.",
    minutes: 20,
    difficulty: "Intermediate",
  },
  {
    id: "choose-metric",
    emoji: "📊",
    title: "Choose the right metric",
    tag: "Product Metrics",
    capabilityId: "product-metrics",
    section: "data-decisions",
    description: "Identify the metric that best represents whether your product is creating value.",
    minutes: 15,
    difficulty: "Beginner",
    challengeId: "02",
  },
  {
    id: "design-experiment",
    emoji: "🧪",
    title: "Design a good experiment",
    tag: "Experimentation",
    capabilityId: "experimentation",
    section: "data-decisions",
    description: "Turn a product assumption into a testable hypothesis and experiment.",
    minutes: 20,
    difficulty: "Intermediate",
    challengeId: "03",
  },
  {
    id: "find-signal",
    emoji: "🔍",
    title: "Find the signal in the data",
    tag: "Data Reasoning",
    section: "data-decisions",
    description: "Separate useful product signals from distracting numbers and vanity metrics.",
    minutes: 15,
    difficulty: "Intermediate",
  },
  {
    id: "think-apis",
    emoji: "</>",
    title: "Think in APIs",
    tag: "API Reasoning",
    capabilityId: "api-reasoning",
    section: "technical-fluency",
    description: "Understand how APIs and integrations create product value without needing to write code.",
    minutes: 15,
    difficulty: "Beginner",
    challengeId: "04",
  },
  {
    id: "design-ai-feature",
    emoji: "🤖",
    title: "Design an AI feature",
    tag: "AI Product Thinking",
    capabilityId: "ai-product-thinking",
    section: "technical-fluency",
    description: "Identify where AI can meaningfully help users and how you would measure its value.",
    minutes: 20,
    difficulty: "Intermediate",
  },
  {
    id: "debug-product-problem",
    emoji: "⚙️",
    title: "Debug the product problem",
    tag: "Technical Collaboration",
    section: "technical-fluency",
    description: "Work through a technical issue and decide what to ask engineering before choosing a solution.",
    minutes: 15,
    difficulty: "Intermediate",
  },
  {
    id: "manage-stakeholders",
    emoji: "👥",
    title: "Manage stakeholders",
    tag: "Stakeholder Management",
    capabilityId: "stakeholder-communication",
    section: "collaboration",
    description: "Align stakeholders with competing priorities and move a product decision forward.",
    minutes: 15,
    difficulty: "Beginner",
    challengeId: "05",
  },
  {
    id: "engineering-pushback",
    emoji: "💬",
    title: "Handle engineering pushback",
    tag: "Engineering Collaboration",
    section: "collaboration",
    description: "Respond when engineering challenges your product request and uncover the real constraint.",
    minutes: 15,
    difficulty: "Intermediate",
  },
  {
    id: "conflicting-priorities",
    emoji: "🧭",
    title: "Navigate conflicting priorities",
    tag: "Stakeholder Management",
    capabilityId: "stakeholder-communication",
    section: "collaboration",
    description: "Balance customer, business and engineering needs when everyone wants something different.",
    minutes: 20,
    difficulty: "Intermediate",
    challengeId: "05",
  },
  {
    id: "write-prd",
    emoji: "📝",
    title: "Write a clear PRD",
    tag: "Product Communication",
    section: "collaboration",
    description: "Turn a product problem, requirements and rationale into a clear product document.",
    minutes: 20,
    difficulty: "Beginner",
  },
  {
    id: "explain-decision",
    emoji: "🎤",
    title: "Explain your product decision",
    tag: "Communication",
    section: "collaboration",
    description: "Communicate a product decision clearly when stakeholders question your reasoning.",
    minutes: 10,
    difficulty: "Intermediate",
  },
  {
    id: "product-story",
    emoji: "💼",
    title: "Tell your product story",
    tag: "Interview Practice",
    section: "career-growth",
    description: "Turn one of your completed challenges into a concise PM interview story.",
    minutes: 10,
    difficulty: "Intermediate",
    externalHref: "/interview",
  },
  {
    id: "think-like-pm",
    emoji: "🎯",
    title: "Think like a PM",
    tag: "Role Transition",
    section: "career-growth",
    description: "Take a familiar QA situation and reframe it from a Product Manager's perspective.",
    minutes: 15,
    difficulty: "Beginner",
  },
];

export type CardState =
  | "recommended"
  | "new"
  | "in-progress"
  | "completed"
  | "verified"
  | "coming-soon";

export interface ResolvedEntry extends LibraryEntry {
  state: CardState;
  cta: string;
  /** Null when this card has nothing to open yet. */
  href: string | null;
  classification?: Classification;
  /** Lower sorts first: open gaps before exploration before verified work. */
  rank: number;
}

const IN_PROGRESS_HREF: Record<ChallengeStatus, (id: string) => string> = {
  available: (id) => `/challenge/${id}`,
  attempted: (id) => `/challenge/${id}/check`,
  learning: (id) => `/challenge/${id}/learn`,
  retry: (id) => `/challenge/${id}/retry`,
  completed: (id) => `/challenge/${id}/verified`,
};

function rankFor(classification: Classification | undefined, verified: boolean): number {
  if (verified) return 4;
  switch (classification) {
    case "practice":
      return 0;
    case "learn":
      return 1;
    case "skip":
      return 3;
    default:
      return 2; // no tracked capability — optional exploration
  }
}

export function resolveLibrary(
  diagnosticAnswers: Record<string, string>,
  loop: LoopState,
  career: CareerState,
): { entries: ResolvedEntry[]; recommended: ResolvedEntry | null } {
  const classifications = new Map(
    classifyAnswers(diagnosticAnswers).map((r) => [r.capabilityId, r.classification]),
  );

  const entries = LIBRARY.map((entry): ResolvedEntry => {
    const classification = entry.capabilityId ? classifications.get(entry.capabilityId) : undefined;
    const verified = entry.capabilityId ? loop.capabilities[entry.capabilityId] === "verified" : false;

    if (entry.challengeId) {
      const challengeStatus = loop.challenges[entry.challengeId]?.status ?? "available";
      if (verified || challengeStatus === "completed") {
        return {
          ...entry,
          state: "verified",
          cta: "Review →",
          href: `/challenge/${entry.challengeId}`,
          classification,
          rank: rankFor(classification, true),
        };
      }
      if (challengeStatus !== "available") {
        return {
          ...entry,
          state: "in-progress",
          cta: "Continue →",
          href: IN_PROGRESS_HREF[challengeStatus](entry.challengeId),
          classification,
          rank: rankFor(classification, false),
        };
      }
      return {
        ...entry,
        state: "new",
        cta: "Start →",
        href: `/challenge/${entry.challengeId}`,
        classification,
        rank: rankFor(classification, false),
      };
    }

    if (entry.id === "prioritize-confidence") {
      return {
        ...entry,
        state: verified ? "verified" : "new",
        cta: verified ? "Review →" : "Start challenge →",
        href: entry.externalHref!,
        classification,
        rank: rankFor(classification, verified),
      };
    }

    if (entry.externalHref === "/interview") {
      const status = career.interview?.status;
      const state: CardState = status === "ready" ? "completed" : status ? "in-progress" : "new";
      return {
        ...entry,
        state,
        cta: state === "completed" ? "Review →" : state === "in-progress" ? "Continue →" : "Practice →",
        href: entry.externalHref,
        classification,
        rank: 2,
      };
    }

    return {
      ...entry,
      state: "coming-soon",
      cta: "Coming soon",
      href: null,
      classification,
      rank: 5,
    };
  });

  // The one hero pick: the highest-priority open gap among cards that are
  // actually playable right now. A "coming soon" card is never the headline
  // recommendation — that would send the learner somewhere with nothing to do.
  const openCandidates = entries.filter(
    (e) => e.href && e.state !== "verified" && (e.classification === "practice" || e.classification === "learn"),
  );
  openCandidates.sort((a, b) => a.rank - b.rank);
  const recommended = openCandidates[0] ?? null;

  const withRecommendedFlag = entries.map((e) =>
    e.id === recommended?.id ? { ...e, state: "recommended" as const } : e,
  );

  return { entries: withRecommendedFlag, recommended };
}

/** "Why this challenge?" copy for the hero card — reuses the same sentence the Gap Map shows. */
export function recommendedReason(entry: ResolvedEntry): string {
  if (!entry.capabilityId || !entry.classification) {
    return "This one's open, and a good place to build evidence.";
  }
  const capability = CAPABILITY_BY_ID.get(entry.capabilityId);
  if (!capability) return "This one's open, and a good place to build evidence.";
  return reasonFor(capability, entry.classification);
}
