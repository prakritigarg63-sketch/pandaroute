"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDown, Check, ChevronLeft, ChevronRight, CircleDot } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { PandaAside } from "@/components/panda/panda-aside";
import { PandaMascot } from "@/components/panda/panda-mascot";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useCapstone } from "@/lib/capstone/use-capstone";
import {
  CAPABILITY_CHIPS,
  CASE_SUMMARY,
  EVIDENCE_CHIPS,
  STORY_STEPS,
  deriveCase,
} from "@/lib/career/portfolio";
import { editCase, markCaseReady, useCareer } from "@/lib/career/use-career";

/* ---------------------------------------------------------------------------
   Turning proof into something someone else can read.

   Nothing on these screens asks the learner to think the problem through
   again — the capstone already holds their reasoning, and every field arrives
   filled with it. The work here is packaging and, on the decision screen, the
   one thing the capstone did not ask: what they chose *not* to do.
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

function EditableField({
  id,
  label,
  value,
  onChange,
  rows = 3,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  rows?: number;
}) {
  return (
    <div className="mt-4">
      <label htmlFor={id} className="block text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
        {label}
      </label>
      <Card padded={false} className="mt-1.5 overflow-hidden">
        <textarea
          id={id}
          rows={rows}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-[5.5rem] w-full resize-y bg-transparent p-3.5 text-[13.5px] leading-relaxed outline-none"
        />
      </Card>
    </div>
  );
}

export function CareerHub() {
  const cards = [
    {
      id: "portfolio",
      icon: "🏆",
      title: "Build your portfolio case",
      body: "Turn your Capstone into a clear PM case study.",
      href: "/career/evidence",
      recommended: true,
    },
    {
      id: "interview",
      icon: "🎤",
      title: "Practice your interview story",
      body: "Learn to explain your decisions confidently.",
      href: "/interview",
      recommended: false,
    },
    {
      id: "gap",
      icon: "🎯",
      title: "Strengthen Prioritization",
      body: "Close your remaining capability gap.",
      href: "/gap-map/prioritization",
      recommended: false,
    },
  ];

  return (
    <div className="screen screen-flush">
      <h1 className="text-[25px] leading-tight font-extrabold text-balance">
        You&apos;ve built the skills. Now use them. 🚀
      </h1>
      <p className="mt-1.5 text-[14px] leading-snug text-ink-muted">
        Your capability profile shows what you can do. Now let&apos;s turn that evidence
        into something you can use in your PM transition.
      </p>

      <ul className="mt-4 flex flex-col gap-2.5">
        {cards.map((card) => (
          <li key={card.id}>
            <Link
              href={card.href}
              className={cn(
                "flex items-start gap-3 rounded-[var(--radius-card)] border p-3.5 transition-colors",
                card.recommended
                  ? "border-primary-strong/40 bg-primary-soft"
                  : "border-line bg-surface hover:bg-sunk/40",
              )}
            >
              <span className="text-[20px] leading-none" aria-hidden>
                {card.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] leading-snug font-bold">{card.title}</span>
                <span className="mt-0.5 block text-[13px] leading-snug text-ink-muted">
                  {card.body}
                </span>
                {card.recommended && (
                  <span className="mt-1.5 inline-block rounded-[var(--radius-pill)] bg-primary-fill px-2 py-0.5 text-[10px] font-bold tracking-[0.08em] text-primary-ink uppercase">
                    Recommended
                  </span>
                )}
              </span>
              <ChevronRight className="size-4 shrink-0 self-center text-ink-faint/60" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-2.5 pt-5">
        <PandaAside message="You've built the evidence. Now we need to make it easy for someone else to see it." />
      </div>

      <BottomNav active="progress" />
    </div>
  );
}

export function ExistingEvidence() {
  const capstone = useCapstone();
  const career = useCareer();
  const portfolio = deriveCase(capstone, career.caseEdits);

  return (
    <div className="screen">
      <BackBar href="/career" />

      <div className="gps-rise mt-2 flex flex-1 flex-col">
        <h1 className="text-[24px] leading-tight font-extrabold text-balance">
          Your evidence is already here.
        </h1>
        <p className="mt-1.5 text-[14px] leading-snug text-ink-muted">
          Pandaroute has captured your thinking from the Capstone.
        </p>

        <Card className="mt-4 border-primary-strong/35">
          <p className="text-[17px] leading-snug font-extrabold">{portfolio.title}</p>
          <p className="mt-0.5 text-[11px] font-bold tracking-[0.08em] text-primary-ink uppercase">
            Capstone · Completed
          </p>

          <p className="mt-3 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
            Problem
          </p>
          <p className="mt-1 text-[13.5px] leading-snug">{portfolio.problem}</p>

          <p className="mt-3 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
            Evidence you analysed
          </p>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {EVIDENCE_CHIPS.map((chip) => (
              <li
                key={chip}
                className="rounded-[var(--radius-pill)] bg-primary-soft px-2.5 py-1 text-[11.5px] font-semibold text-primary-ink"
              >
                {chip}
              </li>
            ))}
          </ul>

          <p className="mt-3 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
            Problem you framed
          </p>
          <p className="mt-1 text-[13.5px] leading-snug">{portfolio.insight}</p>

          <p className="mt-3 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
            Your recommendation
          </p>
          <p className="mt-1 text-[13.5px] leading-snug">{portfolio.decision}</p>

          <p className="mt-3 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
            Success metric
          </p>
          <p className="mt-1 text-[13.5px] leading-snug font-semibold">
            {portfolio.primaryMetric}
          </p>
        </Card>

        <p className="mt-4 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
          Capabilities demonstrated
        </p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {CAPABILITY_CHIPS.map((chip) => (
            <li
              key={chip.name}
              className={cn(
                "flex items-center gap-1 rounded-[var(--radius-pill)] border px-2.5 py-1 text-[12px] font-semibold",
                chip.state === "verified"
                  ? "border-success/35 bg-skip-soft"
                  : "border-primary-strong/35 bg-primary-soft",
              )}
            >
              {chip.name}
              {chip.state === "verified" ? (
                <Check className="size-3.5 text-success" aria-hidden />
              ) : (
                <CircleDot className="size-3.5 text-primary-strong" aria-hidden />
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside message="You already did the hard part. Now let's turn your thinking into a story." />
          <Button size="lg" full href="/career/story">
            Build my story →
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CaseStory() {
  const capstone = useCapstone();
  const career = useCareer();
  const portfolio = deriveCase(capstone, career.caseEdits);

  return (
    <div className="screen">
      <BackBar href="/career/evidence" label="Step 1 of 5" />
      <Progress value={1} max={5} label="Portfolio step 1 of 5" className="mt-2.5" />

      <div className="gps-rise mt-4 flex flex-1 flex-col">
        <h1 className="text-[24px] leading-tight font-extrabold text-balance">
          Turn your work into a PM story ✍️
        </h1>
        <p className="mt-1.5 text-[14px] leading-snug text-ink-muted">
          We&apos;ll build it together using your Capstone thinking.
        </p>

        <ol className="mt-4 flex flex-col gap-1.5">
          {STORY_STEPS.map((step, index) => (
            <li
              key={step.id}
              className={cn(
                "flex items-start gap-2.5 rounded-[var(--radius-card)] border p-3",
                index === 0
                  ? "border-primary-strong/40 bg-primary-soft"
                  : "border-line bg-surface",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                  index === 0 ? "bg-primary text-ink" : "bg-sunk text-ink-muted",
                )}
              >
                {index + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] leading-snug font-bold">{step.name}</span>
                <span className="mt-0.5 block text-[12.5px] leading-snug text-ink-muted">
                  {step.question}
                </span>
              </span>
            </li>
          ))}
        </ol>

        <EditableField
          id="problem"
          label="Problem"
          value={portfolio.problem}
          onChange={(problem) => editCase({ problem })}
        />

        <div className="mt-4">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
            Evidence
          </p>
          <ul className="mt-1.5 flex flex-col gap-1">
            {portfolio.evidence.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[13.5px]">
                <Check className="size-4 shrink-0 text-success" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <EditableField
          id="insight"
          label="Insight"
          value={portfolio.insight}
          onChange={(insight) => editCase({ insight })}
          rows={4}
        />
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside message="We'll turn your thinking into a clear, compelling PM story." />
          <Button size="lg" full href="/career/decision">
            Continue →
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ProductDecision() {
  const capstone = useCapstone();
  const career = useCareer();
  const portfolio = deriveCase(capstone, career.caseEdits);
  const [tradeoff, setTradeoff] = useState(portfolio.tradeoff);

  const ready = tradeoff.trim().split(/\s+/).filter(Boolean).length >= 8;

  return (
    <div className="screen">
      <BackBar href="/career/story" label="Step 4 of 5" />
      <Progress value={4} max={5} label="Portfolio step 4 of 5" className="mt-2.5" />

      <div className="gps-rise mt-4 flex flex-1 flex-col">
        <h1 className="text-[24px] leading-tight font-extrabold text-balance">
          Show how you made the decision 🧠
        </h1>
        <p className="mt-1.5 text-[14px] leading-snug text-ink-muted">
          Hiring managers care about your thinking — not just the final idea.
        </p>

        <p className="mt-4 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
          Options you considered
        </p>
        <ul className="mt-2 flex flex-col gap-1.5">
          {portfolio.optionsConsidered.map((option, index) => {
            const chosen = option === portfolio.decision;
            return (
              <li
                key={option}
                className={cn(
                  "flex items-center gap-2.5 rounded-[var(--radius-card)] border p-3",
                  chosen
                    ? "border-primary-strong bg-primary-soft"
                    : "border-line bg-surface",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold",
                    chosen ? "border-primary-strong bg-primary text-ink" : "border-line text-ink-muted",
                  )}
                >
                  {["A", "B", "C", "D"][index] ?? "•"}
                </span>
                <span className="min-w-0 flex-1 text-[13.5px] leading-snug font-semibold">
                  {option}
                </span>
                {chosen && <Check className="size-4 shrink-0 text-primary-strong" aria-hidden />}
              </li>
            );
          })}
        </ul>

        <EditableField
          id="decision"
          label="Your decision"
          value={portfolio.decision}
          onChange={(decision) => editCase({ decision })}
        />

        <EditableField
          id="why"
          label="Why this approach?"
          value={portfolio.decisionReasoning}
          onChange={(decisionReasoning) => editCase({ decisionReasoning })}
          rows={4}
        />

        <div className="mt-4">
          <label htmlFor="tradeoff" className="block text-[15px] leading-snug font-bold">
            What did you choose NOT to do, and why?
          </label>
          <Card padded={false} className="mt-2 overflow-hidden">
            <textarea
              id="tradeoff"
              rows={4}
              value={tradeoff}
              placeholder="Explain the trade-off…"
              onChange={(event) => {
                setTradeoff(event.target.value);
                editCase({ tradeoff: event.target.value });
              }}
              className="min-h-[7rem] w-full resize-y bg-transparent p-3.5 text-[13.5px] leading-relaxed outline-none placeholder:text-ink-faint"
            />
          </Card>
        </div>
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside message="Strong PM stories show the trade-off, not just the final answer." />
          <Button size="lg" full href="/career/outcome" aria-disabled={!ready}>
            Continue →
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DefineOutcome() {
  const capstone = useCapstone();
  const career = useCareer();
  const portfolio = deriveCase(capstone, career.caseEdits);

  return (
    <div className="screen">
      <BackBar href="/career/decision" label="Step 5 of 5" />
      <Progress value={5} max={5} label="Portfolio step 5 of 5" className="mt-2.5" />

      <div className="gps-rise mt-4 flex flex-1 flex-col">
        <h1 className="text-[24px] leading-tight font-extrabold text-balance">
          Connect your decision to impact 📈
        </h1>

        <div className="mt-4 flex flex-col items-center gap-1.5">
          {[
            { label: "Problem", body: "22% meaningful task completion" },
            { label: "Your solution", body: portfolio.decision },
            { label: "Expected outcome", body: "Increase activation and early value" },
          ].map((row, index) => (
            <div key={row.label} className="flex w-full flex-col items-center gap-1.5">
              <div className="w-full rounded-[var(--radius-card)] border border-line bg-surface p-3 text-center">
                <p className="text-[10px] font-bold tracking-[0.12em] text-ink-faint uppercase">
                  {row.label}
                </p>
                <p className="mt-1 text-[13px] leading-snug font-semibold">{row.body}</p>
              </div>
              {index < 2 && <ArrowDown className="size-4 text-ink-faint" aria-hidden />}
            </div>
          ))}
        </div>

        <EditableField
          id="metric-why"
          label="Why this metric?"
          value={portfolio.expectedOutcome}
          onChange={(expectedOutcome) => editCase({ expectedOutcome })}
        />

        <div className="mt-4">
          <label
            htmlFor="guardrail"
            className="block text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase"
          >
            Guardrail metric
          </label>
          <input
            id="guardrail"
            value={portfolio.guardrailMetric}
            onChange={(event) => editCase({ guardrailMetric: event.target.value })}
            className="mt-1.5 min-h-11 w-full rounded-[var(--radius-card)] border border-line bg-surface px-3.5 text-[14px] outline-none"
          />
        </div>

        <Card className="mt-4 border-primary-strong/35 bg-primary-soft">
          <p className="text-[11px] font-bold tracking-[0.1em] text-primary-ink uppercase">
            Expected outcome — not a result
          </p>
          <p className="mt-1 text-[13px] leading-snug text-ink-muted">
            This case is a simulation, so it records what you would measure rather than
            claiming a shipped outcome.
          </p>
        </Card>
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside message="Since this is a simulation, we'll show what you would measure — not pretend the outcome actually happened." />
          <Button size="lg" full href="/career/case" onClick={markCaseReady}>
            Generate my case →
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CaseGenerated() {
  return (
    <div className="screen">
      <div className="gps-rise flex flex-1 flex-col items-center gap-3 text-center">
        <span className="trophy-in text-[48px] leading-none" aria-hidden>
          🏆
        </span>

        <h1 className="text-[25px] leading-tight font-extrabold">Your PM case is ready</h1>
        <p className="text-[16px] leading-snug font-bold text-primary-ink">
          AI Product Activation Case
        </p>

        <ol className="mt-1 flex w-full flex-col gap-1.5 text-left">
          {CASE_SUMMARY.map((row) => (
            <li
              key={row.n}
              className="flex items-start gap-2.5 rounded-[var(--radius-card)] border border-line bg-surface p-3"
            >
              <span className="tnum shrink-0 text-[12px] font-bold text-primary-ink">
                {row.n}
              </span>
              <span className="min-w-0">
                <span className="block text-[13.5px] leading-snug font-bold">{row.name}</span>
                <span className="mt-0.5 block text-[12.5px] leading-snug text-ink-muted">
                  {row.body}
                </span>
              </span>
            </li>
          ))}
        </ol>

        <PandaMascot reaction="celebrate" size="medium" />
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2">
          <Button size="lg" full href="/career/case/preview">
            Preview full case →
          </Button>
          <Button size="md" full variant="outline" href="/interview">
            Practice this story →
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CasePreview() {
  const capstone = useCapstone();
  const career = useCareer();
  const portfolio = deriveCase(capstone, career.caseEdits);

  return (
    <div className="screen">
      <BackBar href="/career/case" />

      {/* Deliberately unlike the rest of the app: this is the artefact someone
          else reads, so the learning furniture steps out of the way. */}
      <article className="gps-rise mt-2 flex flex-1 flex-col">
        <p className="text-[11px] font-bold tracking-[0.14em] text-primary-ink uppercase">
          AI Product Activation
        </p>
        <h1 className="mt-2 font-display text-[26px] leading-tight font-extrabold text-balance">
          Helping new users reach value faster
        </h1>
        <p className="mt-1 text-[13px] font-semibold text-ink-muted">
          Product Management Case Study
        </p>

        <h2 className="mt-5 text-[15px] font-bold">The problem</h2>
        <p className="mt-1.5 text-[14px] leading-relaxed text-ink-muted">
          {portfolio.problem}
        </p>

        <h2 className="mt-4 text-[15px] font-bold">What I investigated</h2>
        <p className="mt-2 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
          Quantitative
        </p>
        <ul className="mt-1 flex flex-col gap-1 text-[13.5px] leading-snug text-ink-muted">
          <li>46% leave before entering their first prompt</li>
          <li>38% rewrite their first prompt multiple times</li>
        </ul>
        <p className="mt-2.5 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
          Qualitative
        </p>
        <ul className="mt-1 flex flex-col gap-1 text-[13.5px] leading-snug text-ink-muted">
          <li>Unsure what to ask</li>
          <li>Unable to relate examples to their work</li>
          <li>Uncertain whether they could trust the output</li>
        </ul>

        <h2 className="mt-4 text-[15px] font-bold">My hypothesis</h2>
        <p className="mt-1.5 text-[14px] leading-relaxed text-ink-muted">{portfolio.insight}</p>

        <h2 className="mt-4 text-[15px] font-bold">My recommendation</h2>
        <p className="mt-1.5 text-[14px] leading-relaxed text-ink-muted">{portfolio.decision}</p>

        {portfolio.tradeoff && (
          <>
            <h2 className="mt-4 text-[15px] font-bold">The trade-off</h2>
            <p className="mt-1.5 text-[14px] leading-relaxed text-ink-muted">
              {portfolio.tradeoff}
            </p>
          </>
        )}

        <h2 className="mt-4 text-[15px] font-bold">How I would measure it</h2>
        <dl className="mt-1.5 flex flex-col gap-1.5 text-[13.5px]">
          {[
            ["Primary", portfolio.primaryMetric],
            ["Secondary", "7-day retention"],
            ["Guardrail", portfolio.guardrailMetric],
          ].map(([label, value]) => (
            <div key={label} className="flex gap-2">
              <dt className="w-20 shrink-0 font-semibold text-ink-faint">{label}</dt>
              <dd className="min-w-0 flex-1 text-ink-muted">{value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-5 border-t border-line pt-3 text-[11px] text-ink-faint">
          PM simulation · Built through Pandaroute
        </p>
      </article>

      <div className="sticky-cta">
        <Button size="lg" full href="/interview">
          Practice this story →
        </Button>
      </div>
    </div>
  );
}
