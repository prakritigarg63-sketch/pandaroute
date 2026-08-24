"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MissionDetailCard,
  MissionHero,
  NoGradesNote,
  PandaCoach,
  QuestCTA,
  QuestHeader,
  ScoringCategoryRow,
  SectionLabel,
} from "@/components/quest/quest-parts";
import {
  MISSION_DETAILS,
  QUEST_COPY,
  SCORING_CATEGORIES,
} from "@/components/quest/quest-data";
import { track } from "@/lib/analytics";
import { resumeIndex, useDiagnostic } from "@/lib/diagnostic/use-diagnostic";

/* ---------------------------------------------------------------------------
   Thinking Quest — the diagnostic introduction.

   Same job as before: explain what the diagnostic is, make clear it is not an
   exam, and get an experienced professional to start it. What changed is the
   framing — a first mission with a guide, a level and XP — because "assessment"
   is the word that stops people, and "mission" is the one that doesn't.

   The XP is real in the sense that it is promised for finishing, not sprinkled
   for tapping. Nothing here awards points for reading a screen.
--------------------------------------------------------------------------- */

/** Long enough to see the celebration, short enough not to be a wait. */
const HANDOFF_MS = 700;

/** Below this, an unmount is React remounting in development, not a learner leaving. */
const ABANDON_FLOOR_MS = 500;

export function ThinkingQuest() {
  const router = useRouter();
  const diagnostic = useDiagnostic();

  const [accepted, setAccepted] = useState(false);
  const [xp, setXp] = useState<string>(QUEST_COPY.startingXp);

  const leaving = useRef(false);
  const viewed = useRef(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const mountedAt = Date.now();

    // Refs survive React's development remount, so the view is counted once per
    // real visit rather than twice per page load.
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
      if (timer.current) window.clearTimeout(timer.current);
      if (Date.now() - mountedAt >= ABANDON_FLOOR_MS) abandon();
    };
  }, []);

  const accept = useCallback(() => {
    if (accepted) return;

    setAccepted(true);
    setXp(QUEST_COPY.xpAward);
    leaving.current = true;
    track("diagnostic_started", { resuming: resumeIndex(diagnostic) > 0 });

    // Straight into the first scenario the learner has not answered, so a
    // returning learner picks up where they stopped.
    timer.current = window.setTimeout(
      () => router.push(`/diagnostic/question/${resumeIndex(diagnostic) + 1}`),
      HANDOFF_MS,
    );
  }, [accepted, diagnostic, router]);

  return (
    <div className="screen quest-paper">
      <QuestHeader xp={xp} awarded={accepted} />

      <div className="flex flex-1 flex-col">
        <MissionHero celebrating={accepted} />

        <SectionLabel>{QUEST_COPY.detailsLabel}</SectionLabel>
        <ul className="mt-3 grid grid-cols-2 gap-2">
          {MISSION_DETAILS.map((detail, index) => (
            <MissionDetailCard key={detail.id} detail={detail} index={index} />
          ))}
        </ul>

        <SectionLabel>{QUEST_COPY.scoringLabel}</SectionLabel>
        <section
          className="quest-rise mt-3 rounded-[20px] border border-line bg-surface p-3.5 shadow-[0_8px_18px_-16px_rgba(93,71,33,0.6)]"
          style={{ "--delay": "560ms" } as React.CSSProperties}
        >
          <ul className="flex flex-col gap-3">
            {SCORING_CATEGORIES.map((category, index) => (
              <ScoringCategoryRow key={category.id} category={category} index={index} />
            ))}
          </ul>
          <NoGradesNote />
        </section>

        <PandaCoach celebrating={accepted} />
      </div>

      <QuestCTA onAccept={accept} accepted={accepted} />
    </div>
  );
}
