/* ---------------------------------------------------------------------------
   Motion tokens.

   One vocabulary for every reveal on the landing page: two easings, three
   durations, three travel distances. Building variants from these rather than
   one-off numbers is what keeps forty animated elements feeling like one
   system instead of forty decisions.
--------------------------------------------------------------------------- */

export const motionTokens = {
  duration: { fast: 0.18, normal: 0.35, slow: 0.55 },
  easing: {
    standard: [0.22, 1, 0.36, 1],
    gentle: [0.16, 1, 0.3, 1],
  },
  distance: { small: 8, medium: 20, large: 32 },
} as const;

/** Fade + rise, the one shape most sections enter with. */
export const riseIn = {
  hidden: { opacity: 0, y: motionTokens.distance.medium },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: motionTokens.duration.normal, ease: motionTokens.easing.standard },
  },
};

/** Wraps a group of riseIn children with a stagger. */
export function staggerContainer(gap = 0.12, delayChildren = 0) {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: gap, delayChildren },
    },
  };
}

/** Scale + fade, for badges, icons and checkpoints settling into place. */
export const popIn = {
  hidden: { opacity: 0, scale: 0.85 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: motionTokens.duration.normal, ease: motionTokens.easing.gentle },
  },
};

/** Viewport trigger shared by every scroll reveal: fires once, a bit early. */
export const revealOnce = { once: true, amount: 0.35, margin: "0px 0px -80px 0px" };
