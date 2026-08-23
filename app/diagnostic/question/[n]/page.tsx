import { notFound } from "next/navigation";
import { QuestionScreen } from "@/components/diagnostic/question-screen";
import { TOTAL_QUESTIONS } from "@/lib/diagnostic/questions";

export function generateStaticParams() {
  return Array.from({ length: TOTAL_QUESTIONS }, (_, i) => ({ n: String(i + 1) }));
}

export default async function DiagnosticQuestionPage(
  props: PageProps<"/diagnostic/question/[n]">,
) {
  const { n } = await props.params;
  const index = Number(n) - 1;

  if (!Number.isInteger(index) || index < 0 || index >= TOTAL_QUESTIONS) notFound();

  // Keyed so moving between scenarios mounts a fresh screen rather than
  // carrying the previous question's selection across.
  return <QuestionScreen key={index} index={index} />;
}
