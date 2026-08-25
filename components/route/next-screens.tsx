"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { PandaAside } from "@/components/panda/panda-aside";
import { PandaMascot } from "@/components/panda/panda-mascot";
import { BottomNav } from "@/components/layout/bottom-nav";
import { CAPABILITY_BY_ID } from "@/lib/diagnostic/capabilities";
import { CAPSTONE_REQUIREMENT, CORE_CAPABILITIES } from "@/lib/challenge/challenges";
import { progression, seedDemoProgress, useLoop } from "@/lib/challenge/use-challenge";

/* ---------------------------------------------------------------------------
   What comes after a verified capability.

   Choice, then a milestone, then the capstone. The learner picks their next
   challenge from three, not from a catalogue: enough autonomy to own the route,
   little enough that the recommendation still means something.
--------------------------------------------------------------------------- */

/** Prototype shortcut, labelled as one wherever it appears. */
export function DemoJump({ label, target }: { label: string; target: number }) {
  const router = useRouter();

  const jump = useCallback(() => {
    seedDemoProgress(target);
    router.push("/milestone");
  }, [target, router]);

  return (
    <button
      type="button"
      onClick={jump}
      className="mx-auto flex min-h-11 items-center gap-1.5 rounded-[var(--radius-pill)] px-3 text-[12px] font-semibold text-ink-faint underline underline-offset-4 transition-colors hover:text-ink-muted"
    >
      <span className="rounded-[var(--radius-pill)] border border-line px-1.5 py-0.5 text-[10px] tracking-[0.08em] uppercase">
        Prototype
      </span>
      {label}
    </button>
  );
}

// `ChooseNextChallenge` (the Challenge Library) now lives in
// components/challenge/challenge-library.tsx — it grew well past a screen
// this file should carry alongside the milestone and capstone screens below.

export function CareerMilestone() {
  const loop = useLoop();
  const counts = progression(loop);
  const unlocked = counts.coreVerified >= CAPSTONE_REQUIREMENT;
  const remaining = Math.max(0, CAPSTONE_REQUIREMENT - counts.coreVerified);

  // Where the learner sits between the two roles, as a share of the core set.
  const share = Math.round((counts.coreVerified / CAPSTONE_REQUIREMENT) * 100);

  return (
    <div className="screen screen-flush">
      <h1 className="text-[25px] leading-tight font-extrabold text-balance">
        Look how far you&apos;ve come! 🎉
      </h1>

      <ul className="mt-4 grid grid-cols-4 gap-2">
        {[
          { icon: "🏆", value: counts.verified, label: "Verified" },
          { icon: "🧩", value: counts.challengesCompleted, label: "Completed" },
          { icon: "↑", value: counts.gapsClosed, label: "Gaps closed" },
          { icon: "🔥", value: counts.activeDays, label: "Day streak" },
        ].map((stat) => (
          <li
            key={stat.label}
            className="rounded-[var(--radius-card)] border border-line bg-surface px-1 py-2.5 text-center"
          >
            <p className="text-[14px] leading-none" aria-hidden>
              {stat.icon}
            </p>
            <p className="tnum mt-1 text-[18px] leading-none font-extrabold">{stat.value}</p>
            <p className="mt-1 text-[10px] leading-tight text-ink-muted [overflow-wrap:anywhere]">{stat.label}</p>
          </li>
        ))}
      </ul>

      <p className="mt-5 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
        Your transition
      </p>

      <div className="mt-2 rounded-[var(--radius-card)] border border-line bg-surface p-3.5">
        <div className="flex items-center justify-between text-[12px] font-semibold">
          <span className="text-ink-muted">QA / Test Analyst</span>
          <span className="text-primary-ink">Product Manager</span>
        </div>

        <div className="relative mt-2.5 h-1.5 rounded-full bg-line">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500"
            style={{ width: `${share}%` }}
          />
          <span
            className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-canvas"
            style={{ left: `${share}%` }}
            aria-hidden
          />
        </div>
      </div>

      <p className="mt-5 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
        Core capability progress
      </p>
      <p className="mt-1.5 text-[15px] font-bold">
        {counts.coreVerified} of {CORE_CAPABILITIES.length} core capabilities demonstrated
      </p>
      <Progress
        value={counts.coreVerified}
        max={CORE_CAPABILITIES.length}
        label={`${counts.coreVerified} of ${CORE_CAPABILITIES.length} core capabilities demonstrated`}
        className="mt-2"
      />

      <Card
        className={cn(
          "mt-5",
          unlocked ? "border-success/40 bg-skip-soft" : "border-line bg-surface",
        )}
      >
        <div className="flex items-start gap-3">
          <span className="text-[22px] leading-none" aria-hidden>
            {unlocked ? "🔓" : "🔒"}
          </span>
          <div className="min-w-0">
            <p className="text-[15px] leading-snug font-bold">Capstone Challenge</p>
            <p className="mt-0.5 text-[13px] leading-snug text-ink-muted">
              {unlocked
                ? "Everything you've proved, in one realistic product problem."
                : `Verify ${remaining} more core ${remaining === 1 ? "capability" : "capabilities"} to unlock.`}
            </p>
          </div>
        </div>

        {unlocked && (
          <Button size="lg" full className="mt-3" href="/capstone">
            Open my capstone →
          </Button>
        )}
      </Card>

      <div className="mt-auto flex flex-col gap-2.5 pt-5">
        <PandaAside
          reaction={unlocked ? "celebrate" : "helpful"}
          message={
            unlocked
              ? "You've practised the skills individually. Now let's see how you use them together."
              : "You've practised the skills individually. Soon, we'll see how you use them together."
          }
        />
        {!unlocked && (
          <DemoJump label="Simulate the remaining challenges" target={CAPSTONE_REQUIREMENT} />
        )}
      </div>

      <BottomNav active="progress" />
    </div>
  );
}

