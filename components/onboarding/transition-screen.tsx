"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowDown, ChevronLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ChoiceChips } from "@/components/ui/ChoiceChips";
import { StepDots } from "@/components/ui/StepDots";
import { PandaAside } from "@/components/panda/panda-aside";
import { usePandaCue } from "@/components/panda/use-panda-cue";
import {
  ROUTE_UNAVAILABLE_CUE,
  TRANSITION_CUES,
} from "@/components/panda/panda-reactions";
import { CurrentRoleSelect } from "@/components/onboarding/current-role-select";
import { CURRENT_ROLE_ID } from "@/lib/current-roles";
import {
  EXPERIENCE_OPTIONS,
  TARGET_ROLE,
  TIMELINE_OPTIONS,
  type ExperienceRange,
  type TransitionProfile,
  type TransitionTimeline,
} from "@/lib/transition-profile";
import { useTransitionProfile } from "@/lib/use-transition-profile";

/**
 * "Your transition" — the second onboarding screen.
 *
 * Two questions, and the reason for asking each one. The route is fixed for
 * this MVP, so the role cards are context rather than controls: what the
 * learner decides here is how much to credit (experience) and how hard to
 * push (timeline).
 *
 * Every answer is written to storage as it is chosen, so going back or
 * refreshing returns the learner to exactly what they had picked.
 */

/** Long enough to read Panda's send-off, short enough not to feel like a wait. */
const BUILD_DELAY_MS = 500;

export function TransitionScreen({ onBuild }: { onBuild: () => void }) {
  const { reaction, message, play } = usePandaCue();
  const [profile, setProfile] = useTransitionProfile();

  const leaving = useRef(false);
  const buildTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (buildTimer.current) window.clearTimeout(buildTimer.current);
    },
    [],
  );

  // One write path: state and storage move together, so a reload can never
  // disagree with what is on screen.
  const commit = useCallback(
    (next: TransitionProfile) => setProfile(next),
    [setProfile],
  );

  const chooseExperience = useCallback(
    (experienceRange: ExperienceRange) => {
      commit({ ...profile, experienceRange });
      play("experience", TRANSITION_CUES.experience);
    },
    [commit, play, profile],
  );

  const chooseTimeline = useCallback(
    (transitionTimeline: TransitionTimeline) => {
      commit({ ...profile, transitionTimeline });
      play("timeline", TRANSITION_CUES.timeline);
    },
    [commit, play, profile],
  );

  const ready = profile.experienceRange !== null && profile.transitionTimeline !== null;

  const build = useCallback(() => {
    if (!ready || leaving.current) return;
    leaving.current = true;
    play("build", TRANSITION_CUES.build);
    buildTimer.current = window.setTimeout(onBuild, BUILD_DELAY_MS);
  }, [ready, play, onBuild]);

  return (
    <div className="screen">
      <div className="flex items-center justify-between">
        <Link
          href="/onboarding"
          className="-ml-2 flex min-h-11 items-center gap-1 rounded-full pr-3 pl-2 text-[14px] font-semibold text-ink-muted transition-colors hover:text-ink"
        >
          <ChevronLeft className="size-5" aria-hidden />
          Back
        </Link>

        <span className="flex items-center gap-2">
          <StepDots value={2} max={3} label="Onboarding, step 2 of 3" />
          <span className="tnum text-xs text-ink-faint">2 of 3</span>
        </span>
      </div>

      <div className="gps-rise mt-3 flex flex-1 flex-col">
        <h1 className="text-[28px] leading-tight font-extrabold text-balance">
          Your transition
        </h1>
        <p className="mt-1 text-[15px] leading-snug text-ink-muted">
          Let&apos;s personalize your route.
        </p>

        <p className="mt-4 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
          You&apos;re moving from
        </p>

        <div className="mt-2 flex flex-col items-stretch">
          {/* The route is fixed for this MVP, but the field is a real selector:
              the locked rows say which transitions are planned without
              pretending any of them work. */}
          <CurrentRoleSelect
            value={CURRENT_ROLE_ID}
            onSelect={() => undefined}
            onUnavailable={(option) => play("role-" + option.id, ROUTE_UNAVAILABLE_CUE)}
          />

          <ArrowDown className="my-1.5 size-5 self-center text-ink-faint" aria-hidden />

          <Card padded={false} className="flex items-center gap-3 p-3.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-tile)] bg-primary-soft">
              <Compass className="size-5 text-primary-strong" aria-hidden />
            </span>
            <span>
              <span className="block text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
                To
              </span>
              <span className="block text-[17px] leading-snug font-bold text-primary-ink">
                {TARGET_ROLE}
              </span>
            </span>
          </Card>
        </div>

        <p className="mt-2 text-[12px] leading-snug text-ink-faint">
          More career routes are coming soon.
        </p>

        <p className="mt-2.5 text-[13px] leading-snug text-ink-muted">
          Your QA experience counts. We&apos;ll build on what you already know instead of
          starting from zero.
        </p>

        <h2 className="mt-4 text-[15px] leading-snug font-bold">
          How much professional experience do you have?
        </h2>
        <ChoiceChips
          name="How much professional experience do you have?"
          options={EXPERIENCE_OPTIONS}
          value={profile.experienceRange}
          onChange={chooseExperience}
          className="mt-2.5"
        />

        <h2 className="mt-4 text-[15px] leading-snug font-bold">
          When would you like to make the transition?
        </h2>
        <ChoiceChips
          name="When would you like to make the transition?"
          options={TIMELINE_OPTIONS}
          value={profile.transitionTimeline}
          onChange={chooseTimeline}
          className="mt-2.5"
        />

        <p className="mt-2.5 text-[13px] leading-snug text-ink-muted">
          This helps us shape the pace of your route — you can change it anytime.
        </p>

      </div>

      {/* The CTA stays on screen whatever the scroll position, and Panda floats
          above it: out of the flow, so a reaction can never move a control out
          from under the finger that just tapped it. */}
      <div className="sticky bottom-0 z-10 mt-3 bg-canvas pt-2 pb-1">
        <div className="relative">
          <PandaAside
            reaction={reaction}
            message={message}
            className="absolute right-0 bottom-full left-0 mb-2.5"
          />
          <Button size="lg" full onClick={build} disabled={!ready}>
            Build my route
          </Button>
        </div>
      </div>
    </div>
  );
}
