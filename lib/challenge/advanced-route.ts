/* ---------------------------------------------------------------------------
   The Advanced Route.

   Where "Build my advanced route" leads: real, specific content — not a
   redirect into the same beginner curriculum. Every entry here is ambiguity,
   trade-offs and judgment calls, the opposite of what Learn/Strengthen
   teaches. A learner who's demonstrated the foundation never sees this
   content reframed as a lesson.
--------------------------------------------------------------------------- */

export type AdvancedDifficulty = "Advanced" | "Expert";

export interface AdvancedChallenge {
  id: string;
  category: string;
  prompt: string;
  difficulty: AdvancedDifficulty;
  minutes: number;
  xp: number;
  boss?: boolean;
}

export const ADVANCED_ROUTE: AdvancedChallenge[] = [
  {
    id: "product-judgment",
    category: "Product Judgment",
    prompt: "Prioritize features when engineering capacity is limited.",
    difficulty: "Advanced",
    minutes: 15,
    xp: 200,
  },
  {
    id: "metrics-ambiguity",
    category: "Metrics Under Ambiguity",
    prompt: "Choose a north-star metric when stakeholders disagree.",
    difficulty: "Advanced",
    minutes: 15,
    xp: 200,
  },
  {
    id: "ai-discovery",
    category: "AI-Assisted Product Discovery",
    prompt: "Turn conflicting user evidence into a product recommendation.",
    difficulty: "Advanced",
    minutes: 20,
    xp: 250,
  },
  {
    id: "ship-or-kill",
    category: "Ship or Kill?",
    prompt: "Decide whether a struggling feature deserves another iteration.",
    difficulty: "Expert",
    minutes: 25,
    xp: 500,
    boss: true,
  },
];

/** Total XP the route represents, shown once rather than summed inline. */
export const ADVANCED_ROUTE_XP = ADVANCED_ROUTE.reduce((sum, c) => sum + c.xp, 0);
