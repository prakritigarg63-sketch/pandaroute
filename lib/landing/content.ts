import type { LucideIcon } from "lucide-react";
import { Briefcase, Shield, Target, Trophy } from "lucide-react";

/* ---------------------------------------------------------------------------
   Landing page content.

   Repeated items render from these arrays rather than being hand-written —
   the journey milestones, the benefit cards. Nothing here is placeholder
   text, and nothing is an invented metric or testimonial.
--------------------------------------------------------------------------- */

export type Accent = "amber" | "coral" | "lavender" | "teal" | "sky";

export interface JourneyMilestone {
  id: string;
  label: string;
  detail: string;
}

/** The four stops under the hero. The first is where every visitor stands. */
export const JOURNEY_MILESTONES: JourneyMilestone[] = [
  { id: "discover", label: "Discover", detail: "How you think" },
  { id: "map", label: "Map", detail: "Your strengths & gaps" },
  { id: "learn", label: "Learn", detail: "At your pace" },
  { id: "apply", label: "Apply", detail: "In real life" },
];

export interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: Accent;
}

export const BENEFITS: Benefit[] = [
  {
    id: "scenarios",
    title: "Real workplace scenarios",
    description: "Tackle situations professionals actually face—not textbook questions.",
    icon: Briefcase,
    accent: "amber",
  },
  {
    id: "quests",
    title: "Personalized quests",
    description: "Get focused challenges that close your unique skill gaps.",
    icon: Target,
    accent: "coral",
  },
  {
    id: "xp",
    title: "XP and milestones",
    description: "Earn XP, unlock badges and see your growth over time.",
    icon: Trophy,
    accent: "lavender",
  },
  {
    id: "proof",
    title: "Build proof of skill",
    description: "Collect evidence and achievements that demonstrate progress.",
    icon: Shield,
    accent: "teal",
  },
];

export const FOOTER_LINKS = [
  { id: "how-it-works", label: "How it works", href: "#how-it-works" },
  { id: "about", label: "About", href: "#" },
  { id: "faq", label: "FAQ", href: "#faq" },
  { id: "privacy", label: "Privacy", href: "#" },
];

/** Icon tile colours. Amber stays the product; the rest only ever tag content. */
export const ACCENT_TILE: Record<Accent, string> = {
  amber: "bg-primary-soft text-primary-ink",
  coral: "bg-coral-soft text-coral",
  lavender: "bg-lavender-soft text-lavender",
  teal: "bg-teal-soft text-teal",
  sky: "bg-sky-soft text-sky",
};
