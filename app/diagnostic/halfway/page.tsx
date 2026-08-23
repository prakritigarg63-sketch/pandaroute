import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { PandaMascot } from "@/components/panda/panda-mascot";
import { TOTAL_QUESTIONS } from "@/lib/diagnostic/questions";

/**
 * A beat after question six.
 *
 * No score, no summary of how it is going — telling someone how they are doing
 * mid-diagnostic changes how they answer the rest. Just an honest signal that
 * the route is forming, and a way back into the scenarios.
 */
export default function HalfwayPage() {
  return (
    <div className="screen">
      <Progress
        value={6}
        max={TOTAL_QUESTIONS}
        label={`6 of ${TOTAL_QUESTIONS} scenarios done`}
      />

      <div className="gps-rise flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <PandaMascot reaction="celebrate" size="large" />

        <h1 className="text-[28px] leading-tight font-extrabold">Halfway there! 🙌</h1>

        <p className="max-w-[19rem] text-[15px] leading-snug font-semibold text-balance">
          I&apos;m starting to see how you approach trade-offs and technical problems.
        </p>

        <p className="max-w-[19rem] text-[14px] leading-relaxed text-ink-muted text-balance">
          Keep answering naturally — your route is taking shape.
        </p>
      </div>

      <Button size="lg" full href="/diagnostic/question/7" className="mt-4">
        Keep going →
      </Button>
    </div>
  );
}