export function CapstoneUnlocked() {
  const loop = useLoop();

  const proved = CORE_CAPABILITIES.map((id) => CAPABILITY_BY_ID.get(id)).filter(
    (capability): capability is NonNullable<typeof capability> =>
      Boolean(capability) && loop.capabilities[capability!.id] === "verified",
  );

  return (
    <div className="screen">
      <div className="gps-rise flex flex-1 flex-col items-center gap-3 text-center">
        <span className="trophy-in text-[52px] leading-none" aria-hidden>
          🔓
        </span>

        <h1 className="text-[26px] leading-tight font-extrabold text-balance">
          Your Capstone is unlocked! 🚀
        </h1>
        <p className="text-[16px] leading-snug font-semibold text-balance">
          Time to put everything together.
        </p>

        <p className="max-w-[21rem] text-[14px] leading-relaxed text-ink-muted text-balance">
          Until now you&apos;ve practised individual PM capabilities. Your capstone combines
          them in one realistic product problem.
        </p>

        <p className="mt-1 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
          You&apos;ll use
        </p>
        <ul className="flex flex-wrap justify-center gap-1.5">
          {proved.map((capability) => (
            <li
              key={capability.id}
              className="flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-success/35 bg-skip-soft px-2.5 py-1 text-[12px] font-semibold"
            >
              <Check className="size-3.5 text-success" aria-hidden />
              {capability.name}
            </li>
          ))}
        </ul>

        <div className="mt-1">
          <PandaMascot reaction="celebrate" size="medium" />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        <PandaAside
          mascot={false}
          message="This one won't tell you which skill to use. Just like real PM work."
        />
        <Button size="lg" full href="/capstone/brief">
          View my capstone →
        </Button>
      </div>
    </div>
  );
}

/** Shown when the capstone is still locked but someone lands on the URL. */
export function CapstoneLocked() {
  const loop = useLoop();
  const counts = progression(loop);
  const remaining = Math.max(0, CAPSTONE_REQUIREMENT - counts.coreVerified);

  return (
    <div className="screen items-center justify-center gap-3 text-center">
      <span className="text-[44px] leading-none" aria-hidden>
        🔒
      </span>
      <h1 className="text-[24px] leading-tight font-extrabold">Capstone locked</h1>
      <p className="max-w-[19rem] text-[14px] leading-relaxed text-ink-muted">
        Verify {remaining} more core {remaining === 1 ? "capability" : "capabilities"} and
        this opens.
      </p>
      <Button size="lg" full className="mt-2 max-w-xs" href="/milestone">
        <Lock className="size-4" aria-hidden />
        See my progress
      </Button>
    </div>
  );
}
