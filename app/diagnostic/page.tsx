"use client";

import { useRouter } from "next/navigation";
import { DiagnosticIntro } from "@/components/onboarding/diagnostic-intro";

export default function DiagnosticIntroPage() {
  const router = useRouter();

  return <DiagnosticIntro onStart={() => router.push("/diagnostic/question-1")} />;
}
