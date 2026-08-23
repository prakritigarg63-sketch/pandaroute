import { notFound } from "next/navigation";
import { CHALLENGE_BY_ID } from "@/lib/challenge/challenges";

export default async function ChallengeLayout(props: LayoutProps<"/challenge/[id]">) {
  const { id } = await props.params;
  if (!CHALLENGE_BY_ID.has(id)) notFound();

  return props.children;
}
