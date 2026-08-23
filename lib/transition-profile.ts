/* ---------------------------------------------------------------------------
   The learner's transition context.

   Two answers, stored so the rest of Pandaroute can use them: experience tells
   the diagnostic how much to credit rather than teach, and the timeline sets
   the pace the roadmap suggests. Nothing here personalises anything yet — the
   job now is to capture it in a shape later screens can read without guessing.

   localStorage access is isolated behind SSR and throw guards: touching
   localStorage during prerender is a build failure, not a warning.
--------------------------------------------------------------------------- */

export const CURRENT_ROLE = "QA / Test Analyst";
export const TARGET_ROLE = "Product Manager";

export type ExperienceRange = "0-2" | "3-5" | "6-8" | "9+";
export type TransitionTimeline = "3-months" | "6-months" | "12-months" | "exploring";

export interface TransitionProfile {
  currentRole: typeof CURRENT_ROLE;
  targetRole: typeof TARGET_ROLE;
  experienceRange: ExperienceRange | null;
  transitionTimeline: TransitionTimeline | null;
}

export const EXPERIENCE_OPTIONS: Array<{ id: ExperienceRange; label: string }> = [
  { id: "0-2", label: "0–2 years" },
  { id: "3-5", label: "3–5 years" },
  { id: "6-8", label: "6–8 years" },
  { id: "9+", label: "9+ years" },
];

export const TIMELINE_OPTIONS: Array<{ id: TransitionTimeline; label: string }> = [
  { id: "3-months", label: "Within 3 months" },
  { id: "6-months", label: "Within 6 months" },
  { id: "12-months", label: "Within 12 months" },
  { id: "exploring", label: "Just exploring" },
];

const STORAGE_KEY = "pandaroute:onboarding:v1";
const STORAGE_VERSION = 1;

export const EMPTY_PROFILE: TransitionProfile = {
  currentRole: CURRENT_ROLE,
  targetRole: TARGET_ROLE,
  experienceRange: null,
  transitionTimeline: null,
};

function available(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/** Only ids the screen actually offers survive a read — a stale or hand-edited
 *  value must not light up a chip that no longer exists. */
function pick<T extends string>(value: unknown, allowed: readonly { id: T }[]): T | null {
  return allowed.some((option) => option.id === value) ? (value as T) : null;
}

export function loadTransitionProfile(): TransitionProfile {
  if (!available()) return EMPTY_PROFILE;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROFILE;

    const parsed = JSON.parse(raw) as Partial<TransitionProfile>;
    return {
      ...EMPTY_PROFILE,
      experienceRange: pick(parsed.experienceRange, EXPERIENCE_OPTIONS),
      transitionTimeline: pick(parsed.transitionTimeline, TIMELINE_OPTIONS),
    };
  } catch {
    return EMPTY_PROFILE;
  }
}

export function saveTransitionProfile(profile: TransitionProfile): void {
  if (!available()) return;

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: STORAGE_VERSION, ...profile }),
    );
  } catch {
    // A full or blocked store must not take the screen down with it.
  }
}
