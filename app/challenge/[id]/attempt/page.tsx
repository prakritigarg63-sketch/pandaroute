import { notFound } from "next/navigation";
import { AttemptForm } from "@/components/challenge/attempt-form";
import { MetricsAttempt } from "@/components/challenge/metrics-attempt";
import { CHALLENGES, CHALLENGE_BY_ID } from "@/lib/challenge/challenges";

export function generateStaticParams() {
  return CHALLENGES.map((challenge) => ({ id: challenge.id }));
}

export default async function Page(props: PageProps<"/challenge/[id]/attempt">) {
  const { id } = await props.params;
  const challenge = CHALLENGE_BY_ID.get(id);
  if (!challenge) notFound();

  return challenge.kind === "metrics" ? (
    <MetricsAttempt challenge={challenge} attempt={1} />
  ) : (
    <AttemptForm challenge={challenge} attempt={1} />
  );
}
