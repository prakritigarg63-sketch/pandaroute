import { notFound } from "next/navigation";
import { CapabilityVerified } from "@/components/challenge/challenge-screens";
import { CHALLENGES, CHALLENGE_BY_ID } from "@/lib/challenge/challenges";

export function generateStaticParams() {
  return CHALLENGES.map((challenge) => ({ id: challenge.id }));
}

export default async function Page(props: PageProps<"/challenge/[id]/verified">) {
  const { id } = await props.params;
  const challenge = CHALLENGE_BY_ID.get(id);
  if (!challenge) notFound();

  return <CapabilityVerified challenge={challenge} />;
}
