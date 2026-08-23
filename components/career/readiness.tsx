"use client";

import { Check, CircleDot } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PandaAside } from "@/components/panda/panda-aside";
import { BottomNav } from "@/components/layout/bottom-nav";
import { CAPABILITY_BY_ID } from "@/lib/diagnostic/capabilities";
import { classifyAnswers } from "@/lib/diagnostic/scoring";
import { useDiagnostic } from "@/lib/diagnostic/use-diagnostic";
import { CAPSTONE } from "@/lib/capstone/capstone";
import { progression, useLoop, type CapabilityStatus } from "@/lib/challenge/use-challenge";

/* ---------------------------------------------------------------------------
   Career readiness.

   No percentage. A number like "87% PM ready" would be invented, and the whole
   product argues against invented measures — so this screen is a list of what
   the learner has evidence for, grouped the way a hiring conversation is, with
   the QA-credited strengths shown as exactly that.
--------------------------------------------------------------------------- */

const GROUPS: Array<{ name: string; ids: string[] }> = [
  { name: "Product Thinking", ids: ["product-discovery", "user-evidence", "prioritization"] },
  { name: "Data & Decisions", ids: ["product-metrics", "experimentation", "retention"] },
  {
    name: "Technical Fluency",
    ids: ["api-reasoning", "ai-product-thinking", "ai-reliability"],
  },
  { name: "Collaboration", ids: ["stakeholder-communication", "role-clarity"] },
];

const STATUS_LABEL: Partial<Record<CapabilityStatus, string>> = {
  verified: "Verified",
  developing: "Developing",
  learn: "Learn",
  practice: "Practice",
  skip: "Credited",
  "in-progress": "In progress",
};

function Row({ name, status }: { name: string; status: CapabilityStatus }) {
  const verified = status === "verified";
  const developing = status === "developing";

  return (
    <li className="flex items-center gap-2.5 rounded-[var(--radius-card)] border border-line bg-surface px-3.5 py-2.5">
      {verified ? (
        <Check className="size-4 shrink-0 text-success" aria-hidden />
      ) : developing ? (
        <CircleDot className="size-4 shrink-0 text-primary-strong" aria-hidden />
      ) : (
        <span
          aria-hidden
          className="size-3.5 shrink-0 rounded-full border-2 border-line"
        />
      )}

      <span className="min-w-0 flex-1 text-[14px] leading-snug font-semibold">{name}</span>

      <span
        className={cn(
          "shrink-0 text-[10px] font-bold tracking-[0.08em] uppercase",
          verified ? "text-success" : developing ? "text-primary-ink" : "text-ink-faint",
        )}
      >
        {STATUS_LABEL[status]}
      </span>
    </li>
  );
}

