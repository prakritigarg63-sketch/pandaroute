"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Award,
  Bell,
  BookOpen,
  Check,
  ChevronRight,
  Circle,
  CircleHelp,
  Clock,
  Compass,
  Cpu,
  Flame,
  Gauge,
  Lock,
  LogOut,
  MapPinned,
  Pencil,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { BottomNav } from "@/components/layout/bottom-nav";
import { PandaMascot } from "@/components/panda/panda-mascot";
import { PandaAside } from "@/components/panda/panda-aside";
import { PreferenceEditSheet } from "@/components/profile/preference-edit-sheet";
import { CAPABILITY_BY_ID } from "@/lib/diagnostic/capabilities";
import { classifyAnswers, countBy } from "@/lib/diagnostic/scoring";
import { useDiagnostic, answeredCount } from "@/lib/diagnostic/use-diagnostic";
import { useLoop, progression } from "@/lib/challenge/use-challenge";
import { CORE_CAPABILITIES } from "@/lib/challenge/challenges";
import { useProfileIdentity, saveProfileIdentity, clearProfileIdentity } from "@/lib/profile/use-profile";
import { usePreferences, setPreference, type LearningPreferences } from "@/lib/profile/use-preferences";
import { computeStreak, computeXp, computeLevel, deriveAchievements, weekStatus } from "@/lib/profile/derive";

/* ---------------------------------------------------------------------------
   The Profile page — identity, goal, demonstrated skills, achievements,
   activity and preferences in one place. Everything numeric here is derived
   from state Gap Map, Progress and the challenge loop already own; nothing
   is a second copy. See lib/profile/derive.ts for the two prototype
   formulas (XP, achievements) this app has no real system for yet.

   Unlike most in-app screens this one isn't capped at the standard 430px
   `.screen` column — the brief asks for real two-column desktop layout, so
   it uses the same wider-container pattern the Challenge Library already
   established, not `.screen` fighting a width it was never meant to reach.
--------------------------------------------------------------------------- */

const ACHIEVEMENT_ICON = { compass: Compass, flame: Flame, zap: Zap, cpu: Cpu, award: Award, lock: Lock };

