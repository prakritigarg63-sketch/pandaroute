"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { PandaAside } from "@/components/panda/panda-aside";
import { PandaMascot } from "@/components/panda/panda-mascot";
import { CAPSTONE, CAPSTONE_STEPS, STEP_TITLES } from "@/lib/capstone/capstone";
import {
  patchCapstone,
  startCapstone,
  stepComplete,
  useCapstone,
} from "@/lib/capstone/use-capstone";

/* ---------------------------------------------------------------------------
   The capstone, steps one to five.

   Each step asks for the learner's own thinking and offers nothing back. The
   only scaffolding left is the structure of the questions — which is the point:
   real PM work comes with a situation and a blank page, not a prompt telling
   you which capability to reach for.

   Every keystroke is persisted, so leaving mid-answer loses nothing.
--------------------------------------------------------------------------- */

function Field({
  id,
  label,
  hint,
  placeholder,
  value,
  onChange,
  rows = 4,
}: {
  id: string;
  label: string;
  hint?: string;
  placeholder: string;
  value: string;
  onChange: (next: string) => void;
  rows?: number;
}) {
  return (
    <div className="mt-4">
      <label htmlFor={id} className="block text-[15px] leading-snug font-bold">
        {label}
      </label>
      {hint && <p className="mt-0.5 text-[12.5px] leading-snug text-ink-muted">{hint}</p>}
      <Card padded={false} className="mt-2 overflow-hidden">
        <textarea
          id={id}
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-[7.5rem] w-full resize-y bg-transparent p-3.5 text-[14px] leading-relaxed outline-none placeholder:text-ink-faint"
        />
      </Card>
    </div>
  );
}

