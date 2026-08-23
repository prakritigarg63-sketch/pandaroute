import { notFound } from "next/navigation";
import { CapstoneStep } from "@/components/capstone/capstone-steps";
import { CAPSTONE_STEPS } from "@/lib/capstone/capstone";

export function generateStaticParams() {
  return Array.from({ length: CAPSTONE_STEPS }, (_, i) => ({ n: String(i + 1) }));
}

export default async function CapstoneStepPage(props: PageProps<"/capstone/step/[n]">) {
  const { n } = await props.params;
  const step = Number(n);

  if (!Number.isInteger(step) || step < 1 || step > CAPSTONE_STEPS) notFound();

  return <CapstoneStep key={step} step={step} />;
}
