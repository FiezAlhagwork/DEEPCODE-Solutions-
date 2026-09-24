"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ChevronDown, Inbox } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import SignOutButton from "@/components/admin/SignOutButton";
import Avatar from "@/components/kit/Avatar";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/Utils";
import type { AccountMenuProps } from "@/types/Shared";

/** Every focusable row in the menu, in order. */
const ITEM_SELECTOR = '[role="menuitem"]';

// The signed-in visitor's menu in the public navbar — built here rather than
// pulled from a menu library, like the rest of the site's controls.
//
// Behaviour follows the ARIA menu-button pattern: the trigger says what it
// opens and whether it is open, the first item takes focus on open, the arrow
// keys move between items, and Escape, a pick or a click outside closes it and
// hands focus back to the avatar.
//
// It opens towards the inline end of the bar's own edge (`inset-e-0`), so it
// grows back into the page in both directions — an absolutely positioned
// panel hanging past the viewport would make the whole page scroll sideways,
// which is what the header's tooltip once did.
export default function AccountMenu({ name, email, imageUrl }: AccountMenuProps) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  function items() {
    return Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? [],
    );
  }

  function close({ restoreFocus = true } = {}) {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }

  // Listens only while the menu is open, and only closes it — nothing here
  // copies props into state, so it stays clear of the set-state-in-effect rule.
  useEffect(() => {
    if (!open) return;

    items()[0]?.focus();

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function onMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const list = items();
    const index = list.indexOf(document.activeElement as HTMLElement);

    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      list[(index + 1) % list.length]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      list[(index - 1 + list.length) % list.length]?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      list[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      list[list.length - 1]?.focus();
    } else if (event.key === "Tab") {
      // Tabbing out of a menu closes it, without pulling focus back.
      close({ restoreFocus: false });
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={t("accountMenu")}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && !open) {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className="flex items-center gap-1 rounded-full p-0.5 text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        <Avatar name={name} imageUrl={imageUrl} />
        <ChevronDown
          aria-hidden
          className={cn("size-4 transition-transform", open && "rotate-180")}
        />
      </button>

      <div
        ref={menuRef}
        id={menuId}
        role="menu"
        aria-label={t("accountMenu")}
        hidden={!open}
        onKeyDown={onMenuKeyDown}
        className="absolute inset-e-0 top-full z-60 mt-2 w-60 rounded-xl border border-hairline-strong bg-surface-2 p-1.5 shadow-2xl"
      >
        {/* Who is signed in — read-only, so not a menu item. */}
        <div className="flex flex-col gap-0.5 border-b border-hairline px-3 pt-1.5 pb-2.5">
          <span className="truncate text-sm font-medium text-ink">{name}</span>
          {email && (
            // `self-start` rather than full width: an LTR box as wide as the
            // menu left-aligns the address under a right-aligned Arabic name.
            <span dir="ltr" className="max-w-full self-start truncate text-xs text-ink-faint">
              {email}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-0.5 pt-1.5">
          <Link
            href="/account/requests"
            role="menuitem"
            onClick={() => close({ restoreFocus: false })}
            className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-ink-muted transition-colors outline-none hover:bg-surface-3 hover:text-ink focus-visible:bg-surface-3 focus-visible:text-ink"
          >
            <Inbox className="size-4" aria-hidden />
            {t("myRequests")}
          </Link>

          <SignOutButton variant="menuItem" redirectUrl={`/${locale}`} />
        </div>
      </div>
    </div>
  );
}
