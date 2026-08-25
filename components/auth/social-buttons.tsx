"use client";

import { track } from "@/lib/analytics";

/* ---------------------------------------------------------------------------
   Google and Microsoft sign-in.

   No OAuth provider is wired up anywhere in this app — there is no backend to
   hand a token to. Rather than fake a popup or silently do nothing, both
   buttons are honest about it: they run the same simulated "continue" the
   email form does, so the button still does *something* true (gets you into
   the product) without pretending to have authenticated you against a real
   Google or Microsoft account. See the summary for this as a stated
   assumption.
--------------------------------------------------------------------------- */

function GoogleMark() {
  return (
    <svg viewBox="0 0 20 20" className="size-5 shrink-0" aria-hidden>
      <path
        fill="#4285F4"
        d="M19.6 10.23c0-.68-.06-1.32-.17-1.94H10v3.67h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.9-1.75 2.99-4.32 2.99-7.25Z"
      />
      <path
        fill="#34A853"
        d="M10 20c2.7 0 4.96-.89 6.61-2.42l-3.23-2.5c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H1.07v2.59A10 10 0 0 0 10 20Z"
      />
      <path
        fill="#FBBC05"
        d="M4.41 11.92a6.02 6.02 0 0 1 0-3.84V5.49H1.07a10 10 0 0 0 0 9.02l3.34-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M10 3.96c1.47 0 2.79.5 3.83 1.49l2.87-2.87A9.55 9.55 0 0 0 10 0 10 10 0 0 0 1.07 5.49l3.34 2.59C5.2 5.72 7.4 3.96 10 3.96Z"
      />
    </svg>
  );
}

function MicrosoftMark() {
  return (
    <svg viewBox="0 0 20 20" className="size-5 shrink-0" aria-hidden>
      <rect x="1" y="1" width="8.5" height="8.5" fill="#F25022" />
      <rect x="10.5" y="1" width="8.5" height="8.5" fill="#7FBA00" />
      <rect x="1" y="10.5" width="8.5" height="8.5" fill="#00A4EF" />
      <rect x="10.5" y="10.5" width="8.5" height="8.5" fill="#FFB900" />
    </svg>
  );
}

const PROVIDERS = [
  { id: "google", Mark: GoogleMark },
  { id: "microsoft", Mark: MicrosoftMark },
] as const;

export type SocialProvider = (typeof PROVIDERS)[number]["id"];

export function SocialButtons({
  onContinue,
  providers = ["google", "microsoft"],
  verb = "Continue",
  context = "login",
}: {
  onContinue: () => void;
  /** Which providers to show — signup only offers Google, per the brief. */
  providers?: SocialProvider[];
  /** "Continue with Google" on login, "Sign up with Google" on signup. */
  verb?: string;
  context?: "login" | "signup";
}) {
  const shown = PROVIDERS.filter((p) => providers.includes(p.id));

  return (
    <div className="flex flex-col gap-2.5">
      {shown.map(({ id, Mark }) => (
        <button
          key={id}
          type="button"
          onClick={() => {
            track("social_login_clicked", { provider: id, context });
            onContinue();
          }}
          className="flex min-h-[54px] w-full items-center justify-center gap-2.5 rounded-[18px] border border-line bg-surface text-[15px] font-bold text-ink transition-colors hover:bg-sunk/50"
        >
          <Mark />
          {verb} with {id === "google" ? "Google" : "Microsoft"}
        </button>
      ))}
    </div>
  );
}
