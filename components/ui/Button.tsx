import { cn } from "@/lib/cn";

/**
 * Thumb-friendly by default: `size="lg"` is the primary mobile CTA and clears
 * a 44px tap target with room to spare.
 */
const SIZE = {
  md: "min-h-11 px-5 text-[15px]",
  lg: "min-h-13 px-6 text-base",
} as const;

const VARIANT = {
  primary: "bg-primary text-ink hover:bg-amber-600 active:bg-amber-700",
  outline: "border border-line bg-surface text-ink hover:bg-sunk active:bg-sunk",
} as const;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof VARIANT;
  size?: keyof typeof SIZE;
  full?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  full = false,
  className,
  type,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type ?? "button"}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)]",
        "font-semibold transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-45",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        VARIANT[variant],
        SIZE[size],
        full && "w-full",
        className,
      )}
      {...rest}
    />
  );
}
