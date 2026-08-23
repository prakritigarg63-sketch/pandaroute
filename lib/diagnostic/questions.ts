/* ---------------------------------------------------------------------------
   The twelve scenarios.

   Each one is a situation a PM meets in a week, not a definition to recall.
   The options are all things a reasonable person does — the difference between
   them is how much of the problem gets understood before something happens.

   `evidence` is how much PM-level judgement an option shows: 2 strong,
   1 partial, 0 low. It never reaches the learner. It only decides whether a
   capability lands in Learn, Practice or Skip.

   `hint` is Panda's thinking prompt. It points at the kind of thinking the
   scenario asks for and never at an option — the guardrail in AGENTS.md.
--------------------------------------------------------------------------- */

export interface AnswerOption {
  id: "a" | "b" | "c" | "d";
  label: string;
  evidence: 0 | 1 | 2;
}

export interface DiagnosticQuestion {
  id: string;
  /** Capability this scenario maps to. */
  capabilityId: string;
  /** Small tag above the scenario. */
  tag: string;
  scenario: string;
  context?: string;
  prompt: string;
  options: AnswerOption[];
  hint: string;
}

export const QUESTIONS: DiagnosticQuestion[] = [
  {
    id: "q1",
    capabilityId: "api-reasoning",
    tag: "Tech & AI",
    scenario:
      "Engineering says a third-party integration has started returning 401 errors after the latest release.",
    context: "The release is important for a customer demo tomorrow.",
    prompt: "What would you do first as the PM?",
    options: [
      { id: "a", label: "Ask engineering to fix the API immediately", evidence: 0 },
      { id: "b", label: "Roll back the entire release", evidence: 1 },
      {
        id: "c",
        label:
          "Understand what changed, which requests are affected, and the business impact before deciding",
        evidence: 2,
      },
      { id: "d", label: "Tell Sales the feature will be delayed", evidence: 0 },
    ],
    hint: "Focus on understanding before jumping to a solution.",
  },
  {
    id: "q2",
    capabilityId: "product-discovery",
    tag: "Product Discovery",
    scenario:
      "Users are abandoning a workflow halfway through. A stakeholder suggests adding another button.",
    prompt: "What would you do first?",
    options: [
      { id: "a", label: "Add the button — it is a small change and the stakeholder asked", evidence: 0 },
      {
        id: "b",
        label: "Watch where people stop and find out what they were trying to do at that step",
        evidence: 2,
      },
      { id: "c", label: "Run a survey asking users what features they want", evidence: 1 },
      { id: "d", label: "Redesign the whole workflow", evidence: 0 },
    ],
    hint: "Think about the problem before the feature.",
  },
  {
    id: "q3",
    capabilityId: "prioritization",
    tag: "Prioritization",
    scenario:
      "Sales wants an enterprise reporting feature for a large prospect, while research shows many existing customers struggle with onboarding.",
    prompt: "How would you decide what comes next?",
    options: [
      { id: "a", label: "Build the reporting feature — the deal is worth the most money", evidence: 0 },
      { id: "b", label: "Fix onboarding, because more customers are affected", evidence: 1 },
      {
        id: "c",
        label:
          "Compare the evidence behind each, what it costs to be wrong, and which one moves the strategy",
        evidence: 2,
      },
      { id: "d", label: "Split the team and do both at half speed", evidence: 0 },
    ],
    hint: "Consider impact, evidence and strategy together.",
  },
  {
    id: "q4",
    capabilityId: "agile-delivery",
    tag: "Delivery",
    scenario:
      "Engineering says a planned feature will take eight weeks because of technical dependencies.",
    prompt: "What is your next move?",
    options: [
      { id: "a", label: "Ask them to find a way to do it in four", evidence: 0 },
      {
        id: "b",
        label:
          "Work through the dependencies with them and find the smallest version that still solves the problem",
        evidence: 2,
      },
      { id: "c", label: "Accept the estimate and move the date", evidence: 1 },
      { id: "d", label: "Escalate to their manager", evidence: 0 },
    ],
    hint: "Scope is a conversation, not a verdict.",
  },
  {
    id: "q5",
    capabilityId: "stakeholder-communication",
    tag: "Stakeholders",
    scenario:
      "Marketing announced a feature for next month, but engineering says delivery is now at risk.",
    prompt: "What would you do?",
    options: [
      { id: "a", label: "Push the team to hit the announced date", evidence: 0 },
      {
        id: "b",
        label:
          "Tell marketing now, with what is at risk, what is still certain, and the options for the date",
        evidence: 2,
      },
      { id: "c", label: "Wait a week to see whether the team catches up", evidence: 0 },
      { id: "d", label: "Cut scope quietly so the date holds", evidence: 1 },
    ],
    hint: "Bad news travels best early and specifically.",
  },
  {
    id: "q6",
    capabilityId: "product-metrics",
    tag: "Product Metrics",
    scenario:
      "Signup conversion dropped from 42% to 31% after a new onboarding experience was released.",
    prompt: "What would you investigate first?",
    options: [
      { id: "a", label: "Ask design to redesign onboarding", evidence: 0 },
      {
        id: "b",
        label: "Compare user behaviour before and after the release and find where the drop occurs",
        evidence: 2,
      },
      { id: "c", label: "Add more tooltips", evidence: 0 },
      { id: "d", label: "Increase marketing traffic to make up the difference", evidence: 0 },
    ],
    hint: "Look for where behaviour changed.",
  },
  {
    id: "q7",
    capabilityId: "experimentation",
    tag: "Experimentation",
    scenario: "You believe changing the signup CTA could improve activation.",
    prompt: "How would you set this up?",
    options: [
      { id: "a", label: "Change it and watch the weekly numbers", evidence: 0 },
      {
        id: "b",
        label:
          "Write what you expect to change and why, then test one variant against the current one",
        evidence: 2,
      },
      { id: "c", label: "Test four variants at once to save time", evidence: 1 },
      { id: "d", label: "Ask the team which wording they prefer", evidence: 0 },
    ],
    hint: "An experiment needs a decision waiting on it.",
  },
  {
    id: "q8",
    capabilityId: "retention",
    tag: "Retention",
    scenario:
      "A new feature has 70% discovery, 35% first-time usage, and 8% repeat usage.",
    prompt: "Where would you investigate first?",
    options: [
      { id: "a", label: "Discovery — more people should see it", evidence: 0 },
      {
        id: "b",
        label: "The gap between trying it once and coming back, since that is where value is lost",
        evidence: 2,
      },
      { id: "c", label: "Promote it harder in-app", evidence: 0 },
      { id: "d", label: "First-time usage, by simplifying the entry point", evidence: 1 },
    ],
    hint: "Each step of the drop tells a different story.",
  },
  {
    id: "q9",
    capabilityId: "ai-product-thinking",
    tag: "AI Product Thinking",
    scenario:
      "Your team wants to add an AI assistant. Leadership says, “Everyone is adding AI. We should too.”",
    prompt: "What should happen first?",
    options: [
      { id: "a", label: "Select an LLM provider", evidence: 0 },
      { id: "b", label: "Build a chatbot prototype", evidence: 1 },
      {
        id: "c",
        label: "Identify a specific user problem where AI could create meaningful value",
        evidence: 2,
      },
      { id: "d", label: "Hire an AI engineer", evidence: 0 },
    ],
    hint: "Start with the user problem, not the technology.",
  },
  {
    id: "q10",
    capabilityId: "ai-reliability",
    tag: "AI Reliability",
    scenario:
      "An AI feature works well most of the time but occasionally provides incorrect information.",
    prompt: "How would you handle it?",
    options: [
      { id: "a", label: "Ship it — most answers are fine", evidence: 0 },
      {
        id: "b",
        label:
          "Decide what accuracy is good enough for this use, measure against it, and design what happens when it is wrong",
        evidence: 2,
      },
      { id: "c", label: "Remove the feature until it is perfect", evidence: 0 },
      { id: "d", label: "Add a disclaimer that answers may be inaccurate", evidence: 1 },
    ],
    hint: "Think in failure modes and what they cost.",
  },
  {
    id: "q11",
    capabilityId: "user-evidence",
    tag: "User Evidence",
    scenario: "Five users request dark mode and a stakeholder wants it added to the roadmap.",
    prompt: "What would you do?",
    options: [
      { id: "a", label: "Add it — five requests is a clear signal", evidence: 0 },
      {
        id: "b",
        label:
          "Find out how many users this affects and what it costs, then decide against the other work",
        evidence: 2,
      },
      { id: "c", label: "Decline it as a nice-to-have", evidence: 1 },
      { id: "d", label: "Put it to a public vote", evidence: 0 },
    ],
    hint: "Five voices are a signal, not a size.",
  },
  {
    id: "q12",
    capabilityId: "role-clarity",
    tag: "Working with Engineering",
    scenario:
      "Engineering asks exactly how they should implement a feature. You understand the user problem but aren't sure about the best technical implementation.",
    prompt: "What would you do?",
    options: [
      { id: "a", label: "Give your best guess so the team is not blocked", evidence: 0 },
      {
        id: "b",
        label:
          "Be clear on the problem, the constraints and how you will judge the result, and leave the approach to them",
        evidence: 2,
      },
      { id: "c", label: "Ask another PM what they would build", evidence: 0 },
      { id: "d", label: "Research the implementation yourself before answering", evidence: 1 },
    ],
    hint: "You own the problem; they own the solution.",
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;

export function questionAt(index: number): DiagnosticQuestion | undefined {
  return QUESTIONS[index];
}
