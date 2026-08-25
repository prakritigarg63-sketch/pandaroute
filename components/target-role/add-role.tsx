"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PandaAside } from "@/components/panda/panda-aside";
import { RoleBackBar } from "@/components/target-role/shared";
import { ROLE_PANDA, ROLE_TITLE, SAMPLE_JD } from "@/lib/target-role/data";
import { startRoleAnalysis } from "@/lib/target-role/use-target-role";

/* ---------------------------------------------------------------------------
   Adding the target role.

   Product Manager is the only option — this MVP validates one transition, the
   same honesty the role dropdown on the onboarding transition screen already
   commits to (locked destination, other routes marked coming soon). The
   upload button simulates a file the same way: it fills the sample JD rather
   than pretending to parse a real one.
--------------------------------------------------------------------------- */

const MIN_WORDS = 25;

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function AddTargetRole() {
  const router = useRouter();
  const [jd, setJd] = useState("");
  const [company, setCompany] = useState("");

  const ready = wordCount(jd) >= MIN_WORDS;

  const useSample = useCallback(() => setJd(SAMPLE_JD), []);

  const analyze = useCallback(() => {
    if (!ready) return;
    startRoleAnalysis(jd.trim(), company.trim());
    router.push("/role/analyzing");
  }, [ready, jd, company, router]);

  return (
    <div className="screen">
      <RoleBackBar href="/role" />

      <div className="gps-rise mt-3 flex flex-1 flex-col">
        <h1 className="text-[24px] leading-tight font-extrabold">Add a target role</h1>

        <label htmlFor="role" className="mt-4 block text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
          Role
        </label>
        <div
          id="role"
          className="mt-1.5 flex min-h-11 items-center justify-between rounded-[var(--radius-card)] border border-line bg-sunk/50 px-3.5 text-[15px] font-bold text-ink-muted"
        >
          {ROLE_TITLE}
          <span className="text-[11px] font-semibold tracking-[0.06em] text-ink-faint uppercase">
            Only route
          </span>
        </div>

        <label htmlFor="jd" className="mt-4 block text-[15px] font-bold">
          Add the job description
        </label>
        <Card padded={false} className="mt-2 overflow-hidden">
          <textarea
            id="jd"
            rows={7}
            value={jd}
            onChange={(event) => setJd(event.target.value)}
            placeholder="Paste the job description here…"
            className="min-h-[11.25rem] w-full resize-y bg-transparent p-3.5 text-[14px] leading-relaxed outline-none placeholder:text-ink-faint"
          />
        </Card>

        <div className="mt-2 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={useSample}
            className="text-[12.5px] font-bold text-primary-ink underline underline-offset-4"
          >
            Use sample PM role
          </button>
          {!ready && jd.length > 0 && (
            <span className="text-[11.5px] text-ink-faint">
              {MIN_WORDS - wordCount(jd)} more words to go
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={useSample}
          className="mt-3 flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-card)] border border-dashed border-line text-[14px] font-bold text-ink-muted transition-colors hover:bg-sunk/50"
        >
          <Upload className="size-4" aria-hidden />
          Upload job description
        </button>

        <label htmlFor="company" className="mt-4 block text-[15px] font-bold">
          Company <span className="font-normal text-ink-faint">(optional)</span>
        </label>
        <input
          id="company"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          placeholder="e.g. Acme Inc."
          className="mt-2 min-h-11 w-full rounded-[var(--radius-card)] border border-line bg-surface px-3.5 text-[14px] outline-none placeholder:text-ink-faint"
        />
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside message={ROLE_PANDA.addRole} />
          <Button size="lg" full onClick={analyze} disabled={!ready}>
            Analyze this role →
          </Button>
        </div>
      </div>
    </div>
  );
}
