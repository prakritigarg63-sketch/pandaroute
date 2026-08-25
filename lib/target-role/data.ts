/* ---------------------------------------------------------------------------
   Target role analysis — content.

   A role is broken into requirements grouped the way a hiring conversation is
   (Product Thinking, Data & Decisions, Technical Fluency, Collaboration), each
   tagged Important or Useful. Six of the nine carry an evidence status; the
   other three (Experimentation, AI Products, Stakeholder Management) are
   context in the breakdown but don't drive the gap flow — this role only asks
   the learner to close two gaps, not nine.

   Evidence status is a deterministic seed, not a live JD parser — "Do not
   build a sophisticated engine" per the brief. Only Prioritization is real:
   completing its challenge calls the shared capability store, so the rest of
   Pandaroute (Progress, Career Readiness) reflects it too. Roadmap Thinking
   has no shared capability behind it — it is proven locally, inside this
   feature, the moment the learner completes its (simulated) proof step.
--------------------------------------------------------------------------- */

export type RequirementCategory =
  | "product-thinking"
  | "data-decisions"
  | "technical-fluency"
  | "collaboration";

export type Importance = "important" | "useful";
export type EvidenceStatus = "proven" | "developing" | "not-proven";

export interface RoleRequirement {
  id: string;
  capability: string;
  category: RequirementCategory;
  importance: Importance;
  /** Present only for the six requirements this flow actually tracks. */
  evidenceStatus?: EvidenceStatus;
  evidence?: string[];
  gapNote?: string;
  recommendedAction?: "none" | "strengthen" | "build-proof";
  minutes?: number;
}

export const CATEGORY_LABEL: Record<RequirementCategory, string> = {
  "product-thinking": "Product Thinking",
  "data-decisions": "Data & Decisions",
  "technical-fluency": "Technical Fluency",
  collaboration: "Collaboration",
};

export const ROLE_TITLE = "Product Manager";

export const SAMPLE_JD = `We're looking for a Product Manager to own activation and onboarding for our B2B SaaS platform.

You'll run discovery with customers, prioritize a roadmap against competing stakeholder requests, and work closely with engineering to ship. You're comfortable reading product metrics, running experiments, and reasoning about API-level constraints when scoping technical work. You'll also evaluate where AI can genuinely help our workflow, not just where it's trendy.

Strong written and verbal communication is essential — you'll present trade-offs to stakeholders and defend prioritization calls under pressure.`;

export const ROLE_REQUIREMENTS: RoleRequirement[] = [
  {
    id: "product-discovery",
    capability: "Product Discovery",
    category: "product-thinking",
    importance: "important",
    evidenceStatus: "proven",
    evidence: ["AI Product Activation Case"],
  },
  {
    id: "prioritization",
    capability: "Prioritization",
    category: "product-thinking",
    importance: "important",
    evidenceStatus: "developing",
    gapNote: "You've practiced this capability, but your evidence isn't strong enough yet.",
    recommendedAction: "strengthen",
    minutes: 10,
  },
  {
    id: "roadmap-thinking",
    capability: "Roadmap Thinking",
    category: "product-thinking",
    importance: "important",
    evidenceStatus: "not-proven",
    gapNote:
      "This role expects roadmap decision-making, but your Career Kit doesn't contain evidence yet.",
    recommendedAction: "build-proof",
    minutes: 15,
  },
  {
    id: "product-metrics",
    capability: "Product Metrics",
    category: "data-decisions",
    importance: "important",
    evidenceStatus: "proven",
    evidence: ["Metrics Challenge + Capstone"],
  },
  {
    id: "experimentation",
    capability: "Experimentation",
    category: "data-decisions",
    importance: "useful",
  },
  {
    id: "apis",
    capability: "APIs",
    category: "technical-fluency",
    importance: "useful",
    evidenceStatus: "proven",
    evidence: ["API Reasoning Challenge"],
  },
  {
    id: "ai-products",
    capability: "AI Products",
    category: "technical-fluency",
    importance: "important",
  },
  {
    id: "stakeholder-management",
    capability: "Stakeholder Management",
    category: "collaboration",
    importance: "important",
  },
  {
    id: "engineering-collaboration",
    capability: "Engineering Collaboration",
    category: "collaboration",
    importance: "important",
    evidenceStatus: "proven",
    evidence: ["Credited from QA experience"],
  },
];

/** The six requirements the Evidence Match and Gap Map screens work with. */
export const TRACKED_REQUIREMENT_IDS = [
  "product-discovery",
  "prioritization",
  "roadmap-thinking",
  "product-metrics",
  "apis",
  "engineering-collaboration",
];

/* ---- the prioritization challenge — the one gap this flow really closes -- */

export interface PrioritizationOption {
  id: "a" | "b" | "c";
  letter: "A" | "B" | "C";
  title: string;
  metaLabel: string;
  metaValue: string;
  impactLabel: string;
  impactValue: string;
  effort: "High" | "Medium" | "Low";
}

export const PRIORITIZATION_OPTIONS: PrioritizationOption[] = [
  {
    id: "a",
    letter: "A",
    title: "Enterprise SSO",
    metaLabel: "Requested by",
    metaValue: "3 enterprise prospects",
    impactLabel: "Potential impact",
    impactValue: "₹40L pipeline",
    effort: "High",
  },
  {
    id: "b",
    letter: "B",
    title: "Onboarding improvements",
    metaLabel: "Evidence",
    metaValue: "32% onboarding drop-off",
    impactLabel: "Potential impact",
    impactValue: "All new users",
    effort: "Medium",
  },
  {
    id: "c",
    letter: "C",
    title: "Dashboard customization",
    metaLabel: "Requested by",
    metaValue: "Existing power users",
    impactLabel: "Potential impact",
    impactValue: "Retention",
    effort: "Low",
  },
];

/** Seeded for the prototype — matches the deterministic-evaluation approach
 *  used by every other challenge in this app. */
export const SEEDED_DECISION: PrioritizationOption["id"] = "b";

export const PRIORITIZATION_DEMONSTRATED = [
  {
    id: "impact",
    name: "Impact reasoning",
    note: "You connected the decision to user and business impact.",
  },
  {
    id: "evidence",
    name: "Evidence use",
    note: "You used available evidence instead of choosing based only on stakeholder pressure.",
  },
  {
    id: "tradeoff",
    name: "Trade-off awareness",
    note: "You explicitly acknowledged what the team would delay.",
  },
];

/* ---- Panda, as career navigator ------------------------------------------ */

export const ROLE_PANDA = {
  hub: "Every PM role asks for something slightly different. Let's see what this one actually needs — and what you can already prove.",
  addRole:
    "I'll focus on the capabilities the role actually asks for — not every keyword in the description.",
  breakdown: "Now let's compare these requirements with what you've already demonstrated.",
  evidenceMatch:
    "A gap doesn't automatically mean you can't do it. It means we don't have enough evidence yet.",
  gapMap: "You don't need another 20-hour course. You need stronger evidence in two places.",
  fastestRoute: "No restarting. No generic curriculum. Just the gaps that matter for this role.",
  challengeIntro: "There's no universally correct option. I care about how you make the decision.",
  evidenceCheck: "That's the evidence we were missing.",
  matchUpdated: "One more capability to prove for this role.",
  readiness:
    "This doesn't guarantee the job — but you're going in knowing what you can demonstrate.",
  addedToKit: "Your route now adapts to the opportunity you're pursuing.",
} as const;
