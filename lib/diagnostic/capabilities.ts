/* ---------------------------------------------------------------------------
   The PM capabilities Pandaroute maps.

   Twelve capabilities, one per diagnostic scenario. Each carries two sentences
   written from the learner's side: what they already bring, and what the step
   up to PM actually is. The Gap Map composes its copy from those rather than
   storing three near-identical paragraphs per capability.

   Nothing here is a score. A capability is Learn, Practice or Skip, and the
   words say why in terms of QA experience, never in terms of marks.
--------------------------------------------------------------------------- */

export type Classification = "learn" | "practice" | "skip";

export interface Capability {
  id: string;
  name: string;
  /** What the learner already brings when they show evidence here. */
  strength: string;
  /** The step from where they are to PM-level work. */
  gap: string;
  /** The concrete thing to do next. */
  nextStep: string;
}

export const CAPABILITIES: Capability[] = [
  {
    id: "api-reasoning",
    name: "API Reasoning",
    strength: "read technical context without needing it translated",
    gap: "deciding which technical detail actually matters to a product decision",
    nextStep: "Work a real integration failure end to end, from symptom to customer impact.",
  },
  {
    id: "product-discovery",
    name: "Product Discovery",
    strength: "notice when a requested solution doesn't match the reported problem",
    gap: "staying with the problem long enough to find what is really blocking people",
    nextStep: "Take a feature request apart and rebuild it as a problem statement.",
  },
  {
    id: "prioritization",
    name: "Prioritization",
    strength: "weigh urgency against evidence rather than volume",
    gap: "making the trade-off explicit so other people can argue with it",
    nextStep: "Defend one sequencing decision against a loud, plausible alternative.",
  },
  {
    id: "agile-delivery",
    name: "Agile & Delivery",
    strength: "work inside sprints, estimates and dependencies every day",
    gap: "shaping scope with engineering rather than receiving it",
    nextStep: "Cut an eight-week estimate into something shippable without breaking it.",
  },
  {
    id: "stakeholder-communication",
    name: "Stakeholder Communication",
    strength: "give bad news early and factually",
    gap: "holding a position with a stakeholder who outranks you",
    nextStep: "Renegotiate a commitment someone else made on your behalf.",
  },
  {
    id: "product-metrics",
    name: "Metrics & Analytics",
    strength: "spot when numbers and behaviour disagree",
    gap: "reading a funnel well enough to know where to look first",
    nextStep: "Trace a conversion drop to the step where behaviour actually changed.",
  },
  {
    id: "experimentation",
    name: "Experimentation",
    strength: "design a test that isolates one variable",
    gap: "stating the hypothesis and the decision the result will drive",
    nextStep: "Write an experiment brief someone else could run without asking you anything.",
  },
  {
    id: "retention",
    name: "Retention",
    strength: "follow a user through a flow rather than judging a single screen",
    gap: "telling a discovery problem apart from a value problem",
    nextStep: "Diagnose a feature that people try once and never return to.",
  },
  {
    id: "ai-product-thinking",
    name: "AI Product Thinking",
    strength: "ask what a feature is for before asking how it works",
    gap: "turning pressure to 'add AI' back into a user problem worth solving",
    nextStep: "Turn an AI mandate into a problem statement and a way to test it.",
  },
  {
    id: "ai-reliability",
    name: "AI Reliability",
    strength: "think in failure modes, which is exactly what this needs",
    gap: "deciding what accuracy is good enough, and what happens when it isn't",
    nextStep: "Set the evaluation bar and the fallback for a feature that is sometimes wrong.",
  },
  {
    id: "user-evidence",
    name: "User Evidence",
    strength: "treat a handful of reports as a signal, not a mandate",
    gap: "sizing a request before it becomes a roadmap item",
    nextStep: "Turn five feature requests into evidence a roadmap decision can rest on.",
  },
  {
    id: "role-clarity",
    name: "PM & Engineering Roles",
    strength: "know the difference between a requirement and an implementation",
    gap: "holding the problem while engineering owns the solution",
    nextStep: "Brief an engineer on a problem without naming the solution once.",
  },
];

export const CAPABILITY_BY_ID = new Map(CAPABILITIES.map((c) => [c.id, c]));

/** Gap Map row copy — one line, in the learner's terms. */
export function summaryFor(capability: Capability, classification: Classification): string {
  switch (classification) {
    case "learn":
      return `Build the foundation: ${capability.gap}.`;
    case "practice":
      return `You already ${capability.strength} — apply it more.`;
    case "skip":
      return `Your QA experience already covers this.`;
  }
}

/** The "why this is Practice" paragraph on the capability detail. */
export function reasonFor(capability: Capability, classification: Classification): string {
  switch (classification) {
    case "learn":
      return `Your answers point at ${capability.gap}. That is worth building properly rather than picking up on the way — so it starts your route.`;
    case "practice":
      return `You already ${capability.strength}. The step from here is ${capability.gap}, which is practice rather than learning from scratch.`;
    case "skip":
      return `You already ${capability.strength}, and your answers showed it. No reason to start from zero on something your QA work has been doing all along.`;
  }
}

export const CLASSIFICATION_LABEL: Record<Classification, string> = {
  learn: "Learn",
  practice: "Practice",
  skip: "Skip",
};

export const CLASSIFICATION_MEANING: Record<Classification, string> = {
  learn: "Build the foundation",
  practice: "You know some of this — apply it more",
  skip: "Existing experience already covers this",
};
