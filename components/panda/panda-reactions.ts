/* ---------------------------------------------------------------------------
   Panda's reactions.

   A reaction is a mood: it decides how Panda moves and whether the moment gets
   a glow. The message is separate, so the same reaction can carry different
   words on different screens. Everything here is deterministic — no model, no
   randomness — because a prototype has to say the same thing to every tester.

   Panda will reappear in the diagnostic, gap map, roadmap, challenge, retry and
   capability screens, so the cues live here rather than in any one screen.
--------------------------------------------------------------------------- */

export type PandaReaction =
  | "idle"
  | "welcome"
  | "thinking"
  | "helpful"
  | "celebrate"
  | "excited";

export interface PandaCue {
  reaction: PandaReaction;
  message?: string;
}

/** Motion class per reaction. The keyframes live in globals.css, next to the
 *  prefers-reduced-motion block that switches all of them off. */
export const REACTION_MOTION: Record<PandaReaction, string> = {
  idle: "",
  welcome: "panda-welcome",
  thinking: "panda-thinking",
  helpful: "panda-helpful",
  celebrate: "panda-celebrate",
  excited: "panda-excited",
};

/**
 * Artwork per reaction.
 *
 * Every entry points at the one mascot asset today. Drawn expressions drop in
 * here and nowhere else: add the file to public/ and change the line, and the
 * mascot picks it up with no other edit.
 */
export const REACTION_ART: Record<PandaReaction, string> = {
  idle: "/panda-mascot.png",
  welcome: "/panda-mascot.png",
  thinking: "/panda-mascot.png",
  helpful: "/panda-mascot.png",
  celebrate: "/panda-mascot.png",
  excited: "/panda-mascot.png",
};

/** How long each one-shot plays before Panda settles back to idle (ms). */
export const REACTION_MS: Record<PandaReaction, number> = {
  idle: 0,
  welcome: 620,
  thinking: 600,
  helpful: 380,
  celebrate: 560,
  excited: 460,
};

/** Reactions that get a soft ring behind Panda while they play. */
export const REACTION_GLOW: ReadonlySet<PandaReaction> = new Set<PandaReaction>([
  "thinking",
  "celebrate",
  "excited",
]);

/** How long a speech bubble stays up before it fades on its own. */
export const BUBBLE_MS = 3000;

/** First contact, played once when the onboarding screen mounts. */
export const WELCOME_CUE: PandaCue = {
  reaction: "welcome",
  message: "Hi! I'll help you find your route 👋",
};

/** Played on the way out, while the next screen is already being pushed. */
export const START_CUE: PandaCue = {
  reaction: "excited",
  message: "Let's find out what you already know! 🧭",
};

/** One benefit card, one cue. Keyed by the benefit ids in lib/onboarding-copy. */
export const CARD_CUES: Record<string, PandaCue> = {
  gaps: {
    reaction: "thinking",
    message: "I'll help you separate what to Learn, Practice, and Skip.",
  },
  learn: {
    reaction: "helpful",
    message: "Stuck? Ask me. I'll explain it without giving away the answer.",
  },
  proof: {
    reaction: "celebrate",
    message: "Every challenge you pass becomes proof of what you can do.",
  },
};

/**
 * The transition screen. Panda answers each choice the learner makes, then
 * sends them on — short lines, because that screen is mostly controls.
 */
export const TRANSITION_CUES: Record<"experience" | "timeline" | "build", PandaCue> = {
  experience: {
    reaction: "helpful",
    message:
      "Your experience matters. I'll make sure we don't waste time teaching you things you already know.",
  },
  timeline: {
    reaction: "celebrate",
    message: "Got it! I'll use this to shape your learning pace.",
  },
  build: {
    reaction: "excited",
    message: "Perfect. Now let's see what you already know. 🧭",
  },
};

/**
 * The diagnostic introduction. Both send-offs point at the learner's own
 * judgement rather than at a right answer, which is the rule Panda follows
 * from here on: before a genuine attempt, Panda may clarify and encourage, but
 * never reveals which option to choose, what the ideal response is, or what
 * the rubric rewards.
 */
export const DIAGNOSTIC_CUES: Record<"start" | "startAfterExplanation", PandaCue> = {
  start: {
    reaction: "helpful",
    message: "Just think through each situation naturally. You've got this.",
  },
  startAfterExplanation: {
    reaction: "excited",
    message: "Perfect. Trust your experience and think through each situation. 🐼",
  },
};

/**
 * Tapping Panda walks this list in order, one line per tap. The thread is
 * reassurance about experience already earned, ending on the invitation to
 * start — then it comes round again.
 */
export const TAP_CUES: readonly PandaCue[] = [
  { reaction: "helpful", message: "You're not starting from zero." },
  {
    reaction: "helpful",
    message: "Your QA experience already gives you a head start.",
  },
  { reaction: "thinking", message: "We'll focus only on what you need for PM." },
  { reaction: "excited", message: "Ready? Let's find your route 🧭" },
];
