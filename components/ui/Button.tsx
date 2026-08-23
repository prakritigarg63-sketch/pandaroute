import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Thumb-friendly by default: `size="lg"` is the primary mobile CTA and clears
 * a 44px tap target with room to spare.
 *
 * Pass `href` and it renders a link with the same skin — a CTA that navigates
 * should be a link, so it opens in a new tab, prefetches, and reads correctly
 * to a screen reader.
 */
const SIZE = {
  md: "min-h-11 px-5 text-[15px]",
  lg: "min-h-13 px-6 text-base",
} as const;

const VARIANT = {
  primary: "bg-primary text-ink hover:bg-amber-600 active:bg-amber-700",
  outline: "border border-line bg-surface text-ink hover:bg-sunk active:bg-sunk",
} as const;

interface Skin {
  variant?: keyof typeof VARIANT;
  size?: keyof typeof SIZE;
  full?: boolean;
  className?: string;
}

function skin({ variant = "primary", size = "md", full = false, className }: Skin): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)]",
    "font-semibold transition-colors",
    "disabled:cursor-not-allowed disabled:opacity-45",
    "focus-visible:outline-2 focus-visible:outline-offset-2",
    VARIANT[variant],
    SIZE[size],
    full && "w-full",
    className,
  );
}

type ButtonProps = Skin &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkProps = Skin &
  Omit<React.ComponentProps<typeof Link>, "className"> & { href: string };

export function Button(props: ButtonProps | LinkProps) {
  if (props.href !== undefined) {
    const { href, variant, size, full, className, ...rest } = props as LinkProps;
    return <Link href={href} className={skin({ variant, size, full, className })} {...rest} />;
  }

  const { variant, size, full, className, type, ...rest } = props as ButtonProps;
  return (
    <button
      type={type ?? "button"}
      className={skin({ variant, size, full, className })}
      {...rest}
    />
  );
}