export function ProfilePage() {
  const router = useRouter();
  const identity = useProfileIdentity();
  const diagnostic = useDiagnostic();
  const loop = useLoop();
  const preferences = usePreferences();

  const results = classifyAnswers(diagnostic.answers);
  const totals = countBy(results);
  const assessed = results.length;
  const hasStarted = answeredCount(diagnostic) > 0;
  const hasNoCriticalGaps =
    hasStarted && totals.learn === 0 && totals.practice === 0 && totals.skip === assessed;

  const counts = progression(loop);
  const streak = computeStreak(loop.activeDays);
  const xp = computeXp(loop);
  const level = computeLevel(xp);
  const week = weekStatus(loop.activeDays);

  const statusPill = hasNoCriticalGaps
    ? { label: "Advanced route unlocked ⚡", tone: "text-primary-ink bg-primary-soft" }
    : diagnostic.completedAt
      ? { label: "Journey in progress 🚀", tone: "text-skip bg-skip-soft" }
      : { label: "Diagnostic not started yet", tone: "text-ink-muted bg-sunk" };

  const demonstrated = results
    .filter((r) => r.classification === "skip")
    .map((r) => CAPABILITY_BY_ID.get(r.capabilityId))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const strengthening = results
    .filter((r) => r.classification === "practice")
    .map((r) => CAPABILITY_BY_ID.get(r.capabilityId))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const aiVerified =
    loop.capabilities["ai-product-thinking"] === "verified" ||
    loop.capabilities["ai-reliability"] === "verified";
  const coreVerifiedCount = CORE_CAPABILITIES.filter((id) => loop.capabilities[id] === "verified").length;
  const achievements = deriveAchievements({
    diagnosticComplete: diagnostic.completedAt !== null,
    streak,
    challengesCompleted: counts.challengesCompleted,
    aiCapabilityVerified: aiVerified,
    verifiedCount: coreVerifiedCount,
  });

  const [editingProfile, setEditingProfile] = useState(false);
  const [openField, setOpenField] = useState<keyof LearningPreferences | null>(null);
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  const rise = (index: number) => ({
    className: "gps-rise",
    style: { animationDelay: `${index * 80}ms` } as React.CSSProperties,
  });

  return (
    <div className="min-h-dvh bg-canvas">
      <div className="mx-auto flex w-full max-w-[960px] flex-col px-5 pt-[max(env(safe-area-inset-top),1.25rem)] pb-8">
        <div {...rise(0)} className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[24px] leading-tight font-extrabold">My Profile 🐼</h1>
            <p className="mt-1 text-[13.5px] leading-snug text-ink-muted">
              Your journey, achievements, and learning preferences—all in one place.
            </p>
          </div>
          <span
            title="Coming soon"
            aria-disabled="true"
            className="flex size-11 shrink-0 cursor-not-allowed items-center justify-center rounded-[14px] border border-line bg-surface text-ink-faint/55"
          >
            <Settings className="size-5" aria-hidden />
          </span>
        </div>

        {/* Hero / identity card */}
        <div {...rise(1)} className="mt-4 rounded-[22px] border border-line bg-surface p-4 shadow-warm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-3.5">
              <span className="grid size-[72px] shrink-0 place-items-center overflow-hidden rounded-full border border-line bg-primary-soft sm:size-20">
                <Image src="/panda-logo.png" alt="" width={44} height={44} />
              </span>
              <div className="min-w-0 pt-1">
                <p className="text-[19px] leading-tight font-extrabold">{identity.name || "Pathfinder"}</p>
                <p className="mt-0.5 text-[13.5px] text-ink-muted">QA / Test Analyst → Product Manager</p>
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-lavender-soft px-2.5 py-1 text-[11.5px] font-bold text-lavender">
                  <Sparkles className="size-3" aria-hidden />
                  Pathfinder · Level {level}
                </span>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-semibold text-ink-muted">
                  <span className="flex items-center gap-1">
                    <Flame className="size-3.5 text-primary-strong" aria-hidden />
                    {streak} day streak
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="size-3.5 text-primary-strong" aria-hidden />
                    {xp.toLocaleString()} XP
                  </span>
                </div>
                <span
                  className={cn(
                    "mt-2 inline-flex rounded-[var(--radius-pill)] px-2.5 py-1 text-[11.5px] font-bold",
                    statusPill.tone,
                  )}
                >
                  {statusPill.label}
                </span>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => setEditingProfile(true)}
                    className="flex min-h-10 items-center gap-1.5 rounded-[var(--radius-pill)] border border-line bg-canvas px-3 text-[13px] font-bold text-ink transition-colors hover:bg-sunk/60"
                  >
                    <Pencil className="size-3.5" aria-hidden />
                    Edit profile
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 lg:w-[220px] lg:shrink-0">
              <PandaMascot reaction="celebrate" size="large" />
              {/* mascot=false: the PandaMascot above is this card's one
                  panda — a second avatar in the bubble would repeat it. */}
              <PandaAside
                mascot={false}
                reaction="celebrate"
                message={
                  hasNoCriticalGaps
                    ? "Your foundation is strong! Ready for the next challenge? 🚀"
                    : "Look how far you've come! Keep building, Pathfinder."
                }
              />
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Career Journey */}
          <div {...rise(2)} className="rounded-[20px] border border-line bg-surface p-4 sm:p-5">
            <p className="flex items-center gap-2 text-[15.5px] font-extrabold">
              <MapPinned className="size-4.5 text-primary-strong" aria-hidden />
              Your Career Journey
            </p>

            {hasStarted ? (
              <>
                <ol className="mt-3 flex flex-col gap-1">
                  <li className="flex items-center gap-2 text-[14px] font-bold">
                    <span className="size-2.5 rounded-full bg-skip" aria-hidden />
                    QA / Test Analyst
                  </li>
                  <li className="pl-[5px] text-[12px] text-ink-faint" aria-hidden>
                    ↓
                  </li>
                  <li className="flex items-center gap-2 text-[14px] font-bold">
                    <span className="size-2.5 rounded-full bg-primary" aria-hidden />
                    Product Manager
                  </li>
                </ol>

                <p className="mt-3 text-[11px] font-extrabold tracking-[0.1em] text-ink-faint uppercase">
                  Goal
                </p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-ink-muted">
                  Build the skills to confidently transition into Product Management.
                </p>

                <p className="mt-3 text-[11px] font-extrabold tracking-[0.1em] text-ink-faint uppercase">
                  Current focus
                </p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-ink-muted">
                  Real-world product thinking, AI-assisted problem solving, and decision-making.
                </p>

                <Link
                  href="/route"
                  className="mt-4 flex min-h-11 w-full items-center justify-center rounded-[var(--radius-pill)] border border-line bg-canvas text-[14px] font-bold text-primary-ink transition-colors hover:bg-sunk/60"
                >
                  View my route →
                </Link>
              </>
            ) : (
              <>
                <p className="mt-3 text-[13.5px] leading-relaxed text-ink-muted">
                  Your journey is ready to begin.
                </p>
                <Link
                  href="/onboarding"
                  className="mt-4 flex min-h-11 w-full items-center justify-center rounded-[var(--radius-pill)] bg-primary text-[14px] font-bold text-ink"
                >
                  Take my diagnostic →
                </Link>
              </>
            )}
          </div>

          {/* Progress summary */}
          <div {...rise(3)} className="rounded-[20px] border border-line bg-surface p-4 sm:p-5">
            <p className="flex items-center gap-2 text-[15.5px] font-extrabold">
              <TrendingUp className="size-4.5 text-primary-strong" aria-hidden />
              Your Progress
            </p>

            {!hasStarted ? (
              <>
                <p className="mt-3 text-[13.5px] leading-relaxed text-ink-muted">
                  Your progress will appear here as you begin your route.
                </p>
                <Link
                  href="/onboarding"
                  className="mt-4 flex min-h-11 w-full items-center justify-center rounded-[var(--radius-pill)] bg-primary text-[14px] font-bold text-ink"
                >
                  Start my journey →
                </Link>
              </>
            ) : (
              <>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {hasNoCriticalGaps ? (
                    <>
                      <StatBox value={`${assessed}/${assessed}`} label="Foundations demonstrated ✓" tone="bg-skip-soft text-skip" wide />
                      <StatBox value="⚡" label="Advanced route unlocked" tone="bg-primary-soft text-primary-ink" />
                      <StatBox value={counts.challengesCompleted} label="Challenges completed" tone="bg-lavender-soft text-lavender" />
                    </>
                  ) : (
                    <>
                      <StatBox value={assessed} label="Skills assessed" tone="bg-sky-soft text-sky" />
                      <StatBox value={totals.skip} label="Skills demonstrated" tone="bg-skip-soft text-skip" />
                      <StatBox value={totals.practice} label="Skills strengthening" tone="bg-primary-soft text-primary-ink" />
                      <StatBox value={totals.learn} label="Skill to learn" tone="bg-coral-soft text-coral" />
                      <StatBox value={counts.challengesCompleted} label="Challenges completed" tone="bg-lavender-soft text-lavender" />
                      <StatBox value={xp.toLocaleString()} label="Total XP" tone="bg-primary-soft text-primary-strong" />
                    </>
                  )}
                </div>
                {hasNoCriticalGaps && (
                  <p className="mt-2.5 text-[12.5px] font-semibold text-ink-muted">
                    You&apos;re ready for advanced challenges.
                  </p>
                )}

                <Link
                  href="/milestone"
                  className="mt-4 flex min-h-11 w-full items-center justify-center rounded-[var(--radius-pill)] border border-line bg-canvas text-[14px] font-bold text-primary-ink transition-colors hover:bg-sunk/60"
                >
                  {hasNoCriticalGaps ? "View advanced route →" : "View detailed progress →"}
                </Link>
              </>
            )}
          </div>

          {/* Skills snapshot */}
          <div {...rise(4)} className="rounded-[20px] border border-line bg-surface p-4 sm:p-5">
            <p className="flex items-center gap-2 text-[15.5px] font-extrabold">
              <Star className="size-4.5 text-primary-strong" aria-hidden />
              {hasNoCriticalGaps ? "Foundation demonstrated" : "Skills Snapshot"}
            </p>

            {!hasStarted ? (
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-muted">
                Complete your diagnostic to discover your skill profile.
              </p>
            ) : hasNoCriticalGaps ? (
              <>
                <p className="mt-1 text-[12.5px] font-bold text-skip">
                  {assessed}/{assessed} foundations demonstrated ✓
                </p>
                <ul className="mt-2.5 flex flex-wrap gap-1.5">
                  {demonstrated.slice(0, 6).map((c) => (
                    <SkillChip key={c.id} label={c.name} done />
                  ))}
                </ul>
                <p className="mt-3 text-[11px] font-extrabold tracking-[0.1em] text-ink-faint uppercase">
                  Next focus
                </p>
                <p className="mt-1 text-[13.5px] font-semibold">Application &amp; depth</p>
                <Link
                  href="/route/advanced"
                  className="mt-4 flex min-h-11 w-full items-center justify-center rounded-[var(--radius-pill)] bg-primary text-[14px] font-bold text-ink"
                >
                  Explore advanced challenges →
                </Link>
              </>
            ) : (
              <>
                <p className="mt-2 text-[12px] font-bold text-ink-faint uppercase">Your strongest skills</p>
                <ul className="mt-1.5 flex flex-wrap gap-1.5">
                  {demonstrated.slice(0, 4).map((c) => (
                    <SkillChip key={c.id} label={c.name} done />
                  ))}
                  {demonstrated.length === 0 && (
                    <li className="text-[13px] text-ink-muted">None demonstrated yet.</li>
                  )}
                </ul>

                <p className="mt-3 text-[12px] font-bold text-ink-faint uppercase">Currently strengthening</p>
                <ul className="mt-1.5 flex flex-wrap gap-1.5">
                  {strengthening.slice(0, 3).map((c) => (
                    <SkillChip key={c.id} label={c.name} done={false} />
                  ))}
                  {strengthening.length === 0 && (
                    <li className="text-[13px] text-ink-muted">Nothing in progress right now.</li>
                  )}
                </ul>

                <Link
                  href="/gap-map"
                  className="mt-4 flex min-h-11 w-full items-center justify-center rounded-[var(--radius-pill)] border border-line bg-canvas text-[14px] font-bold text-primary-ink transition-colors hover:bg-sunk/60"
                >
                  See all skills →
                </Link>
              </>
            )}
          </div>

          {/* Achievements */}
          <div {...rise(5)} className="rounded-[20px] border border-line bg-surface p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-[15.5px] font-extrabold">
                <Trophy className="size-4.5 text-primary-strong" aria-hidden />
                Your Achievements 🏆
              </p>
              <span title="Coming soon" aria-disabled="true" className="cursor-not-allowed text-[12.5px] font-bold text-ink-faint/55">
                View all
              </span>
            </div>

            <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {achievements.map((a, i) => {
                const Icon = ACHIEVEMENT_ICON[a.icon];
                return (
                  <li
                    key={a.id}
                    className="route-chip rounded-[16px] border border-line bg-canvas p-3"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <span
                      className={cn(
                        "grid size-9 place-items-center rounded-[12px]",
                        a.unlocked ? "bg-primary-soft text-primary-ink" : "bg-sunk text-ink-faint",
                      )}
                    >
                      <Icon className="size-4.5" aria-hidden />
                    </span>
                    <p className={cn("mt-2 text-[13px] leading-snug font-bold", !a.unlocked && "text-ink-faint")}>
                      {a.title}
                    </p>
                    <p className="mt-0.5 text-[11.5px] leading-snug text-ink-muted">{a.description}</p>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Activity */}
          <div {...rise(6)} className="rounded-[20px] border border-line bg-surface p-4 sm:p-5">
            <p className="flex items-center gap-2 text-[15.5px] font-extrabold">
              <Gauge className="size-4.5 text-primary-strong" aria-hidden />
              Your Activity
            </p>
            <p className="mt-0.5 text-[12.5px] text-ink-muted">This week</p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <StatBox value={counts.challengesCompleted} label="Challenges completed" tone="bg-primary-soft text-primary-ink" />
              <StatBox value={`+${xp.toLocaleString()}`} label="XP earned" tone="bg-primary-soft text-primary-strong" />
              <StatBox value="—" label="Time spent practicing" tone="bg-sky-soft text-sky" />
              <StatBox value={totals.practice} label="Skills strengthened" tone="bg-lavender-soft text-lavender" />
            </div>

            <div className="mt-4 flex items-center justify-between">
              {week.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <span className="text-[11px] font-bold text-ink-faint">{day.label}</span>
                  <span
                    className={cn(
                      "size-2.5 rounded-full",
                      day.done ? "bg-skip" : "border border-line bg-transparent",
                    )}
                    aria-hidden
                  />
                </div>
              ))}
            </div>
            <p className="mt-3 flex items-center justify-center gap-1.5 rounded-[var(--radius-pill)] bg-skip-soft px-3 py-1.5 text-center text-[12.5px] font-bold text-skip">
              <Flame className="size-3.5" aria-hidden />
              {streak}-day learning streak
            </p>
          </div>

          {/* Learning preferences */}
          <div {...rise(7)} className="rounded-[20px] border border-line bg-surface p-4 sm:p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-[15.5px] font-extrabold">
                <Gauge className="size-4.5 text-primary-strong" aria-hidden />
                Learning Preferences
              </p>
            </div>

            <ul className="mt-2 flex flex-col divide-y divide-line">
              <PreferenceRow
                icon={Clock}
                label="Preferred session length"
                value={preferences.sessionLength}
                onClick={() => setOpenField("sessionLength")}
              />
              <PreferenceRow
                icon={Gauge}
                label="Challenge difficulty"
                value={preferences.difficulty}
                onClick={() => setOpenField("difficulty")}
              />
              <PreferenceRow
                icon={BookOpen}
                label="Learning style"
                value={preferences.learningStyle}
                onClick={() => setOpenField("learningStyle")}
              />
              <PreferenceRow
                icon={Target}
                label="Daily goal"
                value={preferences.dailyGoal}
                onClick={() => setOpenField("dailyGoal")}
              />
              <PreferenceRow
                icon={Bell}
                label="Reminders"
                value={preferences.reminders ? "On" : "Off"}
                onClick={() => setOpenField("reminders")}
              />
            </ul>
          </div>

          {/* Account & settings */}
          <div {...rise(8)} className="rounded-[20px] border border-line bg-surface p-4 sm:p-5 lg:col-span-2">
            <p className="flex items-center gap-2 text-[15.5px] font-extrabold">
              <UserRound className="size-4.5 text-primary-strong" aria-hidden />
              Account &amp; Settings
            </p>

            <ul className="mt-2 flex flex-col divide-y divide-line">
              <AccountRow icon={UserRound} label="Personal information" detail="Name, email and profile details" />
              <AccountRow icon={Bell} label="Notifications" detail="Learning reminders and updates" />
              <AccountRow icon={ShieldCheck} label="Privacy & data" detail="Manage your learning data" />
              <AccountRow icon={CircleHelp} label="Help & support" detail="Get help and contact support" />
              <li>
                <button
                  type="button"
                  onClick={() => setConfirmSignOut(true)}
                  className="flex min-h-14 w-full items-center gap-3 py-2 text-left transition-colors hover:bg-sunk/40"
                >
                  <LogOut className="size-4.5 shrink-0 text-coral" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-bold text-coral">Sign out</span>
                    <span className="block text-[12px] text-ink-muted">Log out of your account</span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-ink-faint/60" aria-hidden />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* BottomNav's own -mx-5 assumes the px-5 every .screen wrapper carries
          elsewhere — restored here since this page uses its own container. */}
      <div className="px-5">
        <BottomNav active="profile" />
      </div>

      {openField === "sessionLength" && (
        <PreferenceEditSheet
          label="Preferred session length"
          options={["5-10 min", "10-15 min", "15-30 min", "30+ min"]}
          current={preferences.sessionLength}
          onSelect={(v) => setPreference("sessionLength", v as LearningPreferences["sessionLength"])}
          onClose={() => setOpenField(null)}
        />
      )}
      {openField === "difficulty" && (
        <PreferenceEditSheet
          label="Challenge difficulty"
          options={["Adaptive", "Comfortable", "Challenging"]}
          current={preferences.difficulty}
          onSelect={(v) => setPreference("difficulty", v as LearningPreferences["difficulty"])}
          onClose={() => setOpenField(null)}
        />
      )}
      {openField === "learningStyle" && (
        <PreferenceEditSheet
          label="Learning style"
          options={["Practice first", "Learn then practice", "Balanced"]}
          current={preferences.learningStyle}
          onSelect={(v) => setPreference("learningStyle", v as LearningPreferences["learningStyle"])}
          onClose={() => setOpenField(null)}
        />
      )}
      {openField === "dailyGoal" && (
        <PreferenceEditSheet
          label="Daily goal"
          options={["1 challenge", "2 challenges", "3 challenges", "Custom"]}
          current={preferences.dailyGoal}
          onSelect={(v) => setPreference("dailyGoal", v as LearningPreferences["dailyGoal"])}
          onClose={() => setOpenField(null)}
        />
      )}
      {openField === "reminders" && (
        <PreferenceEditSheet
          label="Reminders"
          options={["On", "Off"]}
          current={preferences.reminders ? "On" : "Off"}
          onSelect={(v) => setPreference("reminders", v === "On")}
          onClose={() => setOpenField(null)}
        />
      )}

      {editingProfile && (
        <EditProfileSheet identity={identity} onClose={() => setEditingProfile(false)} />
      )}

      {confirmSignOut && (
        <SignOutConfirm
          onCancel={() => setConfirmSignOut(false)}
          onConfirm={() => {
            clearProfileIdentity();
            router.push("/login");
          }}
        />
      )}
    </div>
  );
}

