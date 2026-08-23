import { cn } from "@/lib/cn";
import { RichText } from "@/components/buddy/rich-text";

/**
 * One message from Panda.
 *
 * A chat bubble, not a chat: these are authored lines that appear in order, so
 * there is no typing indicator and no wait. The bold opener carries the point
 * and the body explains it, which is what makes a bubble scannable on a phone.
 */
export function PandaMessage({
  lead,
  body,
  className,
}: {
  lead: string;
  body?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "panda-bubble-in max-w-[86%] rounded-[var(--radius-card)] rounded-tl-sm",
        "border border-line bg-surface px-3.5 py-3",
        className,
      )}
    >
      <p className="text-[14px] leading-snug font-bold text-balance">{lead}</p>
      {body && (
        <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
          <RichText content={body} />
        </p>
      )}
    </div>
  );
}
