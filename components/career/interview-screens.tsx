"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowDown, Check, ChevronLeft, CircleDot, Mic, PenLine } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { CriteriaDots } from "@/components/challenge/challenge-chrome";
import { PandaAside } from "@/components/panda/panda-aside";
import { PandaMascot } from "@/components/panda/panda-mascot";
import { BottomNav } from "@/components/layout/bottom-nav";
import {
  COACHING_EXAMPLE,
  COACHING_FRAME,
  COACHING_ORIGINAL,
  INTERVIEW_CRITERIA,
  INTERVIEW_FEEDBACK,
  INTERVIEW_QUESTION,
} from "@/lib/career/portfolio";
import { longEnough, saveInterview, useCareer } from "@/lib/career/use-career";
import { progression, useLoop } from "@/lib/challenge/use-challenge";
import { TRACKED_REQUIREMENT_IDS } from "@/lib/target-role/data";
import { resolveRequirements, useTargetRole } from "@/lib/target-role/use-target-role";

/* ---------------------------------------------------------------------------
   Interview practice.

   Same loop as a challenge — attempt, feedback, targeted coaching, retry — but
   pointed at communication rather than product thinking. The learner's answer
   is theirs: Panda supplies a structure and names what is missing, and never
   writes the sentence.
--------------------------------------------------------------------------- */

function BackBar({ href, label }: { href: string; label?: string }) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={href}
        aria-label="Back"
        className="-ml-2 flex size-11 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-ink"
      >
        <ChevronLeft className="size-5" aria-hidden />
      </Link>
      {label && (
        <span className="text-[11px] font-bold tracking-[0.12em] text-ink-faint uppercase">
          {label}
        </span>
      )}
    </div>
  );
}

