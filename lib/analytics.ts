/* ---------------------------------------------------------------------------
   Prototype analytics.

   A capped ring of events in localStorage — no network, no third party. The
   point is to answer "did testers open the explanation before starting?" from
   a device we can pick up, not to build a pipeline.
--------------------------------------------------------------------------- */

export type PrototypeEvent =
  | "diagnostic_intro_viewed"
  | "diagnostic_how_it_works_opened"
  | "diagnostic_started"
  | "diagnostic_intro_abandoned";

export interface TrackedEvent {
  name: PrototypeEvent;
  at: number;
  detail?: Record<string, string | number | boolean>;
}

const STORAGE_KEY = "pandaroute:events:v1";
const MAX_EVENTS = 200;

function available(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readEvents(): TrackedEvent[] {
  if (!available()) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as TrackedEvent[]) : [];
  } catch {
    return [];
  }
}

export function track(
  name: PrototypeEvent,
  detail?: TrackedEvent["detail"],
): void {
  if (!available()) return;

  try {
    const events = [...readEvents(), { name, at: Date.now(), detail }];
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(events.length > MAX_EVENTS ? events.slice(-MAX_EVENTS) : events),
    );
  } catch {
    // Analytics must never be the reason a screen fails.
  }
}
