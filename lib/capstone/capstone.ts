/* ---------------------------------------------------------------------------
   The capstone.

   One problem, several capabilities, and no prompt telling the learner which to
   use. Everything Panda says here is deliberately thinner than in a challenge:
   teacher, then coach, then observer.

   The evaluation is deterministic — the point of the prototype is to find out
   whether the shape of the thing reads as real PM work, not to grade prose.
--------------------------------------------------------------------------- */

export interface Signal {
  id: string;
  value: string;
  label: string;
}

export interface Quote {
  id: string;
  text: string;
}

export interface Behaviour {
  id: string;
  value: string;
  text: string;
}

export interface Verdict {
  id: string;
  name: string;
  level: "strong" | "developing";
  note: string;
}

export const CAPSTONE = {
  id: "ai-activation",
  label: "Final challenge",
  title: "Your PM Capstone 🚀",
  standfirst:
    "One realistic problem. Multiple PM capabilities. Less guidance from Panda.",
  challengeTitle: "Improve activation for an AI productivity product",
  scenario: [
    "You've joined the product team of an AI-powered workplace assistant.",
    "Sign-ups are growing, but only 22% of new users complete their first meaningful task.",
    "Leadership wants the team to improve activation.",
  ],
  goal: "Understand what might be preventing activation and recommend what the product team should do next.",

  /** The funnel the learner is handed. */
  metrics: [
    { id: "signups", value: "10,000", label: "Sign-ups" },
    { id: "onboarding", value: "61%", label: "Onboarding" },
    { id: "first-ai", value: "34%", label: "First AI use" },
    { id: "meaningful", value: "22%", label: "Meaningful task" },
    { id: "return", value: "11%", label: "7-day return" },
  ] as Signal[],

  /** The four the learner can flag as standing out. */
  signals: [
    { id: "onboarding", value: "61%", label: "Onboarding" },
    { id: "first-ai", value: "34%", label: "First AI use" },
    { id: "meaningful", value: "22%", label: "Meaningful task" },
    { id: "return", value: "11%", label: "7-day return" },
  ] as Signal[],

  quotes: [
    { id: "q1", text: "I opened it, but wasn't sure what I should ask." },
    {
      id: "q2",
      text: "The examples looked useful, but they weren't related to my work.",
    },
    { id: "q3", text: "I got an answer, but I didn't know whether I could trust it." },
  ] as Quote[],

  behaviours: [
    { id: "b1", value: "46%", text: "leave before entering their first prompt." },
    { id: "b2", value: "38%", text: "of first prompts are rewritten at least twice." },
    {
      id: "b3",
      value: "2.7×",
      text: "more likely to return if they complete one meaningful task.",
    },
  ] as Behaviour[],

  framework: [
    { id: "user", name: "User", question: "Who is experiencing the problem?" },
    { id: "situation", name: "Situation", question: "When does it happen?" },
    { id: "problem", name: "Problem", question: "What are they struggling with?" },
    { id: "impact", name: "Impact", question: "Why does it matter?" },
  ],

  statementTemplate:
    "[User] struggles to ______ when ______ because ______, resulting in ______.",

  statementExample:
    "New users struggle to complete their first meaningful task when they don't know what to ask, because the value isn't clear — resulting in low activation and retention.",

  metricOptions: [
    "First meaningful task completion",
    "Activation rate",
    "Time to first value",
    "7-day retention",
  ],

  /** The capabilities the review screen says it is looking at. */
  reviewed: [
    { id: "discovery", icon: "💡", name: "Problem Discovery" },
    { id: "evidence", icon: "📊", name: "Evidence Interpretation" },
    { id: "framing", icon: "🎯", name: "Problem Framing" },
    { id: "prioritization", icon: "⚖️", name: "Prioritization" },
    { id: "solution", icon: "💡", name: "Solution Thinking" },
    { id: "metrics", icon: "📈", name: "Metrics" },
  ],

  /** Deterministic verdicts. Prioritization is the one left developing. */
  verdicts: [
    {
      id: "problem-framing",
      name: "Problem Framing",
      level: "strong",
      note: "You connected behavioural data and user evidence before defining the problem.",
    },
    {
      id: "metrics-reasoning",
      name: "Metrics Reasoning",
      level: "strong",
      note: "Your success metric connects directly to the activation problem.",
    },
    {
      id: "evidence-decisions",
      name: "Evidence-Based Decisions",
      level: "strong",
      note: "Your recommendation was supported by multiple signals.",
    },
    {
      id: "prioritization",
      name: "Prioritization",
      level: "developing",
      note: "Your selected solution is reasonable, but the trade-off against alternatives could be stronger.",
    },
    {
      id: "product-discovery",
      name: "Product Discovery",
      level: "strong",
      note: "You investigated the underlying need rather than accepting the initial problem at face value.",
    },
  ] as Verdict[],

  proof: {
    id: "ai-activation-case",
    title: "AI Product Activation Case",
    badge: "Capstone · Completed",
    challenge: "Improve activation for an AI productivity product.",
    demonstrated: [
      "Analysed activation behaviour",
      "Synthesised qualitative and quantitative evidence",
      "Framed the user problem",
      "Prioritised a product direction",
      "Defined success metrics",
    ],
    chips: [
      "Discovery",
      "Problem Framing",
      "Metrics",
      "Prioritization",
      "AI Thinking",
      "Stakeholders",
    ],
  },

  /** Panda, stepping back. One short line per step, none where none is needed. */
  panda: {
    intro:
      "This time, I won't tell you which skill to use. Decide how you'd approach it — just like real PM work.",
    step1: "No hints this time. Trust your process.",
    step2: null,
    step3: "I'm here — but this decision is yours.",
    step4: null,
    step5: "Last step. Connect your solution back to the outcome you want to create.",
    review:
      "I'm checking whether your decisions connect — not whether they match one perfect answer.",
    feedback:
      "This is much closer to real PM work: several skills, one decision, and no obvious answer.",
    complete:
      "You started by learning individual PM skills. Now you've shown you can connect them.",
    proof: "This proof shows how you think like a PM — not just what concepts you've studied.",
    readiness:
      "You now have evidence of where you're strong — and clarity on what still needs work.",
    next: "The learning route isn't the destination. The goal is being able to show what you can do.",
  },
} as const;

export const CAPSTONE_STEPS = 5;

export const STEP_TITLES = [
  "Start with the problem 🔍",
  "Here's what you discovered",
  "Turn evidence into a problem 🎯",
  "What would you try? 💡",
  "How will you know it worked? 📊",
];
