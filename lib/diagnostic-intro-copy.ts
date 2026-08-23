/* ---------------------------------------------------------------------------
   What Panda says on the diagnostic introduction.

   This screen has one job: explain why the diagnostic exists and make an
   experienced professional comfortable starting it.

   The words are chosen against a rule. This is not an exam, and nothing here
   may read like one — no "test your knowledge", no "score", no "pass", no "are
   you PM ready". The diagnostic decides what to teach, and the copy has to say
   so plainly, or the learner arrives at question one braced for judgement.
--------------------------------------------------------------------------- */

export interface PandaLine {
  /** The bold opener of a message. */
  lead: string;
  /** The rest of it. `**bold**` marks the terms worth emphasising. */
  body: string;
}

export const OPENING: readonly PandaLine[] = [
  {
    lead: "Your QA experience already gives you a head start.",
    body: "You've built skills in problem-solving, requirements, Agile, and working with tech teams. We won't make you start from zero.",
  },
  {
    lead: "Now, let's find your actual gaps. 🧭",
    body: "A short diagnostic will help me understand what you should **Learn**, **Practice**, or **Skip** on your route to PM.",
  },
];

export const EXPLANATION: readonly PandaLine[] = [
  {
    lead: "I'll give you real workplace scenarios — not textbook questions.",
    body: "There are no grades. I'm looking at **how you think and approach problems** so I can personalize your route.",
  },
];

export const EXPLANATION_POINTS = [
  {
    id: "think",
    icon: "🧠",
    title: "Think",
    body: "Work through realistic PM situations.",
  },
  {
    id: "map",
    icon: "🧭",
    title: "Map",
    body: "I'll identify what you should Learn, Practice, or Skip.",
  },
  {
    id: "personalize",
    icon: "🎯",
    title: "Personalize",
    body: "Your results shape your Pandaroute roadmap.",
  },
] as const;

/** Sets expectations right before the commitment, where it does the most good. */
export const DIAGNOSTIC_FACTS = "About 10–15 min · Your progress is saved";