function StatBox({
  value,
  label,
  tone,
  wide,
}: {
  value: string | number;
  label: string;
  tone: string;
  wide?: boolean;
}) {
  return (
    <div className={cn("rounded-[14px] p-2.5 text-center", tone, wide && "col-span-1")}>
      <p className="tnum text-[19px] leading-none font-extrabold">{value}</p>
      <p className="mt-1 text-[10.5px] leading-tight font-semibold [overflow-wrap:anywhere]">{label}</p>
    </div>
  );
}

function SkillChip({ label, done }: { label: string; done: boolean }) {
  return (
    <li
      className={cn(
        "flex items-center gap-1.5 rounded-[var(--radius-pill)] border px-2.5 py-1 text-[12px] font-semibold",
        done ? "border-skip/25 bg-skip-soft text-ink" : "border-primary-strong/25 bg-primary-soft text-ink",
      )}
    >
      {done ? (
        <Check className="size-3.5 shrink-0 text-skip" aria-hidden />
      ) : (
        <Circle className="size-3 shrink-0 text-primary-strong" aria-hidden />
      )}
      {label}
    </li>
  );
}

function PreferenceRow({
  icon: Icon,
  label,
  value,
  onClick,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="flex min-h-14 w-full items-center gap-3 py-2 text-left transition-colors hover:bg-sunk/40"
      >
        <Icon className="size-4.5 shrink-0 text-primary-strong" aria-hidden />
        <span className="min-w-0 flex-1 text-[14px] font-semibold">{label}</span>
        <span className="shrink-0 text-[13px] text-ink-muted">{value}</span>
        <ChevronRight className="size-4 shrink-0 text-ink-faint/60" aria-hidden />
      </button>
    </li>
  );
}

