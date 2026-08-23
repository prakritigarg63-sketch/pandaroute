/**
 * Panda's inline text formatting.
 *
 * One affordance only: **double asterisks** emphasise a term. Deliberately not
 * a markdown renderer — Panda's copy is authored in this repo, and a component
 * that can render arbitrary HTML is a liability for no gain.
 */
export function RichText({ content }: { content: string }) {
  return (
    <>
      {content.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-semibold text-ink">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
