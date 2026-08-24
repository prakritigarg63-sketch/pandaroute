import { Cloud, Lightbulb, Scale, Star, Target, Timer, Users } from "lucide-react";

/* ---------------------------------------------------------------------------
   Thinking Quest content.

   Mission details and scoring categories live as data so the screen is a map
   over arrays rather than six near-identical blocks of markup, and so the copy
   can be changed without touching layout.

   The three accent colours tag the scoring categories. They are never the only
   signal: each category also carries its own icon and its own words.
--------------------------------------------------------------------------- */

export interface MissionDetail {
  id: string;
  icon: typeof Target;
  headline: string;
  sub: string;
  tone: "coral" | "lavender" | "sky" | "amber";
}

export const MISSION_DETAILS: MissionDetail[] = [
  { id: "scenarios", icon: Target, headline: "12", sub: "scenarios", tone: "coral" },
  { id: "minutes", icon: Timer, headline: "10–15", sub: "minutes", tone: "lavender" },
  { id: "saved", icon: Cloud, headline: "Progress", sub: "saved", tone: "sky" },
  { id: "experience", icon: Star, headline: "Experience", sub: "counts", tone: "amber" },
];

export interface ScoringCategory {
  id: string;
  icon: typeof Lightbulb;
  name: string;
  description: string;
  tone: "coral" | "lavender" | "sky";
}

export const SCORING_CATEGORIES: ScoringCategory[] = [
  {
    id: "clarity",
    icon: Lightbulb,
    name: "Clarity",
    description: "Define the real problem",
    tone: "coral",
  },
  {
    id: "judgment",
    icon: Scale,
    name: "Judgment",
    description: "Weigh trade-offs and risks",
    tone: "lavender",
  },
  {
    id: "collaboration",
    icon: Users,
    name: "Collaboration",
    description: "Work well with technical teams",
    tone: "sky",
  },
];

/** Icon tile colours, kept beside the data they dress. */
export const TONE: Record<string, string> = {
  coral: "bg-coral-soft text-coral",
  lavender: "bg-lavender-soft text-lavender",
  sky: "bg-sky-soft text-sky",
  amber: "bg-primary-soft text-quest-deep",
};

export const QUEST_COPY = {
  title: "Thinking Quest",
  level: "LVL 1",
  startingXp: "0 XP",
  eyebrow: "Your first mission",
  heading: "Navigate 12 realistic product decisions",
  standfirst:
    "Step into the role of a Product Manager and make choices that shape outcomes.",
  detailsLabel: "Mission details",
  scoringLabel: "How scoring works",
  noGrades: "No grades—discover your working style.",
  coach:
    "Choose what you'd genuinely do. Honest choices unlock a sharper skill map.",
  cta: "Accept mission →",
  ctaAccepted: "Mission accepted!",
  xpPromise: "Earn your first 120 XP",
  xpAward: "+120 XP",
} as const;

/** Awarded for finishing the diagnostic; shown here as the promise. */
export const MISSION_XP = 120;
