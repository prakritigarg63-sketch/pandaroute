"use client";

import { CapstoneLocked, CapstoneUnlocked } from "@/components/route/next-screens";
import { CAPSTONE_REQUIREMENT } from "@/lib/challenge/challenges";
import { progression, useLoop } from "@/lib/challenge/use-challenge";

export default function CapstonePage() {
  const counts = progression(useLoop());

  return counts.coreVerified >= CAPSTONE_REQUIREMENT ? (
    <CapstoneUnlocked />
  ) : (
    <CapstoneLocked />
  );
}
