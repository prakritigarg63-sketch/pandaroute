import { Compass } from "lucide-react";
import { FOOTER_LINKS } from "@/lib/landing/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-line px-5 py-8">
      <div className="mx-auto flex w-full max-w-[430px] flex-col items-center gap-4 lg:max-w-3xl">
        <span className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-[10px] bg-primary-soft text-primary-ink">
            <Compass className="size-3.5" aria-hidden />
          </span>
          <span className="font-display text-[14px] font-extrabold">PandaRoute</span>
        </span>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className="flex min-h-11 items-center text-[13px] font-semibold text-ink-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="text-[11.5px] text-ink-faint">
          © {new Date().getFullYear()} PandaRoute. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
