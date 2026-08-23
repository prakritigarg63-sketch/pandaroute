"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BUBBLE_MS,
  REACTION_MS,
  type PandaCue,
  type PandaReaction,
} from "@/components/panda/panda-reactions";

interface PandaCueState {
  /** What triggered the current cue — a card id, "panda", "start". */
  source: string | null;
  reaction: PandaReaction;
  message?: string;
}

const RESTING: PandaCueState = { source: null, reaction: "idle" };

/**
 * Owns Panda's current cue and the two timers that end it: the motion settles
 * back to idle quickly, the bubble lingers a few seconds longer.
 *
 * The screen calls `play` / `toggle` and renders whatever comes back — one
 * source of truth, so a bubble can never outlive the state that put it there.
 */
export function usePandaCue() {
  const [state, setState] = useState<PandaCueState>(RESTING);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const play = useCallback(
    (source: string, cue: PandaCue) => {
      clearTimers();
      setState({ source, reaction: cue.reaction, message: cue.message });

      const settle = REACTION_MS[cue.reaction];
      if (settle > 0) {
        timers.current.push(
          window.setTimeout(
            () => setState((s) => (s.source === source ? { ...s, reaction: "idle" } : s)),
            settle,
          ),
        );
      }

      if (cue.message) {
        timers.current.push(
          window.setTimeout(
            () => setState((s) => (s.source === source ? RESTING : s)),
            BUBBLE_MS,
          ),
        );
      }
    },
    [clearTimers],
  );

  const clear = useCallback(() => {
    clearTimers();
    setState(RESTING);
  }, [clearTimers]);

  /** Tapping the same source again while it is still talking dismisses it. */
  const toggle = useCallback(
    (source: string, cue: PandaCue) => {
      if (state.source === source) clear();
      else play(source, cue);
    },
    [state.source, clear, play],
  );

  return { ...state, play, toggle, clear };
}
