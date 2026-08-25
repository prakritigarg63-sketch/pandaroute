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
  /** Sticky-CTA line on the capability-check screen, after attempt 1. */
  checkPanda: string;
  /** Sticky-CTA line on the micro-lesson screen. */
  learnPanda: string;
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
    checkPanda:
      "Good start — you already have the investigation instinct from QA. Now let's shift from “What's wrong?” to “What problem are we actually solving?”",
    learnPanda:
      "Your QA instinct is useful here: investigate before concluding. PM thinking adds one layer — investigate the user problem before concluding on the solution.",
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
    checkPanda:
      "You're already spotting that discovery isn't the same as value — good instinct. The PM step is turning that into a hypothesis about why, not just noticing the gap.",
    learnPanda:
      "Noticing the gap is the easy part. PM thinking adds one layer: turn the number into a hypothesis you could actually test.",
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
  {
    id: "03",
    number: "Challenge 03",
    capabilityId: "experimentation",
    title: "The Assumption Nobody's Tested",
    tags: ["Experimentation", "Hypothesis Writing"],
    minutes: 20,
    kind: "essay",
    guidance: "high",
    scenario:
      "Your team wants to add a 'Recommended for you' section to the homepage. Everyone agrees it will increase engagement.",
    proposal: "Let's just ship it and see what happens.",
    proposalBy: "An engineer suggests:",
    constraint:
      "You have one sprint before the next roadmap review, and only enough capacity for one focused test.",
    question: "What would you do before agreeing to ship it?",
    prompts: [
      "What assumption is actually being made here?",
      "What would you want to isolate?",
      "What decision would the result actually drive?",
      "How would you know if you were wrong?",
    ],
    criteria: [
      {
        id: "assumption-naming",
        name: "Assumption naming",
        demonstrated: "You named the specific belief being tested, not just the feature.",
        gap: "State the assumption as a claim that could turn out to be false.",
        improved: "You separated the feature from the belief behind it.",
        proof: "Name the assumption behind a product idea",
      },
      {
        id: "hypothesis-form",
        name: "Hypothesis form",
        demonstrated: "You framed a hypothesis with a clear expected outcome.",
        gap: "Write the hypothesis as “if we do X, Y will happen, because Z” — not just a guess.",
        improved: "You wrote a hypothesis that could be checked, not just a hope.",
        proof: "Write a falsifiable hypothesis",
      },
      {
        id: "decision-rule",
        name: "Decision → action",
        demonstrated: "You said what you would actually do with each possible result.",
        gap: "Decide in advance what result would make you ship, iterate, or drop the idea.",
        improved: "You committed to what each outcome would mean before seeing it.",
        proof: "Define the decision a result would drive",
      },
      {
        id: "isolate-variable",
        name: "Isolating the variable",
        demonstrated: "You kept the test to one change so the result would mean something.",
        gap: "Watch for other changes that could get bundled in and blur the result.",
        improved: "You protected the test from being contaminated by other changes.",
        proof: "Isolate a single variable in a test",
      },
    ],
    attempt1Ids: ["assumption-naming", "isolate-variable"],
    verifiedName: "Experiment Design",
    introPanda: "There's no lesson before this one either. Show me how you'd think about it first. 🐼",
    attemptPanda:
      "You already know how to isolate a variable in a test case. Now do the same for a product idea.",
    checkPanda:
      "You're already isolating the variable, which is real testing instinct. The PM step is turning that into a hypothesis with a decision attached — not just “let's see what happens.”",
    learnPanda:
      "Your instinct to isolate one variable is exactly right. PM experimentation adds one layer: decide, before you look at the data, what result would actually change your decision.",
    retryPanda: "Good. Now write it like someone else has to run this experiment without asking you anything. 💪",
    lesson: {
      label: "2 min learn",
      title: "A test needs a decision, not just a result.",
      observation: "Belief: “Recommendations will increase engagement.”",
      hypotheses: [
        "Users click recommended items more than they browse (real engagement lift)",
        "Users trust the product more, but don't click more (satisfaction, not engagement)",
        "Users don't notice it at all (no effect)",
        "Users feel over-targeted and disengage (negative effect)",
      ],
      evidence: [
        "Click-through on the section",
        "Change in overall session length",
        "Segment-level engagement differences",
        "User feedback on relevance",
      ],
      principle:
        "A good experiment states, before it runs, what result means ship, what result means iterate, and what result means drop.",
      framework: ["Assumption", "Hypothesis", "Test", "Decision"],
    },
  },
  {
    id: "04",
    number: "Challenge 04",
    capabilityId: "api-reasoning",
    title: "The Integration That Broke Silently",
    tags: ["API Reasoning", "Technical Fluency"],
    minutes: 15,
    kind: "essay",
    guidance: "high",
    scenario:
      "A customer reports that their orders stopped syncing to their accounting software three days ago. Nobody on your team noticed.",
    proposal: "The API call is failing because the customer's access token expired. Not our bug.",
    proposalBy: "An engineer explains:",
    constraint:
      "The customer is a top-20 account, and this is the third integration complaint this month.",
    question: "What would you do with this information?",
    prompts: [
      "What does “not our bug” actually mean here?",
      "What would you want to know about how this fails for other customers?",
      "What's the product decision, not just the technical fix?",
      "What would you ask engineering next?",
    ],
    criteria: [
      {
        id: "technical-translation",
        name: "Technical translation",
        demonstrated: "You translated the technical cause into what it means for the customer.",
        gap: "State the customer impact in one sentence a non-technical stakeholder could act on.",
        improved: "You led with customer impact, not the technical explanation.",
        proof: "Translate a technical cause into customer impact",
      },
      {
        id: "scope-the-pattern",
        name: "Scoping the pattern",
        demonstrated: "You asked whether this is a one-off or a pattern across other customers.",
        gap: "A single “not our bug” answer doesn't tell you if this will happen again to someone else.",
        improved: "You checked whether this was isolated or systemic before deciding what to do.",
        proof: "Distinguish a one-off failure from a systemic pattern",
      },
      {
        id: "product-vs-technical-fix",
        name: "Product decision vs technical fix",
        demonstrated: "You separated “whose bug is it” from “what should we do about it.”",
        gap: "Being technically correct that it's not a bug doesn't resolve what the customer experiences.",
        improved: "You moved past whose fault it was to what the customer needed.",
        proof: "Separate technical blame from the product decision",
      },
      {
        id: "engineering-ask",
        name: "The right ask",
        demonstrated: "You asked engineering a specific, answerable question.",
        gap: "Ask for something engineering can actually check — like how often tokens expire silently — not a vague “can we prevent this.”",
        improved: "You asked a question that would actually move the decision forward.",
        proof: "Ask engineering a specific, decision-relevant question",
      },
    ],
    attempt1Ids: ["technical-translation", "product-vs-technical-fix"],
    verifiedName: "API & Systems Reasoning",
    introPanda: "No lesson first — show me how you'd think about this. 🐼",
    attemptPanda:
      "You don't need to know how the API works. You need to know what its failure means for the customer.",
    checkPanda:
      "You're already good at separating “whose bug is it” from what the customer experiences — that's real QA instinct. The PM step is turning that into a specific ask that moves the decision forward.",
    learnPanda:
      "Understanding the API isn't the job. Deciding what the failure means for the customer, and asking the one question that unblocks a decision, is.",
    retryPanda: "Nice. Now show me the sharper version — the one that gets you an answer, not just an explanation. 💪",
    lesson: {
      label: "2 min learn",
      title: "\"Not our bug\" answers who's at fault.",
      subtitle: "It doesn't answer what the customer experiences.",
      observation: "Orders stopped syncing 3 days ago — cause: an expired access token.",
      hypotheses: [
        "This happens to every customer whose token expires (systemic)",
        "This is the first time it's happened (isolated)",
        "Tokens expire silently with no customer-facing warning",
        "Customers don't know how to refresh their own token",
      ],
      evidence: [
        "How often tokens expire across all customers",
        "Whether customers get any expiry warning",
        "Support tickets mentioning sync failures",
        "Time between expiry and the customer noticing",
      ],
      principle:
        "“Not our bug” answers who's at fault. It doesn't answer what the customer experiences, or whether it happens again.",
      framework: ["Symptom", "Technical cause", "Customer impact", "Decision"],
    },
  },
  {
    id: "05",
    number: "Challenge 05",
    capabilityId: "stakeholder-communication",
    title: "The VP Wants It Anyway",
    tags: ["Stakeholder Management", "Prioritization"],
    minutes: 15,
    kind: "essay",
    guidance: "high",
    scenario:
      "You've decided this sprint focuses on fixing the onboarding drop-off, backed by data showing it's costing signups every week.",
    proposal: "I need the enterprise SSO feature this sprint. A deal depends on it.",
    proposalBy: "A VP messages you directly:",
    constraint:
      "The VP doesn't manage you, but is senior enough that engineering will likely listen if they push directly.",
    question: "What would you do?",
    prompts: [
      "What's actually being asked of you here?",
      "What would you want to understand before responding?",
      "How would you hold your position, if you do?",
      "What might you concede, and what would you protect?",
    ],
    criteria: [
      {
        id: "clarify-before-react",
        name: "Clarify before reacting",
        demonstrated: "You asked what's actually behind the request before agreeing or pushing back.",
        gap: "Find out the real deal size, timeline and risk before deciding whether it changes the sprint.",
        improved: "You got the specifics that would actually change the decision.",
        proof: "Clarify the real stakes before deciding",
      },
      {
        id: "hold-position-with-evidence",
        name: "Holding a position with evidence",
        demonstrated: "You referenced the data behind the current priority, not just your opinion.",
        gap: "Point back to what the onboarding data actually shows, so this isn't your word against theirs.",
        improved: "You defended the sprint with evidence, not just authority.",
        proof: "Defend a decision using evidence, not authority",
      },
      {
        id: "partial-response",
        name: "A real trade-off, not a flat no",
        demonstrated: "You looked for what could genuinely move without abandoning the sprint.",
        gap: "A flat “no” or a flat “yes” both skip the actual trade-off — what could ship partially, later, or in parallel?",
        improved: "You found a response that respected both priorities instead of picking a side outright.",
        proof: "Offer a real trade-off instead of a flat yes or no",
      },
      {
        id: "escalation-clarity",
        name: "Knowing when to escalate",
        demonstrated: "You named who actually needs to make this call if you can't resolve it directly.",
        gap: "Some conflicts genuinely aren't yours to resolve alone — say who should weigh in and why.",
        improved: "You recognised the limits of your own authority here.",
        proof: "Recognise when a decision needs to escalate",
      },
    ],
    attempt1Ids: ["clarify-before-react", "hold-position-with-evidence"],
    verifiedName: "Stakeholder Negotiation",
    introPanda: "No lesson before this one — let's see your instinct first. 🐼",
    attemptPanda:
      "You already know how to hold a position with data. Now do it with someone senior enough to just overrule you.",
    checkPanda:
      "You're already holding your ground with evidence instead of just opinion — that's a real strength. The PM step is finding the trade-off that protects the sprint without a flat no.",
    learnPanda:
      "Giving bad news factually is your instinct already. Stakeholder negotiation adds one thing: finding what can genuinely move, so it's not just your position against theirs.",
    retryPanda: "Good. Now find the version where nobody just wins or loses. 💪",
    lesson: {
      label: "2 min learn",
      title: "A senior push isn't automatically a priority change.",
      requested: "Ship enterprise SSO this sprint instead",
      pmQuestion: "What does the VP actually need — this sprint, or just before the deal closes?",
      possibilities: [
        "The deal closes in 2 weeks and truly needs SSO live",
        "The deal closes next quarter — there's more room than it sounds like",
        "A demo or roadmap commitment would satisfy the customer, not a shipped feature",
        "The VP is passing on pressure without knowing the onboarding data",
      ],
      principle:
        "A senior stakeholder pushing hard isn't automatically a priority change. It's a request for information you probably don't have yet.",
      framework: ["Request", "Real stakes", "Trade-off", "Decision"],
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
