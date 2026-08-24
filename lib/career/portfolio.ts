/* ---------------------------------------------------------------------------
   Career artefacts.

   Three different things, deliberately not merged:

     capability profile   what can I do?
     portfolio case       where have I demonstrated it?
     interview story      can I explain how I think?

   The portfolio case is derived from the capstone the learner already wrote.
   They are never asked to redo that thinking — the job here is packaging it.
   Edits are stored as the portfolio version so the capstone record stays as
   they originally wrote it.

   Nothing here claims a real outcome. A simulation reports what the learner
   would measure, never what happened.
--------------------------------------------------------------------------- */

import { CAPSTONE } from "@/lib/capstone/capstone";
import type { CapstoneState } from "@/lib/capstone/use-capstone";

export interface PortfolioCase {
  id: string;
  title: string;
  type: "simulation" | "real";
  problem: string;
  evidence: string[];
  insight: string;
  optionsConsidered: string[];
  decision: string;
  decisionReasoning: string;
  tradeoff: string;
  primaryMetric: string;
  guardrailMetric: string;
  expectedOutcome: string;
  capabilities: string[];
  status: "draft" | "ready";
}

export interface InterviewPractice {
  id: string;
  portfolioCaseId: string;
  question: string;
  attempt1: string;
  attempt2?: string;
  demonstrated: string[];
  strengthen: string[];
  status: "started" | "feedback" | "retry" | "ready";
}

export const CASE_ID = "ai-activation-case";

/** Seeded prototype text, used only where the learner left a field empty. */
const SEED = {
  problem: "New users were signing up, but only 22% completed a meaningful task.",
  insight:
    "New users struggle to reach meaningful value because they don't know how to apply the AI assistant to their own work.",
  decision:
    "Guided first-task experience with contextual prompt examples and progressive feedback.",
  decisionReasoning:
    "It directly addresses the moment users feel stuck. The evidence showed most users don't know what to ask or how to use the AI for their work.",
  primaryMetric: "First meaningful task completion",
  guardrailMetric: "Task quality / user trust",
  expectedOutcome: "Increase meaningful task completion from 22% to 30%+.",
  options: [
    "Personalized prompt suggestions",
    "Role-based onboarding",
    "Guided first-task experience",
  ],
};

export const EVIDENCE_CHIPS = ["User interviews", "Behaviour data", "Retention"];

export const CAPABILITY_CHIPS = [
  { name: "Discovery", state: "verified" },
  { name: "Framing", state: "verified" },
  { name: "Metrics", state: "verified" },
  { name: "Prioritization", state: "developing" },
  { name: "AI Thinking", state: "verified" },
] as const;

const pick = (written: string, seeded: string) =>
  written.trim().length > 0 ? written.trim() : seeded;

/**
 * The case as it stands: whatever the learner wrote in the capstone, with the
 * seeded prototype text filling any gaps, and their portfolio edits on top.
 */
export function deriveCase(
  capstone: CapstoneState,
  edits: Partial<PortfolioCase>,
): PortfolioCase {
  const options = capstone.ideas.filter((idea) => idea.trim().length > 0);

  const base: PortfolioCase = {
    id: CASE_ID,
    title: CAPSTONE.proof.title,
    type: "simulation",
    problem: pick(capstone.problemFraming, SEED.problem),
    evidence: ["Funnel data", "User interviews", "Behaviour patterns"],
    insight: pick(capstone.problemStatement, SEED.insight),
    optionsConsidered: options.length > 0 ? options : SEED.options,
    decision: pick(capstone.prioritizedIdea, SEED.decision),
    decisionReasoning: pick(capstone.prioritizationReasoning, SEED.decisionReasoning),
    tradeoff: "",
    primaryMetric: pick(capstone.primaryMetric, SEED.primaryMetric),
    guardrailMetric: pick(capstone.guardrailMetric, SEED.guardrailMetric),
    expectedOutcome: pick(capstone.decisionCriteria, SEED.expectedOutcome),
    capabilities: CAPABILITY_CHIPS.map((chip) => chip.name),
    status: "draft",
  };

  return { ...base, ...edits };
}

/** The five beats a PM story is told in. */
export const STORY_STEPS = [
  { id: "problem", name: "Problem", question: "What was happening?" },
  { id: "evidence", name: "Evidence", question: "What helped you understand the problem?" },
  { id: "insight", name: "Insight", question: "What did you learn?" },
  { id: "decision", name: "Decision", question: "What did you choose and why?" },
  { id: "outcome", name: "Outcome", question: "How will you measure success?" },
];

export const CASE_SUMMARY = [
  { n: "01", name: "Investigated", body: "Combined behavioural data and user interviews." },
  {
    n: "02",
    name: "Framed",
    body: "Identified uncertainty around how and when to use the AI assistant.",
  },
  { n: "03", name: "Explored", body: "Considered multiple approaches." },
  {
    n: "04",
    name: "Prioritised",
    body: "Chose the approach with the strongest combination of impact, confidence and learning value.",
  },
  {
    n: "05",
    name: "Measured",
    body: "Defined meaningful task completion as the primary metric.",
  },
];

/* ---- interview ---------------------------------------------------------- */

export const INTERVIEW_QUESTION =
  "Tell me about a product problem you worked through.";

export const INTERVIEW_CRITERIA = [
  { id: "problem", name: "Problem" },
  { id: "evidence", name: "Evidence" },
  { id: "decision", name: "Decision" },
  { id: "impact", name: "Impact" },
];

/** Deterministic: the first answer lands three of four, the retry lands all four. */
export const INTERVIEW_FEEDBACK = {
  strong: [
    {
      id: "problem",
      name: "Problem clarity",
      note: "You explained the context and user problem clearly.",
    },
    {
      id: "evidence",
      name: "Evidence",
      note: "You used data rather than relying only on assumptions.",
    },
  ],
  strengthen: [
    {
      id: "decision",
      name: "Decision rationale",
      note: "You explained what you chose, but not enough about why you chose it over the alternatives.",
    },
    {
      id: "conciseness",
      name: "Conciseness",
      note: "Your answer could reach the key decision faster.",
    },
  ],
  improved: [
    "Clear problem",
    "Evidence-backed reasoning",
    "Stronger decision rationale",
    "Clear outcome",
  ],
};

/** The coaching structure. Panda gives the shape; the words stay the learner's. */
export const COACHING_FRAME = [
  { id: "considered", lead: "I considered…", hint: "What alternatives existed?" },
  { id: "chose", lead: "I chose…", hint: "What did you prioritise?" },
  { id: "because", lead: "Because…", hint: "What evidence supported it?" },
  { id: "expected", lead: "I expected…", hint: "What outcome should change?" },
];

export const COACHING_EXAMPLE =
  "I considered A and B. I prioritised B because our interviews and behavioural data suggested ___. I would validate the decision through ___.";

export const COACHING_ORIGINAL = "We decided to introduce personalised onboarding.";
