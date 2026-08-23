"use client";

import { useRouter } from "next/navigation";
import { TransitionScreen } from "@/components/onboarding/transition-screen";

export default function TransitionPage() {
  const router = useRouter();

  return <TransitionScreen onBuild={() => router.push("/diagnostic")} />;
}