export function CapstoneStep({ step }: { step: number }) {
  const router = useRouter();
  const state = useCapstone();

  const ready = stepComplete(state, step);

  const next = useCallback(() => {
    if (!ready) return;
    patchCapstone({ currentStep: Math.min(step + 1, CAPSTONE_STEPS) });
    router.push(step === CAPSTONE_STEPS ? "/capstone/review" : `/capstone/step/${step + 1}`);
  }, [ready, step, router]);

  const backHref = step === 1 ? "/capstone/brief" : `/capstone/step/${step - 1}`;

  const ctaLabel = [
    "Continue →",
    "Define the problem →",
    "Continue to solution →",
    "Build my recommendation →",
    "Submit my Capstone →",
  ][step - 1];

  const pandaLine = [
    CAPSTONE.panda.step1,
    CAPSTONE.panda.step2,
    CAPSTONE.panda.step3,
    CAPSTONE.panda.step4,
    CAPSTONE.panda.step5,
  ][step - 1];

  return (
    <div className="screen">
      <div className="flex items-center gap-3">
        <Link
          href={backHref}
          aria-label="Back"
          className="-ml-2 flex size-11 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-ink"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </Link>
        <span className="text-[11px] font-bold tracking-[0.12em] text-ink-faint uppercase">
          Capstone · {step} of {CAPSTONE_STEPS}
        </span>
      </div>

      <Progress
        value={step}
        max={CAPSTONE_STEPS}
        label={`Capstone step ${step} of ${CAPSTONE_STEPS}`}
        className="mt-2.5"
      />

      <div key={step} className="gps-rise mt-4 flex flex-1 flex-col">
        <h1 className="text-[24px] leading-tight font-extrabold text-balance">
          {STEP_TITLES[step - 1]}
        </h1>

        {step === 1 && (
          <>
            <p className="mt-1.5 text-[14px] leading-snug text-ink-muted">
              Before proposing anything, tell us what you think is happening.
            </p>

            <p className="mt-4 text-[15px] font-bold">What stands out?</p>
            <div
              role="group"
              aria-label="What stands out?"
              className="mt-2 grid grid-cols-2 gap-2"
            >
              {CAPSTONE.signals.map((signal) => {
                const picked = state.selectedSignals.includes(signal.id);
                return (
                  <button
                    key={signal.id}
                    type="button"
                    aria-pressed={picked}
                    onClick={() =>
                      patchCapstone({
                        selectedSignals: picked
                          ? state.selectedSignals.filter((id) => id !== signal.id)
                          : [...state.selectedSignals, signal.id],
                      })
                    }
                    className={cn(
                      "flex min-h-11 items-center gap-2 rounded-[var(--radius-card)] border p-3 text-left transition-colors",
                      picked
                        ? "border-primary-strong bg-primary-soft"
                        : "border-line bg-surface hover:bg-sunk/50",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded border",
                        picked ? "border-primary-strong bg-primary" : "border-line",
                      )}
                    >
                      {picked && <Check className="size-3 text-ink" />}
                    </span>
                    <span className="min-w-0">
                      <span className="tnum block text-[15px] leading-none font-extrabold">
                        {signal.value}
                      </span>
                      <span className="mt-0.5 block text-[11.5px] leading-tight text-ink-muted">
                        {signal.label}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <Field
              id="investigation"
              label="What would you investigate first?"
              placeholder="Write your reasoning…"
              value={state.investigationReasoning}
              onChange={(investigationReasoning) => patchCapstone({ investigationReasoning })}
            />

            <Field
              id="unknowns"
              label="What don't you know yet?"
              placeholder="List the questions you'd want answered…"
              value={state.unknownQuestions}
              onChange={(unknownQuestions) => patchCapstone({ unknownQuestions })}
            />
          </>
        )}

        {step === 2 && (
          <>
            <p className="mt-4 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
              User interviews
            </p>
            <ul className="mt-2 flex flex-col gap-2">
              {CAPSTONE.quotes.map((quote) => (
                <li key={quote.id}>
                  <Card padded={false} className="border-l-4 border-l-primary">
                    <p className="p-3 text-[13.5px] leading-snug">“{quote.text}”</p>
                  </Card>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
              Behaviour
            </p>
            <ul className="mt-2 flex flex-col gap-2">
              {CAPSTONE.behaviours.map((behaviour) => (
                <li
                  key={behaviour.id}
                  className="flex items-start gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-3"
                >
                  <span className="tnum shrink-0 text-[15px] font-extrabold text-primary-ink">
                    {behaviour.value}
                  </span>
                  <span className="text-[13px] leading-snug text-ink-muted">
                    {behaviour.text}
                  </span>
                </li>
              ))}
            </ul>

            <Field
              id="framing"
              label="Based on this evidence, what do you believe the core problem is?"
              placeholder="Frame the problem…"
              value={state.problemFraming}
              onChange={(problemFraming) => patchCapstone({ problemFraming })}
            />

            <Field
              id="support"
              label="What evidence supports your conclusion?"
              placeholder="Write your reasoning…"
              value={state.supportingEvidence}
              onChange={(supportingEvidence) => patchCapstone({ supportingEvidence })}
            />
          </>
        )}

        {step === 3 && (
          <>
            <ul className="mt-4 flex flex-col gap-2">
              {CAPSTONE.framework.map((part) => (
                <li
                  key={part.id}
                  className="flex items-start gap-2.5 rounded-[var(--radius-card)] border border-line bg-surface p-3"
                >
                  <span
                    aria-hidden
                    className="mt-1 size-2.5 shrink-0 rounded-[3px] bg-success"
                  />
                  <span className="min-w-0">
                    <span className="block text-[14px] leading-snug font-bold">
                      {part.name}
                    </span>
                    <span className="mt-0.5 block text-[12.5px] leading-snug text-ink-muted">
                      {part.question}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <Field
              id="statement"
              label="Your problem statement"
              hint={CAPSTONE.statementTemplate}
              placeholder="Write your problem statement…"
              rows={5}
              value={state.problemStatement}
              onChange={(problemStatement) => patchCapstone({ problemStatement })}
            />

            <p className="mt-2 rounded-[var(--radius-tile)] bg-sunk/60 p-3 text-[12.5px] leading-snug text-ink-muted">
              <span className="font-semibold">Example — not your answer:</span>{" "}
              {CAPSTONE.statementExample}
            </p>
          </>
        )}

        {step === 4 && (
          <>
            <p className="mt-1.5 text-[14px] leading-snug text-ink-muted">
              Generate a few ways to address the problem before choosing one.
            </p>

            <p className="mt-4 text-[15px] font-bold">Add your ideas</p>
            <div className="mt-2 flex flex-col gap-2">
              {state.ideas.map((idea, index) => (
                <div key={index}>
                  <label htmlFor={`idea-${index}`} className="sr-only">
                    Idea {index + 1}
                  </label>
                  <input
                    id={`idea-${index}`}
                    value={idea}
                    placeholder={
                      index === 0
                        ? "Describe your idea…"
                        : index === 1
                          ? "Describe another approach…"
                          : "Add another idea (optional)…"
                    }
                    onChange={(event) => {
                      const ideas = [...state.ideas];
                      ideas[index] = event.target.value;
                      patchCapstone({ ideas });
                    }}
                    className="min-h-11 w-full rounded-[var(--radius-card)] border border-line bg-surface px-3.5 text-[14px] outline-none placeholder:text-ink-faint"
                  />
                </div>
              ))}
            </div>

            <label htmlFor="priority" className="mt-4 block text-[15px] font-bold">
              Which would you prioritise first?
            </label>
            <select
              id="priority"
              value={state.prioritizedIdea}
              onChange={(event) => patchCapstone({ prioritizedIdea: event.target.value })}
              className="mt-2 min-h-11 w-full rounded-[var(--radius-card)] border border-line bg-surface px-3 text-[14px] outline-none"
            >
              <option value="">Select your top idea…</option>
              {state.ideas
                .map((idea, index) => ({ idea: idea.trim(), index }))
                .filter((entry) => entry.idea.length > 0)
                .map((entry) => (
                  <option key={entry.index} value={entry.idea}>
                    {entry.idea.slice(0, 60)}
                  </option>
                ))}
            </select>

            <Field
              id="why"
              label="Why?"
              hint="Consider user impact, confidence in the problem, effort and learning value."
              placeholder="Explain your decision…"
              value={state.prioritizationReasoning}
              onChange={(prioritizationReasoning) => patchCapstone({ prioritizationReasoning })}
            />
          </>
        )}

        {step === 5 && (
          <>
            <label htmlFor="metric" className="mt-4 block text-[15px] font-bold">
              Primary metric
            </label>
            <p className="mt-0.5 text-[12.5px] text-ink-muted">Choose or enter a metric.</p>
            <select
              id="metric"
              value={state.primaryMetric}
              onChange={(event) => patchCapstone({ primaryMetric: event.target.value })}
              className="mt-2 min-h-11 w-full rounded-[var(--radius-card)] border border-line bg-surface px-3 text-[14px] outline-none"
            >
              <option value="">Select a metric…</option>
              {CAPSTONE.metricOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
              <option value="custom">Custom metric</option>
            </select>

            <Field
              id="metric-why"
              label="Why this metric?"
              placeholder="Explain your reasoning…"
              value={state.metricReasoning}
              onChange={(metricReasoning) => patchCapstone({ metricReasoning })}
            />

            <label htmlFor="guardrail" className="mt-4 block text-[15px] font-bold">
              Guardrail metric
            </label>
            <p className="mt-0.5 text-[12.5px] leading-snug text-ink-muted">
              What would you watch to make sure the change doesn&apos;t create another
              problem?
            </p>
            <input
              id="guardrail"
              value={state.guardrailMetric}
              placeholder="Add a guardrail…"
              onChange={(event) => patchCapstone({ guardrailMetric: event.target.value })}
              className="mt-2 min-h-11 w-full rounded-[var(--radius-card)] border border-line bg-surface px-3.5 text-[14px] outline-none placeholder:text-ink-faint"
            />

            <Field
              id="criteria"
              label="What result would make you continue, iterate or stop?"
              placeholder="Write your decision criteria…"
              value={state.decisionCriteria}
              onChange={(decisionCriteria) => patchCapstone({ decisionCriteria })}
            />
          </>
        )}
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          {pandaLine && <PandaAside message={pandaLine} />}
          <Button size="lg" full onClick={next} disabled={!ready}>
            {ctaLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CapstoneIntro() {
  return (
    <div className="screen screen-flush">
      <span className="w-fit rounded-[var(--radius-pill)] bg-primary-fill px-2.5 py-1 text-[11px] font-bold tracking-[0.1em] text-primary-ink uppercase">
        {CAPSTONE.label}
      </span>

      <div className="gps-rise mt-3 flex flex-1 flex-col">
        <div className="flex justify-center">
          <PandaMascot reaction="celebrate" size="large" />
        </div>

        <h1 className="mt-3 text-[26px] leading-tight font-extrabold text-balance">
          {CAPSTONE.title}
        </h1>
        <p className="mt-1.5 text-[14px] leading-snug text-ink-muted text-balance">
          {CAPSTONE.standfirst}
        </p>

        <Card className="mt-4 border-primary-strong/35 bg-primary-soft">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
            The challenge
          </p>
          <p className="mt-1 text-[16px] leading-snug font-bold">
            {CAPSTONE.challengeTitle}
          </p>
          {CAPSTONE.scenario.map((line) => (
            <p key={line} className="mt-2 text-[13.5px] leading-relaxed text-ink-muted">
              {line}
            </p>
          ))}
        </Card>

        <p className="mt-4 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
          What you know
        </p>
        <ul className="mt-2 grid grid-cols-3 gap-2">
          {CAPSTONE.metrics.map((metric) => (
            <li
              key={metric.id}
              className="rounded-[var(--radius-card)] border border-line bg-surface px-1 py-2.5 text-center"
            >
              <p className="tnum text-[16px] leading-none font-extrabold">{metric.value}</p>
              <p className="mt-1 text-[10px] leading-tight text-ink-muted [overflow-wrap:anywhere]">
                {metric.label}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
          Your goal
        </p>
        <p className="mt-1.5 text-[14px] leading-relaxed">{CAPSTONE.goal}</p>
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside mascot={false} message={CAPSTONE.panda.intro} />
          <Button size="lg" full href="/capstone/step/1" onClick={startCapstone}>
            Start my Capstone →
          </Button>
        </div>
      </div>
    </div>
  );
}