function AccountRow({
  icon: Icon,
  label,
  detail,
}: {
  icon: typeof UserRound;
  label: string;
  detail: string;
}) {
  return (
    <li>
      <span
        title="Coming soon"
        aria-disabled="true"
        className="flex min-h-14 w-full cursor-not-allowed items-center gap-3 py-2 text-left opacity-70"
      >
        <Icon className="size-4.5 shrink-0 text-ink-muted" aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-bold">{label}</span>
          <span className="block text-[12px] text-ink-muted">{detail}</span>
        </span>
        <ChevronRight className="size-4 shrink-0 text-ink-faint/60" aria-hidden />
      </span>
    </li>
  );
}

function EditProfileSheet({
  identity,
  onClose,
}: {
  identity: { name: string; email: string };
  onClose: () => void;
}) {
  const [name, setName] = useState(identity.name);
  const [email, setEmail] = useState(identity.email);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-ink/35" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Edit profile"
        className="quest-rise relative w-full max-w-[430px] rounded-t-[24px] border border-line bg-surface p-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] shadow-warm-lg"
      >
        <span aria-hidden className="mx-auto block h-1 w-10 rounded-full bg-line" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-sunk hover:text-ink"
        >
          <X className="size-4.5" aria-hidden />
        </button>

        <h2 className="mt-3 text-[18px] leading-tight font-extrabold">Edit profile</h2>
        <p className="mt-1 text-[12.5px] text-ink-muted">
          Career transition is fixed for this route — only your name and email are editable here.
        </p>

        <label htmlFor="edit-name" className="mt-4 block text-[13px] font-bold">
          Display name
        </label>
        <input
          id="edit-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Pathfinder"
          className="mt-1.5 min-h-12 w-full rounded-[14px] border border-line bg-canvas px-3.5 text-[14.5px] outline-none focus:border-primary-strong"
        />

        <label htmlFor="edit-email" className="mt-3 block text-[13px] font-bold">
          Email
        </label>
        <input
          id="edit-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1.5 min-h-12 w-full rounded-[14px] border border-line bg-canvas px-3.5 text-[14.5px] outline-none focus:border-primary-strong"
        />

        <button
          type="button"
          onClick={() => {
            saveProfileIdentity({ name: name.trim(), email: email.trim() });
            onClose();
          }}
          className="mt-4 flex min-h-12 w-full items-center justify-center rounded-[var(--radius-pill)] bg-primary text-[14.5px] font-bold text-ink"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}

function SignOutConfirm({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-ink/35" onClick={onCancel} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sign out of PandaRoute?"
        className="quest-rise relative w-full max-w-[360px] rounded-[20px] border border-line bg-surface p-5 shadow-warm-lg"
      >
        <h2 className="text-[17px] leading-tight font-extrabold">Sign out of PandaRoute?</h2>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">
          You can sign back in anytime and continue your journey.
        </p>
        <div className="mt-4 flex gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="flex min-h-11 flex-1 items-center justify-center rounded-[var(--radius-pill)] border border-line bg-canvas text-[14px] font-bold text-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex min-h-11 flex-1 items-center justify-center rounded-[var(--radius-pill)] bg-coral text-[14px] font-bold text-white"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
