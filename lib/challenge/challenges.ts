/* ---------------------------------------------------------------------------
   Challenges.

   A challenge is a situation first and a lesson second. The learner attempts
   it cold, finds out what was missing from their own attempt, learns only that
   part, and tries again — never lesson-then-quiz, which is the whole point of
   the product.

   Evaluation is deterministic for the prototype: attempt one credits the
   instincts a QA analyst already brings, attempt two adds what the micro-lesson
   just taught. That is enough to user-test the loop without a model in the way.

   `guidance` steps down as the learner goes: Panda starts as a teacher who
   speaks unprompted, becomes a coach who answers when asked, and ends as an
   observer. Independence is the goal, so the scaffolding has to leave.
--------------------------------------------------------------------------- */

export type Guidance = "high" | "moderate" | "light";

/** Attempt shape. Essay is a single written approach; metrics adds a choice. */
export type ChallengeKind = "essay" | "metrics";

export interface Criterion {
  id: string;
  name: string;
  /** What the learner did show, in their words. */
  demonstrated: string;
  /** What was missing, phrased as a next step rather than a mistake. */
  gap: string;
  /** What changed on the retry. */
  improved: string;
  /** The line on the verification screen. */
  proof: string;
}

export interface Lesson {
  label: string;
  title: string;
  subtitle?: string;
  /** Challenge 01 shape: a request reframed as a question. */
  requested?: string;
  pmQuestion?: string;
  possibilities?: string[];
  /** Challenge 02 shape: an observation, hypotheses, and evidence. */
  observation?: string;
  hypotheses?: string[];
  evidence?: string[];
  principle?: string;
  framework: string[];
}

export interface FunnelStep {
  value: string;
  label: string;
}

export interface Challenge {
  id: string;
  number: string;
  capabilityId: string;
  title: string;
  tags: string[];
  minutes: number;
  kind: ChallengeKind;
  guidance: Guidance;
  scenario: string;
  /** Headline numbers, when the scenario is about data. */
  funnel?: FunnelStep[];
  proposal: string;
  proposalBy: string;
  constraint?: string;
  question: string;
  prompts: string[];
  /** Metrics challenges ask the learner to pick where the problem is. */
  focusOptions?: Array<{ id: string; label: string }>;
  criteria: Criterion[];
  /** Which criteria a first attempt credits — the rest are what the lesson covers. */
  attempt1Ids: string[];
  verifiedName: string;
  lesson: Lesson;
  introPanda: string;
  attemptPanda: string;
  retryPanda: string;
}

