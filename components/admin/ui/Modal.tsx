"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { FocusTrap } from "focus-trap-react";

import { cn } from "@/lib/Utils";
import type { ModalProps } from "@/types/AdminUi";
import IconButton from "./IconButton";

// Built on `focus-trap-react` + the `inert` attribute — the same mechanism the
// site's mobile navigation drawer uses — so the project has one modal pattern
// instead of a drawer built one way and dialogs built another.
//
// The panel stays mounted (rather than conditionally rendered) so it can
// animate in and out; `inert` is what keeps it out of the tab order and the
// accessibility tree while it's closed.

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  closeLabel,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <FocusTrap
      active={open}
      focusTrapOptions={{
        escapeDeactivates: false,
        allowOutsideClick: true,
        returnFocusOnDeactivate: true,
      }}
    >
      <div
        className={cn(
          "fixed inset-0 z-999 flex items-center justify-center p-4",
          !open && "pointer-events-none",
        )}
        inert={!open}
      >
        <div
          aria-hidden
          onClick={onClose}
          className={cn(
            "absolute inset-0 cursor-pointer bg-black/70 transition-opacity duration-200 ease-out",
            open ? "opacity-100" : "opacity-0",
          )}
        />

        <div
          role="dialog"
          aria-modal={open}
          aria-label={title}
          className={cn(
            "relative z-10 flex w-full max-w-md flex-col gap-4 rounded-xl border",
            "border-hairline-strong bg-surface-2 p-5 shadow-2xl",
            "transition-all duration-200 ease-out",
            open ? "scale-100 opacity-100" : "scale-95 opacity-0",
            className,
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-semibold text-ink">{title}</h2>
              {description && (
                <p className="text-sm leading-relaxed text-ink-muted">
                  {description}
                </p>
              )}
            </div>
            <IconButton
              size="sm"
              aria-label={closeLabel}
              onClick={onClose}
              className="-me-1 -mt-1"
            >
              <X aria-hidden />
            </IconButton>
          </div>

          {children}

          {footer && (
            <div className="flex items-center justify-end gap-2">{footer}</div>
          )}
        </div>
      </div>
    </FocusTrap>
  );
}
