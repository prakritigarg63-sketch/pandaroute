import { redirect } from "next/navigation";

// The app now opens on sign-in — see components/auth/login-page.tsx. Login and
// signup both hand off to Home (or Route, for a returning user) on success;
// see lib/auth/use-login.ts and lib/auth/use-signup.ts.
export default function Page() {
  redirect("/login");
}
