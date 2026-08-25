"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PandaAside } from "@/components/panda/panda-aside";
import { RoleBackBar } from "@/components/target-role/shared";
import { PRIORITIZATION_DEMONSTRATED, ROLE_PANDA } from "@/lib/target-role/data";
import { verifyPrioritization } from "@/lib/target-role/use-target-role";

/* ---------------------------------------------------------------------------
   Evidence check.

   Verifying happens the moment this screen mounts — the decision was already
   made on the previous screen, this is where it becomes evidence. The
   developing → verified swap plays once, a beat after arrival, so the
   learner sees the state change rather than just the end of it.
--------------------------------------------------------------------------- */

const VERIFY_DELAY_MS = 500;

export function RoleEvidenceCheck() {
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    verifyPrioritization();
    const timer = window.setTimeout(() => setVerified(true), VERIFY_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="screen">
      <RoleBackBar href="/role/challenge/decision" />

      <div className="gps-rise mt-3 flex flex-1 flex-col">
        <h1 className="text-[23px] leading-tight font-extrabold">
          Your prioritization thinking 🔍
        </h1>

        <h2 className="mt-4 text-[13px] font-bold text-success">✓ Demonstrated</h2>
        <ul className="mt-2 flex flex-col gap-2">
          {PRIORITIZATION_DEMONSTRATED.map((item) => (
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

        <h2 className="mt-4 text-[13px] font-bold">Now demonstrated</h2>
        <Card
          padded={false}
          className={cn(
            "mt-2 flex items-center justify-between gap-3 p-3.5 transition-colors duration-500",
            verified ? "border-success/35 bg-skip-soft" : "border-primary-strong/35 bg-primary-soft",
          )}
        >
          <p className="text-[15px] leading-snug font-extrabold">Prioritization</p>
          <span
            className={cn(
              "flex items-center gap-1 rounded-[var(--radius-pill)] px-2.5 py-1 text-[11px] font-bold tracking-[0.06em] uppercase transition-colors duration-500",
              verified ? "bg-success/15 text-success" : "bg-primary/15 text-primary-ink",
            )}
          >
            {verified && <Check className="size-3.5" aria-hidden />}
            {verified ? "Verified" : "Developing"}
          </span>
        </Card>
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside message={ROLE_PANDA.evidenceCheck} />
          <Button size="lg" full href="/role/match-updated">
            Update my job match →
          </Button>
        </div>
      </div>
    </div>
  );
}
