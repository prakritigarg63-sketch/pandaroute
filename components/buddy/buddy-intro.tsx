"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { BadgeCheck, ChevronRight, Compass, Lightbulb, Map } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StepDots } from "@/components/ui/StepDots";
import { PandaMascot } from "@/components/panda/panda-mascot";
import { usePandaCue } from "@/components/panda/use-panda-cue";
import {
  CARD_CUES,
  START_CUE,
  TAP_CUES,
  WELCOME_CUE,
} from "@/components/panda/panda-reactions";
import { RichText } from "@/components/buddy/rich-text";
import { ONBOARDING_BENEFITS, onboardingCopy } from "@/lib/onboarding-copy";
import { cn } from "@/lib/cn";

/**
 * Panda's introduction — the first screen of onboarding.
 *
 * One job: make an experienced professional understand, in a glance, that this
 * product will credit what they already know rather than start them at zero.
 * Everything on the screen serves that sentence, and nothing else is here.
 *
 * Panda reacts to what the learner touches, but the cards and the CTA stay the
 * point of the screen: every reaction is short, self-dismissing, and never
 * blocks a tap. The screen decides *when* Panda reacts; how a reaction looks
 * and how long it lasts belongs to components/panda.
 *
 * Sized to sit inside a 390px viewport without scrolling: three compact cards
 * rather than three paragraphs, and speech bubbles that float above the mascot
 * so nothing on the screen moves when Panda speaks.
 */

/** One icon per benefit, carrying the meaning of the card it sits in. */
const BENEFIT_ICON: Record<string, typeof Compass> = {
  gaps: Map,
  learn: Lightbulb,
  proof: BadgeCheck,
};

/** Long enough to read Panda's send-off, short enough not to feel like a wait. */
const START_DELAY_MS = 500;

export function BuddyIntro({ onStart }: { onStart: () => void }) {
  const { reaction, message, source, play, toggle } = usePandaCue();
  const [tapIndex, setTapIndex] = useState(0);

  // Guards the CTA against a second tap during the send-off, without disabling
  // the button — a control that greys out for half a second reads as breakage.
  const leaving = useRef(false);
  const startTimer = useRef<number | null>(null);

  useEffect(() => {
    play("welcome", WELCOME_CUE);
  }, [play]);

  useEffect(
    () => () => {
      if (startTimer.current) window.clearTimeout(startTimer.current);
    },
    [],
  );

  const tapPanda = useCallback(() => {
    play("panda", TAP_CUES[tapIndex]);
    setTapIndex((i) => (i + 1) % TAP_CUES.length);
  }, [play, tapIndex]);

  const handleStart = useCallback(() => {
    if (leaving.current) return;
    leaving.current = true;
    play("start", START_CUE);
    startTimer.current = window.setTimeout(onStart, START_DELAY_MS);
  }, [play, onStart]);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-6 pt-7 pb-7">
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center overflow-hidden rounded-xl bg-primary-soft">
          <Image src="/panda-logo.png" alt="" width={34} height={34} priority />
        </span>
        <span>
          <span className="block font-display text-[17px] leading-tight font-extrabold tracking-tight text-primary-ink">
            Pandaroute
          </span>
          <span className="block text-[11px] leading-tight text-ink-muted">
            Your route to PM success
          </span>
        </span>
      </div>

      <div className="gps-rise mt-6 flex flex-1 flex-col">
        <h1 className="text-[30px] leading-tight font-extrabold text-balance">
          {onboardingCopy.greeting}
        </h1>
        <p className="mt-2 text-[16px] leading-snug font-semibold text-balance">
          {onboardingCopy.journey}
        </p>
        <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted text-balance">
          {onboardingCopy.promise}
        </p>

        <ul className="mt-5 flex flex-col gap-2.5">
          {ONBOARDING_BENEFITS.map((benefit) => {
            const Icon = BENEFIT_ICON[benefit.id] ?? Compass;
            const cue = CARD_CUES[benefit.id];
            const active = source === benefit.id;
            return (
              <li key={benefit.id}>
                <Card
                  padded={false}
                  className={cn(
                    "overflow-hidden transition-colors",
                    active && "border-primary-strong/45 bg-primary-soft/70",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggle(benefit.id, cue)}
                    // Hover is a desktop courtesy only; every reaction is
                    // reachable by tap and by keyboard.
                    onPointerEnter={(event) => {
                      if (event.pointerType === "mouse") play(benefit.id, cue);
                    }}
                    aria-pressed={active}
                    className="flex w-full items-start gap-3 p-3.5 text-left transition-colors hover:bg-sunk/40 active:bg-sunk/70"
                  >
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-tile)] transition-colors",
                        active ? "bg-primary-fill" : "bg-primary-soft",
                      )}
                    >
                      <Icon className="size-5 text-primary-strong" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] leading-snug font-bold">
                        {benefit.title}
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-ink-muted">
                        <RichText content={benefit.body} />
                      </span>
                    </span>
                    <ChevronRight
                      aria-hidden
                      className={cn(
                        "size-4 shrink-0 self-center transition-colors",
                        active ? "text-primary-strong" : "text-ink-faint/60",
                      )}
                    />
                  </button>
                </Card>
              </li>
            );
          })}
        </ul>

        {/* mt-auto drops Panda to the foot of the conversation block, so the
            slack that used to sit under the mascot sits above it instead —
            that is the room a two-line speech bubble needs to clear the last
            card. pt-6 keeps a gap when there is no slack to take. */}
        <div className="mt-auto flex justify-center pt-20">
          <PandaMascot
            reaction={reaction}
            message={message}
            size="large"
            interactive
            onClick={tapPanda}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <Button size="lg" full onClick={handleStart}>
          Start my route
        </Button>
        <StepDots value={1} max={3} label="Onboarding, step 1 of 3" />
      </div>
    </div>
  );
}