export const CHALLENGES: Challenge[] = [
  {
    id: "01",
    number: "Challenge 01",
    capabilityId: "product-discovery",
    title: "The Feature Everyone Wants",
    tags: ["Product Discovery", "Problem Framing"],
    minutes: 8,
    kind: "essay",
    guidance: "high",
    scenario:
      "Your customer support team reports that users frequently complain about difficulty finding previous invoices.",
    proposal: "Let's add a Download All Invoices button.",
    proposalBy: "A stakeholder proposes:",
    constraint: "Engineering estimates it will take two weeks to build.",
    question: "What would you do before deciding whether to build this feature?",
    prompts: [
      "What would you want to understand?",
      "Who would you talk to?",
      "What evidence would you look for?",
      "What decision would you make next?",
    ],
    criteria: [
      {
        id: "user-focus",
        name: "User focus",
        demonstrated: "You recognised that the request needs further investigation.",
        gap: "Start from what the user is trying to get done, not from the request.",
        improved: "You stayed with the user's job rather than the proposed feature.",
        proof: "Investigate the underlying user need",
      },
      {
        id: "stakeholder-awareness",
        name: "Stakeholder awareness",
        demonstrated: "You identified people who could provide more context.",
        gap: "Name who holds the missing context and what you would ask them.",
        improved: "You went to the people closest to the complaints.",
        proof: "Bring the right people into the decision",
      },
      {
        id: "problem-framing",
        name: "Problem framing",
        demonstrated: "You defined the problem before weighing the proposed feature.",
        gap: "You moved toward evaluating the proposed feature before clearly defining the underlying user problem.",
        improved: "You separated the underlying problem from the proposed solution.",
        proof: "Frame a problem before evaluating solutions",
      },
      {
        id: "evidence",
        name: "Evidence",
        demonstrated: "You named the evidence that would settle the question.",
        gap: "You could be more specific about what evidence would validate the problem.",
        improved: "You identified specific evidence you would investigate.",
        proof: "Identify relevant evidence",
      },
    ],
    attempt1Ids: ["user-focus", "stakeholder-awareness"],
    verifiedName: "Product Problem Framing",
    introPanda:
      "There's no lesson before this. I want to see how you approach it first. 🐼",
    attemptPanda:
      "Think like you're actually in the meeting. What would you need to know first?",
    retryPanda: "Great. Apply what you learned and show me your improved approach. 💪",
    lesson: {
      label: "2 min learn",
      title: "Problem before solution",
      requested: "Add Download All Invoices",
      pmQuestion: "Why are users struggling with invoices?",
      possibilities: [
        "Users cannot find old invoices",
        "Users need invoices for accounting",
        "Users download the same invoice repeatedly",
        "Search and filtering are poor",
        "Bulk download may genuinely be the answer",
      ],
      principle: "A feature request is evidence of a need — not necessarily the solution.",
      framework: ["Request", "Need", "Evidence", "Problem", "Options"],
    },
  },
  {
    id: "02",
    number: "Challenge 02",
    capabilityId: "product-metrics",
    title: "The Feature Everyone Tried… Once",
    tags: ["Product Metrics", "Retention"],
    minutes: 8,
    kind: "metrics",
    guidance: "moderate",
    scenario: "Your team launched a new dashboard feature three weeks ago.",
    funnel: [
      { value: "100", label: "Users" },
      { value: "70%", label: "Discovered" },
      { value: "35%", label: "Tried" },
      { value: "8%", label: "Returned" },
    ],
    proposal: "70% discovery is great. The launch was successful.",
    proposalBy: "A stakeholder says:",
    question:
      "Do you agree? What would you investigate before deciding whether the feature is successful?",
    prompts: [
      "What concerns you most?",
      "What might that behaviour mean?",
      "What evidence would tell you?",
    ],
    focusOptions: [
      { id: "discovery", label: "Discovery" },
      { id: "first-use", label: "First use" },
      { id: "repeat", label: "Repeat usage" },
      { id: "healthy", label: "Nothing — performance looks healthy" },
    ],
    criteria: [
      {
        id: "retention-awareness",
        name: "Retention awareness",
        demonstrated:
          "You recognised that high discovery doesn't necessarily mean ongoing value.",
        gap: "Notice that discovery and value are different questions.",
        improved: "You kept the focus on whether the feature earns a second visit.",
        proof: "Identify meaningful behavioural drops",
      },
      {
        id: "funnel-thinking",
        name: "Funnel thinking",
        demonstrated: "You identified the largest behavioural drop.",
        gap: "Find the step where behaviour changes most, not the smallest number.",
        improved: "You located the drop that actually matters.",
        proof: "Interpret a product funnel",
      },
      {
        id: "metric-hypothesis",
        name: "Metric → hypothesis",
        demonstrated: "You proposed why users might not be coming back.",
        gap: "You identified where the problem may be, but your next step needs a clearer hypothesis about why users aren't returning.",
        improved: "You formed a testable hypothesis.",
        proof: "Form hypotheses from metrics",
      },
      {
        id: "metric-evidence",
        name: "Evidence",
        demonstrated: "You named the evidence that would test your hypothesis.",
        gap: "Say what you would look at to confirm or kill the hypothesis.",
        improved: "You connected the hypothesis to evidence.",
        proof: "Identify evidence needed for investigation",
      },
    ],
    attempt1Ids: ["retention-awareness", "funnel-thinking", "metric-evidence"],
    verifiedName: "Product Metrics Reasoning",
    introPanda:
      "The numbers tell a story — but maybe not the whole story. What stands out to you?",
    attemptPanda:
      "Don't just describe the numbers. Think about what user behaviour they might represent.",
    retryPanda: "Great! Apply what you learned and show me your improved analysis.",
    lesson: {
      label: "2 min learn",
      title: "A metric tells you where.",
      subtitle: "It doesn't always tell you why.",
      observation: "Repeat usage = 8%",
      hypotheses: [
        "Users don't find ongoing value",
        "The feature solves an infrequent problem",
        "The experience is difficult after first use",
        "Users found another way to complete the task",
      ],
      evidence: [
        "Cohort behaviour",
        "User interviews",
        "Usage paths",
        "Frequency of the underlying need",
      ],
      framework: ["Signal", "Hypothesis", "Evidence", "Decision"],
    },
  },
];

export const CHALLENGE_BY_ID = new Map(CHALLENGES.map((c) => [c.id, c]));

/** Which challenge closes a given capability, if one exists yet. */
export function challengeForCapability(capabilityId: string): Challenge | undefined {
  return CHALLENGES.find((challenge) => challenge.capabilityId === capabilityId);
}

/**
 * Deterministic evaluation. Attempt one credits what the learner already
 * brings; attempt two adds what the lesson just covered.
 */
export function evaluate(challenge: Challenge, attempt: 1 | 2): string[] {
  return attempt === 1
    ? challenge.attempt1Ids
    : challenge.criteria.map((criterion) => criterion.id);
}

/** The six steps of the loop, for the progress bar in the header. */
export const LOOP_STEPS = 6;

export const STEP_INDEX = {
  intro: 1,
  attempt: 2,
  check: 3,
  learn: 4,
  retry: 5,
  improvement: 6,
} as const;

/** Core capabilities the capstone waits on. */
export const CORE_CAPABILITIES = [
  "product-discovery",
  "product-metrics",
  "api-reasoning",
  "prioritization",
  "stakeholder-communication",
  "experimentation",
  "user-evidence",
];

export const CAPSTONE_REQUIREMENT = 7;
