"use client";

import { useRouter } from "next/navigation";
import { BuddyIntro } from "@/components/buddy/buddy-intro";

export default function OnboardingPage() {
  const router = useRouter();

  return <BuddyIntro onStart={() => router.push("/onboarding/transition")} />;
}
