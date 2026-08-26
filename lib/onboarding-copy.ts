/* ---------------------------------------------------------------------------
   What Panda says on the introduction screen.

   Authored copy, deliberately static. One core message carries the screen:
   "Panda knows I already have professional experience, and will help me find
   my gaps, practise what matters, and prove what I can do."

   Voice: friendly, professional, concise, career-focused. Never childish,
   never a generic chatbot, never more than one emoji.
--------------------------------------------------------------------------- */

export const onboardingCopy = {
  /** The headline of the introduction screen. */
  greeting: "Hi! I'm Panda 👋",
  /** The one line that has to land: who this is for, and where it goes. */
  journey: "Your buddy for the journey from QA to Product Management.",
  promise:
    "I'll help you focus on what matters and build your PM capabilities step by step.",
} as const;

/** The three benefit cards. `**bold**` marks the terms worth emphasising. */
export const ONBOARDING_BENEFITS = [
  {
    id: "gaps",
    title: "Find your gaps",
    body: "Know what to **Learn**, **Strengthen**, or mark **Demonstrated** based on what you already know.",
  },
  {
    id: "learn",
    title: "Help you learn",
    body: "Get simple explanations when you're stuck — without giving away the answer.",
  },
  {
    id: "proof",
    title: "Build your proof",
    body: "Turn **real-world challenges** into **evidence** of what you can actually do.",
  },
] as const;