export function CareerReadiness() {
  const diagnostic = useDiagnostic();
  const loop = useLoop();
  const counts = progression(loop);

  const results = classifyAnswers(diagnostic.answers);
  const statusOf = (id: string): CapabilityStatus =>
    (loop.capabilities[id] ??
      results.find((r) => r.capabilityId === id)?.classification ??
      "learn") as CapabilityStatus;

  // Anything the diagnostic credited to QA experience is shown as exactly that
  // rather than mixed in with capabilities proved through challenges.
  const credited = results
    .filter((r) => r.classification === "skip" && loop.capabilities[r.capabilityId] !== "verified")
    .map((r) => CAPABILITY_BY_ID.get(r.capabilityId))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const creditedIds = new Set(credited.map((c) => c.id));

  return (
    <div className="screen screen-flush">
      <h1 className="text-[24px] leading-tight font-extrabold text-balance">
        Your PM Capability Profile
      </h1>

      <ul className="mt-4 grid grid-cols-3 gap-2">
        {[
          { icon: "🏆", value: counts.verified, label: "Verified" },
          { icon: "🧩", value: counts.challengesCompleted, label: "Challenges" },
          { icon: "🚀", value: counts.capstones, label: "Capstone" },
        ].map((stat) => (
          <li
            key={stat.label}
            className="rounded-[var(--radius-card)] border border-line bg-surface px-1 py-2.5 text-center"
          >
            <p className="text-[15px] leading-none" aria-hidden>
              {stat.icon}
            </p>
            <p className="tnum mt-1 text-[18px] leading-none font-extrabold">{stat.value}</p>
            <p className="mt-1 text-[10px] leading-tight text-ink-muted [overflow-wrap:anywhere]">
              {stat.label}
            </p>
          </li>
        ))}
      </ul>

      {GROUPS.map((group) => {
        const rows = group.ids
          .filter((id) => !creditedIds.has(id))
          .map((id) => ({ id, capability: CAPABILITY_BY_ID.get(id) }))
          .filter((row) => row.capability);

        if (rows.length === 0) return null;

        return (
          <section key={group.name} className="mt-5">
            <h2 className="text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
              {group.name}
            </h2>
            <ul className="mt-2 flex flex-col gap-1.5">
              {rows.map((row) => (
                <Row
                  key={row.id}
                  name={row.capability!.name}
                  status={statusOf(row.id)}
                />
              ))}
            </ul>
          </section>
        );
      })}

      {credited.length > 0 && (
        <section className="mt-5">
          <h2 className="text-[11px] font-semibold tracking-[0.12em] text-success uppercase">
            From your QA experience
          </h2>
          <ul className="mt-2 flex flex-col gap-1.5">
            {credited.map((capability) => (
              <li
                key={capability.id}
                className="flex items-center gap-2.5 rounded-[var(--radius-card)] border border-success/25 bg-skip-soft px-3.5 py-2.5"
              >
                <Check className="size-4 shrink-0 text-success" aria-hidden />
                <span className="min-w-0 flex-1 text-[14px] leading-snug font-semibold">
                  {capability.name}
                </span>
                <span className="shrink-0 text-[10px] font-bold tracking-[0.08em] text-skip uppercase">
                  Credited
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {counts.capstones > 0 && (
        <Card className="mt-5 border-primary-strong/35 bg-primary-soft">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
            Proof
          </p>
          <p className="mt-1 text-[15px] leading-snug font-bold">{CAPSTONE.proof.title}</p>
          <p className="mt-0.5 text-[11px] font-bold tracking-[0.08em] text-primary-ink uppercase">
            {CAPSTONE.proof.badge}
          </p>
        </Card>
      )}

      <div className="mt-auto flex flex-col gap-2.5 pt-5">
        <PandaAside message={CAPSTONE.panda.readiness} />
        <Button size="lg" full href="/next-steps">
          See my next steps →
        </Button>
      </div>

      <BottomNav active="progress" />
    </div>
  );
}

export function WhatsNext() {
  const loop = useLoop();
  const developing = Object.entries(loop.capabilities).find(
    ([, status]) => status === "developing",
  );
  const gapName = developing
    ? (CAPABILITY_BY_ID.get(developing[0])?.name ?? "Prioritization")
    : "Prioritization";

  const cards = [
    {
      id: "gap",
      icon: "🎯",
      title: "Strengthen one remaining gap",
      subject: gapName,
      body: "One capability still needs stronger evidence.",
      cta: "Practice again →",
      href: developing ? `/gap-map/${developing[0]}` : "/challenges",
    },
    {
      id: "portfolio",
      icon: "🏆",
      title: "Turn your proof into a portfolio story",
      subject: CAPSTONE.proof.title,
      body: "Convert your Capstone into a structured case you can discuss in interviews.",
      cta: "Build my case →",
      href: "/proof",
    },
    {
      id: "interview",
      icon: "🎤",
      title: "Practice explaining your decisions",
      subject: "“Tell me about a product problem you solved.”",
      body: "Walk through your Capstone as if an interviewer asked you that.",
      cta: "Practice interview →",
      href: "/proof",
    },
  ];

  return (
    <div className="screen screen-flush">
      <h1 className="text-[24px] leading-tight font-extrabold text-balance">
        Where do you go from here? 🧭
      </h1>
      <p className="mt-1 text-[14px] leading-snug text-ink-muted">
        Turn what you&apos;ve learned into career action.
      </p>

      <ul className="mt-4 flex flex-col gap-2.5">
        {cards.map((card) => (
          <li key={card.id}>
            <Card>
              <div className="flex items-start gap-3">
                <span className="text-[20px] leading-none" aria-hidden>
                  {card.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-[15px] leading-snug font-bold">{card.title}</p>
                  <p className="mt-0.5 text-[12.5px] font-semibold text-primary-ink">
                    {card.subject}
                  </p>
                  <p className="mt-1 text-[13px] leading-snug text-ink-muted">{card.body}</p>
                </div>
              </div>
              <Button size="md" full className="mt-3" href={card.href}>
                {card.cta}
              </Button>
            </Card>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-2.5 pt-5">
        <PandaAside message={CAPSTONE.panda.next} />
      </div>

      <BottomNav active="progress" />
    </div>
  );
}
