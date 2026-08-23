import Link from "next/link";

/**
 * Placeholder for the first diagnostic question, so "Start my diagnostic"
 * leads somewhere real. Replace this whole file when the diagnostic is built.
 */
export default function DiagnosticQuestionOnePage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center gap-2 px-6 py-8">
      <p className="text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
        Question 1
      </p>
      <h1 className="text-[26px] leading-tight font-extrabold">Diagnostic goes here</h1>
      <p className="text-[15px] leading-relaxed text-ink-muted">
        The first scenario question isn&apos;t built yet.
      </p>
      <Link
        href="/diagnostic"
        className="mt-2 self-start text-[15px] font-semibold text-primary-ink underline underline-offset-4"
      >
        Back to Panda&apos;s introduction
      </Link>
    </div>
  );
}
