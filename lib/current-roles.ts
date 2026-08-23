/* ---------------------------------------------------------------------------
   Starting roles.

   Pandaroute validates one transition — QA / Test Analyst → Product Manager —
   and the list below is how the screen says so honestly: the other routes are
   visible because they are planned, and locked because they do not work yet.
   A disabled row is a roadmap, not a broken control.

   Which locked roles get tapped is the signal for what to build next, so every
   tap is tracked with its id.
--------------------------------------------------------------------------- */

export interface CurrentRoleOption {
  id: string;
  label: string;
  enabled: boolean;
}

/** The only selectable starting role in this MVP. */
export const CURRENT_ROLE_ID = "qa-test-analyst";

export const CURRENT_ROLE_OPTIONS: CurrentRoleOption[] = [
  { id: CURRENT_ROLE_ID, label: "QA / Test Analyst", enabled: true },
  { id: "automation-engineer", label: "Automation Engineer", enabled: false },
  { id: "sdet", label: "SDET / QA Engineer", enabled: false },
  { id: "manual-tester", label: "Manual Tester", enabled: false },
  { id: "performance-tester", label: "Performance Tester", enabled: false },
  { id: "quality-engineer", label: "Quality Engineer", enabled: false },
  { id: "qa-lead", label: "QA Lead / QA Manager", enabled: false },
  { id: "business-analyst", label: "Business Analyst", enabled: false },
  { id: "technical-support", label: "Technical Support", enabled: false },
  { id: "operations", label: "Operations Professional", enabled: false },
  { id: "other", label: "Other", enabled: false },
];

/** Shown when someone taps a route that isn't built yet. */
export const UNAVAILABLE_NOTE =
  "Coming soon. Pandaroute currently supports QA / Test Analyst → Product Manager.";
