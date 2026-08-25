import { redirect } from "next/navigation";

// PandaRoute's Home page lives at /home now — see components/landing/landing-page.tsx.
// This keeps `/` working for anyone who already has it bookmarked.
export default function Page() {
  redirect("/home");
}