export function InterviewQuestion({ attempt }: { attempt: 1 | 2 }) {
  const router = useRouter();
  const career = useCareer();
  const [text, setText] = useState(
    attempt === 1 ? (career.interview?.attempt1 ?? "") : (career.interview?.attempt2 ?? ""),
  );
  const [helpOpen, setHelpOpen] = useState(false);
  const [firstOpen, setFirstOpen] = useState(false);

  const ready = longEnough(text);

  const submit = useCallback(() => {
    if (!ready) return;

    saveInterview({
      question: INTERVIEW_QUESTION,
      ...(attempt === 1
        ? {
            attempt1: text.trim(),
            demonstrated: ["problem", "evidence", "impact"],
            strengthen: ["decision"],
            status: "feedback",
          }
        : {
            attempt2: text.trim(),
            demonstrated: INTERVIEW_CRITERIA.map((c) => c.id),
            strengthen: [],
            status: "ready",
          }),
    });

    router.push(attempt === 1 ? "/interview/feedback" : "/interview/improvement");
  }, [ready, attempt, text, router]);

  return (
    <div className="screen">
      <BackBar
        href={attempt === 1 ? "/career/case" : "/interview/coaching"}
        label={attempt === 1 ? "Question 1 of 5" : "Attempt 2"}
      />
      {attempt === 1 && (
        <Progress value={1} max={5} label="Interview question 1 of 5" className="mt-2.5" />
      )}

      <div className="gps-rise mt-4 flex flex-1 flex-col">
        <h1 className="text-[22px] leading-snug font-extrabold text-balance">
          {attempt === 1
            ? `“${INTERVIEW_QUESTION}”`
            : "Tell me about the product problem again."}
        </h1>

        {attempt === 1 ? (
          <p className="mt-1.5 text-[14px] text-ink-muted">
            Use your AI Product Activation case.
          </p>
        ) : (
          <p className="mt-1.5 text-[14px] text-ink-muted">
            Focus this time: <span className="font-bold text-ink">decision rationale</span>
          </p>
        )}

        {attempt === 1 ? (
          <div className="mt-3">
            <button
              type="button"
              aria-expanded={helpOpen}
              onClick={() => setHelpOpen((open) => !open)}
              className="flex min-h-11 w-full items-center justify-between rounded-[var(--radius-card)] border border-line bg-surface px-3.5 text-left text-[13.5px] font-semibold transition-colors hover:bg-sunk/50"
            >
              Need help structuring your answer?
              <span aria-hidden className="text-ink-faint">
                {helpOpen ? "−" : "+"}
              </span>
            </button>

            {helpOpen && (
              <ul className="panda-bubble-in mt-1.5 flex flex-col items-center gap-1 rounded-[var(--radius-card)] border border-line bg-sunk/40 p-3">
                {["Problem", "Evidence", "Decision", "Outcome"].map((step, i) => (
                  <li key={step} className="flex flex-col items-center gap-1">
                    <span className="text-[13px] font-bold">{step}</span>
                    {i < 3 && <ArrowDown className="size-3.5 text-ink-faint" aria-hidden />}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          career.interview?.attempt1 && (
            <div className="mt-3">
              <button
                type="button"
                aria-expanded={firstOpen}
                onClick={() => setFirstOpen((open) => !open)}
                className="flex min-h-11 w-full items-center justify-between rounded-[var(--radius-card)] border border-line bg-surface px-3.5 text-left text-[13.5px] font-semibold transition-colors hover:bg-sunk/50"
              >
                View my first attempt
                <span aria-hidden className="text-ink-faint">
                  {firstOpen ? "−" : "+"}
                </span>
              </button>

              {firstOpen && (
                <p className="panda-bubble-in mt-1.5 rounded-[var(--radius-card)] border border-line bg-sunk/50 p-3.5 text-[13px] leading-relaxed whitespace-pre-wrap text-ink-muted">
                  {career.interview.attempt1}
                </p>
              )}
            </div>
          )
        )}

        {attempt === 1 && (
          <div role="tablist" aria-label="Response mode" className="mt-4 flex gap-2">
            <span
              role="tab"
              aria-selected="true"
              className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-card)] border border-primary-strong bg-primary-soft text-[13px] font-semibold"
            >
              <PenLine className="size-4" aria-hidden />
              Type response
            </span>
            <span
              role="tab"
              aria-selected="false"
              aria-disabled="true"
              className="flex min-h-11 flex-1 flex-col items-center justify-center rounded-[var(--radius-card)] border border-line bg-surface text-[13px] font-semibold text-ink-faint"
            >
              <span className="flex items-center gap-1.5">
                <Mic className="size-4" aria-hidden />
                Speak response
              </span>
              <span className="text-[9px] tracking-[0.08em] uppercase">Coming soon</span>
            </span>
          </div>
        )}

        <Card padded={false} className="mt-3 overflow-hidden">
          <label htmlFor="answer" className="sr-only">
            Your answer
          </label>
          <textarea
            id="answer"
            rows={7}
            value={text}
            placeholder={attempt === 1 ? "Start your answer…" : "Give it another try…"}
            onChange={(event) => setText(event.target.value)}
            className="min-h-[11.25rem] w-full resize-y bg-transparent p-3.5 text-[14px] leading-relaxed outline-none placeholder:text-ink-faint"
          />
        </Card>
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside
            reaction={attempt === 1 ? "idle" : "helpful"}
            message={
              attempt === 1
                ? "I'll listen first. Feedback comes after."
                : "You've got this. Make that decision rationale really clear."
            }
          />
          <Button size="lg" full onClick={submit} disabled={!ready}>
            {attempt === 1 ? "Submit answer →" : "Submit retry →"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function InterviewFeedback() {
  return (
    <div className="screen">
      <BackBar href="/interview" />

      <div className="gps-rise mt-2 flex flex-1 flex-col">
        <h1 className="text-[24px] leading-tight font-extrabold text-balance">
          Your answer, broken down 🔍
        </h1>

        <h2 className="mt-4 text-[13px] font-bold text-success">Strong</h2>
        <ul className="mt-2 flex flex-col gap-2">
          {INTERVIEW_FEEDBACK.strong.map((item) => (
            <li key={item.id}>
              <Card padded={false} className="flex items-start gap-2.5 border-success/30 bg-skip-soft p-3.5">
                <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                <span className="min-w-0">
                  <span className="block text-[14px] leading-snug font-bold">{item.name}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-ink-muted">
                    {item.note}
                  </span>
                </span>
              </Card>
            </li>
          ))}
        </ul>

        <h2 className="mt-4 text-[13px] font-bold text-primary-ink">Strengthen</h2>
        <ul className="mt-2 flex flex-col gap-2">
          {INTERVIEW_FEEDBACK.strengthen.map((item) => (
            <li key={item.id}>
              <Card padded={false} className="flex items-start gap-2.5 border-primary-strong/30 bg-primary-soft p-3.5">
                <CircleDot className="mt-0.5 size-4 shrink-0 text-primary-strong" aria-hidden />
                <span className="min-w-0">
                  <span className="block text-[14px] leading-snug font-bold">{item.name}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-ink-muted">
                    {item.note}
                  </span>
                </span>
              </Card>
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
            Interview story
          </p>
          <ul className="mt-2 flex flex-col gap-1">
            {INTERVIEW_CRITERIA.map((criterion) => {
              const open = criterion.id === "decision";
              return (
                <li
                  key={criterion.id}
                  className="flex items-center gap-2 text-[13.5px] font-semibold"
                >
                  {open ? (
                    <CircleDot className="size-4 text-primary-strong" aria-hidden />
                  ) : (
                    <Check className="size-4 text-success" aria-hidden />
                  )}
                  {criterion.name}
                </li>
              );
            })}
          </ul>
          <div className="mt-2.5 flex items-center gap-3">
            <CriteriaDots demonstrated={3} total={4} />
            <span className="tnum text-[13px] font-semibold text-ink-muted">
              3 of 4 demonstrated
            </span>
          </div>
        </div>
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside
            reaction="helpful"
            message="Your thinking is strong. Now we're working on how clearly you communicate it."
          />
          <Button size="lg" full href="/interview/coaching">
            Improve my answer →
          </Button>
        </div>
      </div>
    </div>
  );
}

export function InterviewCoaching() {
  return (
    <div className="screen">
      <BackBar href="/interview/feedback" label="Targeted coaching" />

      <div className="gps-rise mt-3 flex flex-1 flex-col">
        <h1 className="text-[24px] leading-tight font-extrabold text-balance">
          Make your decision clearer
        </h1>

        <p className="mt-4 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
          Original sentence
        </p>
        <Card padded={false} className="mt-1.5">
          <p className="p-3 text-[13.5px] leading-snug italic">“{COACHING_ORIGINAL}”</p>
        </Card>

        <p className="mt-4 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
          Stronger structure
        </p>
        <ol className="mt-2 flex flex-col items-stretch gap-1">
          {COACHING_FRAME.map((part, index) => (
            <li key={part.id} className="flex flex-col items-center gap-1">
              <div className="w-full rounded-[var(--radius-card)] border border-primary-strong/30 bg-primary-soft p-3">
                <p className="text-[13.5px] font-bold">{part.lead}</p>
                <p className="mt-0.5 text-[12.5px] leading-snug text-ink-muted">{part.hint}</p>
              </div>
              {index < COACHING_FRAME.length - 1 && (
                <ArrowDown className="size-3.5 text-ink-faint" aria-hidden />
              )}
            </li>
          ))}
        </ol>

        <p className="mt-4 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
          Example structure
        </p>
        <p className="mt-1.5 rounded-[var(--radius-card)] border border-line bg-sunk/40 p-3 text-[13px] leading-relaxed text-ink-muted">
          {COACHING_EXAMPLE}
        </p>
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside message="Use the structure. Keep the thinking yours." />
          <Button size="lg" full href="/interview/retry">
            Try again →
          </Button>
        </div>
      </div>
    </div>
  );
}

export function InterviewImprovement() {
  return (
    <div className="screen">
      <div className="gps-rise flex flex-1 flex-col">
        <h1 className="text-[25px] leading-tight font-extrabold text-balance">
          Your story got stronger ↑
        </h1>

        <div className="mt-4 flex flex-col items-center gap-1.5">
          <div className="w-full rounded-[var(--radius-card)] border border-line bg-surface p-3.5">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
              Attempt 1
            </p>
            <p className="tnum mt-1 text-[15px] font-bold">3 / 4 demonstrated</p>
            <CriteriaDots demonstrated={3} total={4} className="mt-2" />
          </div>

          <ArrowDown className="size-5 text-ink-faint" aria-hidden />

          <div className="w-full rounded-[var(--radius-card)] border border-success/35 bg-skip-soft p-3.5">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-success uppercase">
              Attempt 2
            </p>
            <p className="tnum mt-1 text-[15px] font-bold">4 / 4 demonstrated</p>
            <CriteriaDots demonstrated={4} total={4} tone="green" className="mt-2" />
          </div>
        </div>

        <h2 className="mt-4 text-[13px] font-bold">Improved</h2>
        <ul className="mt-2 flex flex-col gap-1.5">
          {INTERVIEW_FEEDBACK.improved.map((item, index) => (
            <li
              key={item}
              className="flex items-center gap-2.5 rounded-[var(--radius-card)] border border-success/25 bg-skip-soft px-3.5 py-2.5"
            >
              <Check className="size-4 shrink-0 text-success" aria-hidden />
              <span
                className={cn(
                  "text-[13.5px] leading-snug",
                  index === 2 ? "font-bold" : "font-semibold",
                )}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside
            reaction="celebrate"
            message="Same product thinking. Much stronger story."
          />
          <Button size="lg" full href="/interview/ready">
            Complete practice →
          </Button>
        </div>
      </div>
    </div>
  );
}

export function InterviewReady() {
  return (
    <div className="screen">
      <div className="gps-rise flex flex-1 flex-col items-center gap-3 text-center">
        <PandaMascot reaction="celebrate" size="large" />

        <h1 className="text-[25px] leading-tight font-extrabold">Interview Story Ready 🎉</h1>
        <p className="text-[16px] leading-snug font-bold text-primary-ink">
          AI Product Activation
        </p>

        <p className="text-[14px] text-ink-muted">You can now explain:</p>
        <ul className="flex w-full flex-col gap-1.5 text-left">
          {[
            "The problem you identified",
            "The evidence you used",
            "The alternatives you considered",
            "Why you made your decision",
            "How you would measure success",
          ].map((item) => (
            <li
              key={item}
              className="flex items-center gap-2.5 rounded-[var(--radius-card)] border border-success/25 bg-skip-soft px-3.5 py-2.5"
            >
              <Check className="size-4 shrink-0 text-success" aria-hidden />
              <span className="text-[13.5px] leading-snug font-semibold">{item}</span>
            </li>
          ))}
        </ul>

        <Card className="mt-1 w-full border-primary-strong/35 bg-primary-soft text-left">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
            Added to your Career Kit
          </p>
          <p className="mt-1 text-[15px] leading-snug font-bold">🎤 PM Interview Story #1</p>
          <p className="mt-0.5 text-[13px] text-ink-muted">AI Product Activation Case</p>
        </Card>
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside
            mascot={false}
            message="You don't just have a case anymore. You can explain the thinking behind it."
          />
          <Button size="lg" full href="/career-kit">
            View my Career Kit →
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CareerKit() {
  const career = useCareer();
  const loop = useLoop();
  const counts = progression(loop);
  const targetRole = useTargetRole();

  const hasCase = career.caseStatus !== "none";
  const storyReady = career.interview?.status === "ready";
  const rolePrepared = targetRole.status === "prepared";

  // The role is still "developing" only while its shared capability actually
  // says so — once the role-prep challenge verifies it, this card has to stop
  // claiming otherwise.
  const stillDeveloping = loop.capabilities.prioritization !== "verified";

  const requirements = rolePrepared
    ? resolveRequirements(targetRole).filter((r) => TRACKED_REQUIREMENT_IDS.includes(r.id))
    : [];
  const supported = requirements.filter((r) => r.evidenceStatus === "proven").length;

  return (
    <div className="screen screen-flush">
      <h1 className="text-[25px] leading-tight font-extrabold">Your Career Kit 💼</h1>

      <section className="mt-4">
        <h2 className="text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
          Target role
        </h2>
        {rolePrepared ? (
          <div className="mt-2 rounded-[var(--radius-card)] border border-primary-strong/35 bg-primary-soft p-3.5">
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-[16px] leading-snug font-extrabold">
                <span aria-hidden>💼</span>
                {targetRole.roleTitle}
              </p>
              <span className="flex shrink-0 items-center gap-1 rounded-[var(--radius-pill)] bg-success/15 px-2 py-0.5 text-[10.5px] font-bold text-success">
                <Check className="size-3 shrink-0" aria-hidden />
                Prepared
              </span>
            </div>
            {targetRole.company && (
              <p className="mt-1 text-[12.5px] text-ink-muted">{targetRole.company}</p>
            )}
          </div>
        ) : (
          <Link
            href="/role"
            className="mt-2 flex items-center gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-3.5 transition-colors hover:bg-sunk/40"
          >
            <span className="text-[18px] leading-none" aria-hidden>
              🎯
            </span>
            <span className="min-w-0 flex-1 text-[14px] leading-snug font-bold">
              Test yourself against a real PM role
            </span>
          </Link>
        )}
      </section>

      <section className="mt-4">
        <h2 className="text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
          Proof
        </h2>
        <Link
          href="/career/case/preview"
          className="mt-2 flex items-center gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-3.5 transition-colors hover:bg-sunk/40"
        >
          <span className="text-[18px] leading-none" aria-hidden>
            🏆
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] leading-snug font-bold">
              {hasCase ? "1 Portfolio Case" : "No portfolio case yet"}
            </span>
            <span className="mt-0.5 block text-[12.5px] text-ink-muted">
              AI Product Activation Case
            </span>
          </span>
        </Link>
      </section>

      <section className="mt-4">
        <h2 className="text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
          Interview
        </h2>
        <Link
          href="/interview"
          className="mt-2 flex items-center gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-3.5 transition-colors hover:bg-sunk/40"
        >
          <span className="text-[18px] leading-none" aria-hidden>
            🎤
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] leading-snug font-bold">
              {storyReady ? "1 Interview Story Ready" : "No interview story yet"}
            </span>
            <span className="mt-0.5 block text-[12.5px] text-ink-muted">
              AI Product Activation Case
            </span>
          </span>
        </Link>
      </section>

      <section className="mt-4">
        <h2 className="text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
          Capabilities
        </h2>
        <Link
          href="/readiness"
          className="mt-2 flex items-center gap-3 rounded-[var(--radius-card)] border border-success/30 bg-skip-soft p-3.5"
        >
          <span className="text-[18px] leading-none" aria-hidden>
            🏆
          </span>
          <span className="min-w-0 flex-1 text-[14px] leading-snug font-bold">
            {counts.verified} Verified
          </span>
        </Link>
      </section>

      {stillDeveloping && (
        <section className="mt-4">
          <h2 className="text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
            Still developing
          </h2>
          <Link
            href="/gap-map/prioritization"
            className="mt-2 flex items-center gap-3 rounded-[var(--radius-card)] border border-primary-strong/30 bg-primary-soft p-3.5"
          >
            <CircleDot className="size-4 shrink-0 text-primary-strong" aria-hidden />
            <span className="min-w-0 flex-1 text-[14px] leading-snug font-bold">
              Prioritization
            </span>
          </Link>
        </section>
      )}

      {rolePrepared && (
        <section className="mt-4">
          <h2 className="text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
            Role alignment
          </h2>
          <div className="mt-2 flex items-center gap-3 rounded-[var(--radius-card)] border border-success/30 bg-skip-soft p-3.5">
            <span className="text-[18px] leading-none" aria-hidden>
              🎯
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] leading-snug font-bold">
                Core requirements supported
              </span>
              <span className="tnum mt-0.5 block text-[12.5px] text-ink-muted">
                {supported} of {requirements.length} for {targetRole.roleTitle}
              </span>
            </span>
          </div>
        </section>
      )}

      <Card className="mt-5 border-primary-strong/40 bg-primary-soft">
        <p className="text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
          {rolePrepared ? "Next action" : "Recommended next action"}
        </p>
        <p className="mt-1 text-[15px] leading-snug font-bold">
          {rolePrepared
            ? `Practice your ${targetRole.roleTitle} interview`
            : "Practice a Prioritization interview question"}
        </p>
        <p className="mt-1 text-[13px] leading-snug text-ink-muted">
          {rolePrepared
            ? "Focus on the capabilities this role emphasizes."
            : "Strengthen your remaining gap while creating another interview story."}
        </p>
        <Button size="md" full className="mt-3" href="/interview">
          {rolePrepared ? "Start role-specific practice →" : "Start practice →"}
        </Button>
      </Card>

      <div className="mt-auto flex flex-col gap-2.5 pt-5">
        <PandaAside
          message={
            rolePrepared
              ? "Your route now adapts to the opportunity you're pursuing."
              : "Every step you take builds stronger proof for your PM transition."
          }
        />
      </div>

      <BottomNav active="progress" />
    </div>
  );
}
