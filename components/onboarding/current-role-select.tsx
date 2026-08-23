"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, ClipboardCheck, Lock } from "lucide-react";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import {
  CURRENT_ROLE_OPTIONS,
  UNAVAILABLE_NOTE,
  type CurrentRoleOption,
} from "@/lib/current-roles";

/**
 * The starting-role selector.
 *
 * A combobox over a listbox rather than a native <select>, because the list has
 * to show what is coming as well as what works: a locked row is the honest way
 * to say "planned, not built", and a native select cannot carry a lock, a
 * section heading, or a reaction when someone taps one.
 *
 * The panel is positioned absolutely so opening it never moves the questions
 * below, and it scrolls internally rather than growing past the fold.
 */

const MAX_PANEL_HEIGHT = "min(60vh, 336px)";

export function CurrentRoleSelect({
  value,
  onSelect,
  onUnavailable,
  className,
}: {
  /** id of the selected role. */
  value: string;
  onSelect: (id: string) => void;
  /** A locked role was tapped — the screen decides how Panda answers. */
  onUnavailable: (option: CurrentRoleOption) => void;
  className?: string;
}) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [note, setNote] = useState<string | null>(null);

  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const selected =
    CURRENT_ROLE_OPTIONS.find((option) => option.id === value) ?? CURRENT_ROLE_OPTIONS[0];

  const optionId = (index: number) => `${listId}-option-${index}`;

  // Tracking lives outside the state updaters on purpose: React may call an
  // updater more than once, and an event logged from inside one gets counted
  // twice for a single tap.
  const close = useCallback((reason: "selected" | "dismissed") => {
    setOpen(false);
    setNote(null);
    track("current_role_dropdown_closed", { reason });
  }, []);

  const toggle = useCallback(() => {
    if (open) {
      close("dismissed");
      return;
    }

    setActive(CURRENT_ROLE_OPTIONS.findIndex((option) => option.id === value));
    setOpen(true);
    track("current_role_dropdown_opened");
  }, [open, close, value]);

  const choose = useCallback(
    (option: CurrentRoleOption) => {
      if (!option.enabled) {
        track("disabled_role_clicked", { roleId: option.id });
        setNote(UNAVAILABLE_NOTE);
        onUnavailable(option);
        return;
      }

      onSelect(option.id);
      close("selected");
      trigger.current?.focus();
    },
    [onSelect, onUnavailable, close],
  );

  // Any tap outside the control puts it away.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) close("dismissed");
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);

  // Keep the highlighted row in view while arrowing through a scrolling list.
  useEffect(() => {
    if (!open) return;
    panel.current
      ?.querySelector(`#${CSS.escape(optionId(active))}`)
      ?.scrollIntoView({ block: "nearest" });
    // optionId is derived from listId, which is stable for the component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, active, listId]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      close("dismissed");
      trigger.current?.focus();
      return;
    }

    if (!open && (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      toggle();
      return;
    }

    if (!open) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (i + step + CURRENT_ROLE_OPTIONS.length) % CURRENT_ROLE_OPTIONS.length);
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      setActive(event.key === "Home" ? 0 : CURRENT_ROLE_OPTIONS.length - 1);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(CURRENT_ROLE_OPTIONS[active]);
    }
  };

  const available = CURRENT_ROLE_OPTIONS.filter((option) => option.enabled);
  const comingSoon = CURRENT_ROLE_OPTIONS.filter((option) => !option.enabled);

  const renderOption = (option: CurrentRoleOption) => {
    const index = CURRENT_ROLE_OPTIONS.indexOf(option);
    const isSelected = option.id === value;
    const isActive = index === active;

    return (
      <li key={option.id}>
        <button
          type="button"
          id={optionId(index)}
          role="option"
          aria-selected={isSelected}
          aria-disabled={!option.enabled}
          tabIndex={-1}
          onClick={() => choose(option)}
          className={cn(
            "flex min-h-11 w-full items-center gap-2.5 rounded-[var(--radius-tile)] px-3 py-2 text-left transition-colors",
            option.enabled
              ? "text-ink hover:bg-primary-soft"
              : "cursor-not-allowed text-ink-faint",
            isSelected && "bg-primary-fill",
            isActive && !isSelected && "bg-sunk",
          )}
        >
          <span className="min-w-0 flex-1 text-[14px] leading-snug font-semibold">
            {option.label}
          </span>

          {option.enabled ? (
            isSelected && <Check className="size-4 shrink-0 text-primary-strong" aria-hidden />
          ) : (
            <Lock className="size-3.5 shrink-0 text-ink-faint/80" aria-hidden />
          )}
        </button>
      </li>
    );
  };

  return (
    <div ref={root} className={cn("relative", className)} onKeyDown={onKeyDown}>
      <button
        ref={trigger}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="listbox"
        aria-activedescendant={open ? optionId(active) : undefined}
        aria-label={`Current role: ${selected.label}. Change starting role`}
        onClick={toggle}
        className={cn(
          "flex w-full items-center gap-3 rounded-[var(--radius-card)] border bg-surface p-3.5 text-left transition-colors",
          open ? "border-primary-strong" : "border-line hover:border-primary-strong/50",
        )}
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-tile)] bg-sunk">
          <ClipboardCheck className="size-5 text-ink-muted" aria-hidden />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
            From
          </span>
          <span className="block truncate text-[17px] leading-snug font-bold">
            {selected.label}
          </span>
        </span>

        <ChevronDown
          aria-hidden
          className={cn(
            "size-5 shrink-0 text-ink-faint transition-transform",
            open && "rotate-180 text-primary-strong",
          )}
        />
      </button>

      {open && (
        <div
          ref={panel}
          className="panda-bubble-in absolute top-full right-0 left-0 z-20 mt-1.5 overflow-y-auto rounded-[var(--radius-card)] border border-line bg-surface p-1.5 shadow-warm-lg"
          style={{ maxHeight: MAX_PANEL_HEIGHT }}
        >
          <ul id={listId} role="listbox" aria-label="Starting role">
            <li>
              <p className="px-3 pt-1.5 pb-1 text-[10px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
                Available now
              </p>
            </li>
            {available.map(renderOption)}

            <li>
              <p className="mt-1 border-t border-line-light px-3 pt-2.5 pb-1 text-[10px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
                Coming soon
              </p>
            </li>
            {comingSoon.map(renderOption)}
          </ul>

          {note && (
            <p
              role="status"
              className="mx-1.5 mt-1.5 mb-1 rounded-[var(--radius-tile)] bg-primary-soft px-3 py-2 text-[12px] leading-snug text-ink-muted"
            >
              {note}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
