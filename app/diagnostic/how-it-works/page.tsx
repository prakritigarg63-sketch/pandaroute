import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PandaMascot } from "@/components/panda/panda-mascot";
import { PandaAside } from "@/components/panda/panda-aside";

/**
 * The last screen before the first scenario.
 *
 * Three cards, because the learner is about to spend fifteen minutes and
 * deserves to know what is being looked at: the situations are real, the
 * thinking is the point, and the output is their own route.
 */
const POINTS = [
  {
    id: "situations",
    icon: "🧩",
    title: "Real situations",
    body: "Work through realistic product and tech scenarios.",
  },
  {
    id: "thinking",
    icon: "🧠",
    title: "Your thinking",
    body: "We look at how you approach the situation, not what you've memorised.",
  },
  {
    id: "route",
    icon: "🧭",
    title: "Your route",
    body: "Your answers help map your strengths and gaps.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="screen">
      <div className="flex items-center gap-2">
        <Link
          href="/diagnostic"
          aria-label="Back to the diagnostic introduction"
          className="-ml-2 flex size-11 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-ink"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </Link>
        <h1 className="text-[17px] font-extrabold">How it works</h1>
      </div>

      <div className="gps-rise mt-4 flex flex-1 flex-col">
        <div className="flex justify-center">
          <PandaMascot reaction="thinking" size="large" />
        </div>

        <h2 className="mt-4 text-[22px] leading-tight font-extrabold">What we&apos;ll do</h2>

        <ul className="mt-3 flex flex-col gap-2.5">
          {POINTS.map((point) => (
            <li key={point.id}>
              <Card padded={false} className="flex items-start gap-3 p-3.5">
                <span aria-hidden className="text-[18px] leading-none">
                  {point.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] leading-snug font-bold">{point.title}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-ink-muted">
                    {point.body}
                  </span>
                </span>
              </Card>
            </li>
          ))}
        </ul>
      </div>

      <div className="sticky-cta">
        <div className="flex flex-col gap-2.5">
          <PandaAside
            mascot={false}
            message="There's no score to chase. Just think through each situation naturally."
          />
          <Button size="lg" full href="/diagnostic/question/1">
            Let&apos;s go →
          </Button>
        </div>
      </div>
    </div>
  );
}
