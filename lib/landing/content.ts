import type { LucideIcon } from "lucide-react";
import {
  Award,
  Briefcase,
  Compass,
  Map,
  Rocket,
  Shield,
  Sparkles,
  Target,
  Trophy,
  Users,
  Wrench,
} from "lucide-react";

/* ---------------------------------------------------------------------------
   Landing page content.

   Repeated cards render from these arrays rather than being hand-written five
   times each — the route steps, the skill rows, the benefit cards. Copy is
   reproduced verbatim from the brief; nothing here is placeholder text.
--------------------------------------------------------------------------- */

export type Accent = "amber" | "coral" | "lavender" | "teal" | "sky";

export interface JourneyCheckpoint {
  id: string;
  label: string;
  detail: string;
}

export const JOURNEY_CHECKPOINTS: JourneyCheckpoint[] = [
  { id: "discover", label: "Discover", detail: "See your strengths" },
  { id: "decide", label: "Decide", detail: "Make better choices" },
  { id: "build", label: "Build", detail: "Create real impact" },
];

export interface RouteStep {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: Accent;
}

export const ROUTE_STEPS: RouteStep[] = [
  {
    id: 1,
    title: "Take the diagnostic",
    description: "Answer 12 realistic workplace scenarios in 10–15 minutes.",
    icon: Compass,
    accent: "amber",
  },
  {
    id: 2,
    title: "Reveal your skill map",
    description: "Get a personalized snapshot of your strengths and development areas.",
    icon: Map,
    accent: "lavender",
  },
  {
    id: 3,
    title: "Follow weekly quests",
    description: "Build skills through practical challenges designed around your goals.",
    icon: Rocket,
    accent: "teal",
  },
];

export interface Skill {
  id: string;
  name: string;
  level: number;
  totalLevels: number;
  status: string;
  accent: Accent;
}

export const SKILLS: Skill[] = [
  { id: "ai-fluency", name: "AI fluency", level: 4, totalLevels: 5, status: "Strong", accent: "amber" },
  {
    id: "technical-collaboration",
    name: "Technical collaboration",
    level: 3,
    totalLevels: 5,
    status: "Developing",
    accent: "sky",
  },
  {
    id: "product-judgment",
    name: "Product judgment",
    level: 2,
    totalLevels: 5,
    status: "Developing",
    accent: "lavender",
  },
  {
    id: "building-with-tools",
    name: "Building with tools",
    level: 1,
    totalLevels: 5,
    status: "Just getting started",
    accent: "coral",
  },
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

export const SAMPLE_QUEST = {
  eyebrow: "Sample quest",
  title: "Help your team choose the right AI tool",
  description: "Compare tools, evaluate trade-offs and recommend what is best for your team.",
  minutes: 10,
  xp: 100,
  cta: "Try a sample quest →",
};

export const TESTIMONIAL = {
  quote:
    "PandaRoute helped me see my blind spots and gave me practical steps I could use immediately.",
  name: "Alex M.",
  role: "Product Manager",
  sampleLabel: "Sample",
};

export const NAV_LINKS = [
  { id: "how-it-works", label: "How it works", href: "#how-it-works" },
  { id: "skill-paths", label: "Skill paths", href: "#skill-map" },
  { id: "sample-quest", label: "Sample quest", href: "#sample-quest" },
  { id: "faq", label: "FAQ", href: "#faq" },
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

export const ACCENT_BORDER: Record<Accent, string> = {
  amber: "border-primary-strong/35",
  coral: "border-coral/30",
  lavender: "border-lavender/30",
  teal: "border-teal/30",
  sky: "border-sky/30",
};

export const ACCENT_LINE: Record<Accent, string> = {
  amber: "bg-primary",
  coral: "bg-coral",
  lavender: "bg-lavender",
  teal: "bg-teal",
  sky: "bg-sky",
};

export { Award, Sparkles, Users, Wrench };
