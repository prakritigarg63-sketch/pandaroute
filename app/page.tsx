import { redirect } from "next/navigation";

// PandaRoute's Home page lives at /home now — see components/landing/landing-page.tsx.
// This keeps `/` working for anyone who already has it bookmarked. Home's own
// CTAs are what send a first-time visitor to sign in — see use-home-cta.ts.
export default function Page() {
  redirect("/home");
}
