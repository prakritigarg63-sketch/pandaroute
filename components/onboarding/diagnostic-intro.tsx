"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StepDots } from "@/components/ui/StepDots";
import { PandaMascot } from "@/components/panda/panda-mascot";
import { PandaAside } from "@/components/panda/panda-aside";
import { track } from "@/lib/analytics";
import { TOTAL_QUESTIONS } from "@/lib/diagnostic/questions";
import { answeredCount, resumeIndex, useDiagnostic } from "@/lib/diagnostic/use-diagnostic";

/* ---------------------------------------------------------------------------
   The diagnostic introduction.

   The bridge between "here is your route" and the first scenario, and the last
   chance to set the frame: the diagnostic decides what to teach, it does not
   grade anyone. Someone who arrives expecting an exam answers differently from
   someone who knows we are looking at how they think.

   A learner who left partway through is offered their place back rather than a
   fresh start — fifteen minutes is a real ask, and asking twice is worse.
--------------------------------------------------------------------------- */

/** Below this, an unmount is React remounting in development, not a learner leaving. */
const ABANDON_FLOOR_MS = 500;

const EXPECTATIONS = [
  { id: "scenarios", icon: "🎯", value: String(TOTAL_QUESTIONS), label: "Scenarios" },
  { id: "minutes", icon: "🕐", value: "10–15", label: "Minutes" },
  { id: "saved", icon: "☁️", value: null, label: "Your progress is saved" },
  { id: "qa", icon: "⭐", value: null, label: "Your QA experience counts" },
];

export function DiagnosticIntro() {
  const state = useDiagnostic();
  const answered = answeredCount(state);
  const resuming = answered > 0 && state.completedAt === null;
  const resumeAt = resumeIndex(state) + 1;

  const leaving = useRef(false);
  const viewed = useRef(false);

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

  const start = () => {
    leaving.current = true;
    track("diagnostic_started", { resuming });
  };

  return (
    <div className="screen">
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

      <div className="gps-rise flex flex-1 flex-col pt-4">
        <h1 className="text-[27px] leading-tight font-extrabold text-balance">
          Let&apos;s map how you think 🧭
        </h1>
        <p className="mt-1.5 text-[15px] leading-snug text-ink-muted text-balance">
          You&apos;ll work through a few situations a Product Manager might face.
        </p>

        <Card padded={false} className="mt-3.5 bg-primary-soft">
          <div className="p-3.5">
            <p className="text-[14px] leading-snug font-bold">
              There are no textbook questions and no grades.
            </p>
            <p className="mt-1 text-[13px] leading-snug text-ink-muted">
              We&apos;re looking at how you approach problems, make decisions, and work with
              technical teams.
            </p>
          </div>
        </Card>

        <p className="mt-4 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
          What to expect
        </p>

        <ul className="mt-2 grid grid-cols-2 gap-2">
          {EXPECTATIONS.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-2.5 rounded-[var(--radius-card)] border border-line bg-surface p-3"
            >
              <span aria-hidden className="text-[17px] leading-none">
                {item.icon}
              </span>
              <span className="min-w-0">
                {item.value && (
                  <span className="tnum block text-[16px] leading-none font-extrabold">
                    {item.value}
                  </span>
                )}
                <span className="mt-0.5 block text-[12px] leading-snug text-ink-muted">
                  {item.label}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex justify-center">
          <PandaMascot reaction="welcome" size="large" />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        <PandaAside mascot={false} message="Don't try to answer like a textbook. Choose what you would genuinely do." />

        {resuming ? (
          <>
            <Button size="lg" full href={`/diagnostic/question/${resumeAt}`} onClick={start}>
              Continue your diagnostic →
            </Button>
            <p className="text-center text-[12px] text-ink-muted">
              You&apos;re on scenario {resumeAt} of {TOTAL_QUESTIONS}.
            </p>
          </>
        ) : (
          <Button size="lg" full href="/diagnostic/how-it-works" onClick={start}>
            Start diagnostic →
          </Button>
        )}
      </div>
    </div>
  );
}
