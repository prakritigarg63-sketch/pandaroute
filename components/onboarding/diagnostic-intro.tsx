"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StepDots } from "@/components/ui/StepDots";
import { PandaMessage } from "@/components/panda/panda-message";
import { PandaMascot } from "@/components/panda/panda-mascot";
import { PandaAside } from "@/components/panda/panda-aside";
import { usePandaCue } from "@/components/panda/use-panda-cue";
import { DIAGNOSTIC_CUES } from "@/components/panda/panda-reactions";
import { useDiagnosticIntroState } from "@/lib/use-diagnostic-intro-state";
import { track } from "@/lib/analytics";
import {
  DIAGNOSTIC_FACTS,
  EXPLANATION,
  EXPLANATION_POINTS,
  OPENING,
} from "@/lib/diagnostic-intro-copy";

/**
 * The diagnostic introduction.
 *
 * The bridge between "here is your route" and the first question, and the last
 * chance to set the frame: the diagnostic decides what to teach, it does not
 * grade anyone. An experienced professional who arrives here expecting an exam
 * answers differently than one who knows we are looking at how they think.
 *
 * The conversation is authored, not generated, so the second message follows
 * the first by a beat rather than a typing indicator — long enough to read as
 * a reply, short enough that nobody waits to read the screen.
 */

/** Second message lands a beat after the first, then Panda waves. */
const SECOND_MESSAGE_MS = 260;
const WAVE_MS = 560;

/** Long enough to read Panda's send-off, short enough not to feel like a wait. */
const START_DELAY_MS = 500;

/** Below this, an unmount is React remounting in development, not a learner leaving. */
const ABANDON_FLOOR_MS = 500;

export function DiagnosticIntro({ onStart }: { onStart: () => void }) {
  const { reaction, message, play } = usePandaCue();
  const [state, patch] = useDiagnosticIntroState();
  const [revealed, setRevealed] = useState(1);

  const leaving = useRef(false);
  const viewed = useRef(false);
  const startTimer = useRef<number | null>(null);

  // Sequence the opening, then clean every timer up on the way out.
  useEffect(() => {
    const second = window.setTimeout(() => setRevealed(2), SECOND_MESSAGE_MS);
    // A wordless cue: Panda waves once as the second message lands, then the
    // hook settles it straight back to the idle breath.
    const wave = window.setTimeout(() => play("greeting", { reaction: "welcome" }), WAVE_MS);

    return () => {
      window.clearTimeout(second);
      window.clearTimeout(wave);
      if (startTimer.current) window.clearTimeout(startTimer.current);
    };
  }, [play]);

  // Viewed once per mount; abandoned only if they leave without starting.
  useEffect(() => {
    const mountedAt = Date.now();

    // Refs survive React's development remount, so the view is counted once
    // per real visit rather than twice per page load.
    if (!viewed.current) {
      viewed.current = true;
      track("diagnostic_intro_viewed");
    }

    const abandon = () => {
      if (leaving.current) return;
      leaving.current = true;
      track("diagnostic_intro_abandoned");
    };

    window.addEventListener("pagehide", abandon);

    return () => {
      window.removeEventListener("pagehide", abandon);
      if (Date.now() - mountedAt >= ABANDON_FLOOR_MS) abandon();
    };
  }, []);

  const expand = useCallback(() => {
    patch({ explanationExpanded: true });
    track("diagnostic_how_it_works_opened");
  }, [patch]);

  const start = useCallback(() => {
    if (leaving.current) return;
    leaving.current = true;

    patch({ diagnosticStarted: true });
    track("diagnostic_started", { afterExplanation: state.explanationExpanded });
    play(
      "start",
      state.explanationExpanded
        ? DIAGNOSTIC_CUES.startAfterExplanation
        : DIAGNOSTIC_CUES.start,
    );

    startTimer.current = window.setTimeout(onStart, START_DELAY_MS);
  }, [patch, play, onStart, state.explanationExpanded]);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-5 pt-4 pb-5">
      <header className="flex items-center gap-3 border-b border-line pb-3">
        <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary-soft">
          <Image src="/panda-logo.png" alt="" width={38} height={38} priority />
        </span>
        <span className="flex-1">
          <span className="block font-display text-[17px] leading-tight font-extrabold tracking-tight">
            Panda
          </span>
          <span className="block text-[12px] leading-tight text-ink-muted">
            Your Pandaroute Buddy
          </span>
        </span>

        <StepDots value={3} max={3} label="Onboarding, step 3 of 3" />

        <Link
          href="/onboarding/transition"
          aria-label="Back to your transition"
          className="-mr-2 flex size-11 items-center justify-center rounded-full text-ink-faint transition-colors hover:text-ink"
        >
          <X className="size-5" aria-hidden />
        </Link>
      </header>

      <div className="flex flex-1 flex-col gap-2.5 pt-4">
        {OPENING.slice(0, revealed).map((line) => (
          <PandaMessage key={line.lead} lead={line.lead} body={line.body} />
        ))}

        {state.explanationExpanded && (
          <>
            {EXPLANATION.map((line) => (
              <PandaMessage key={line.lead} lead={line.lead} body={line.body} />
            ))}

            <Card padded={false} className="panda-bubble-in mt-0.5 p-3.5">
              <ul className="flex flex-col gap-3">
                {EXPLANATION_POINTS.map((point) => (
                  <li key={point.id} className="flex items-start gap-3">
                    <span aria-hidden className="text-[18px] leading-none">
                      {point.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14px] leading-snug font-bold">
                        {point.title}
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-ink-muted">
                        {point.body}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </>
        )}

        <div className="mt-2 flex justify-center">
          <PandaMascot reaction={reaction} size="large" />
        </div>
      </div>

      {/* The CTA stays on screen however far the conversation runs, and Panda's
          send-off floats above it rather than pushing it down. */}
      <div className="sticky bottom-0 z-10 mt-3 bg-canvas pt-2 pb-1">
        <div className="relative flex flex-col gap-2.5">
          <PandaAside
            reaction={reaction}
            message={message}
            className="absolute right-0 bottom-full left-0 mb-2.5"
          />

          <p className="text-center text-[12px] leading-snug text-ink-muted">
            <span aria-hidden>🐼</span> {DIAGNOSTIC_FACTS}
          </p>

          <Button size="lg" full onClick={start}>
            {state.explanationExpanded ? "Got it, let's start" : "Start my diagnostic"}
          </Button>

          {!state.explanationExpanded && (
            <Button variant="outline" size="lg" full onClick={expand}>
              How does it work?
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
