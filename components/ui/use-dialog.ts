"use client";

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Shared modal behaviour for the cart drawer and the search overlay.
 *
 * Implements the APG dialog contract: focus moves in on open, Tab is trapped
 * inside the surface, Escape closes, and focus returns to whatever opened the
 * dialog. Background scroll is locked with scrollbar-width compensation so
 * opening the drawer does not shove the page sideways.
 */
export function useDialog<T extends HTMLElement>({
  isOpen,
  onClose,
  initialFocusRef,
}: {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly initialFocusRef?: RefObject<HTMLElement | null>;
}): RefObject<T | null> {
  const surfaceRef = useRef<T | null>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    restoreFocusTo.current = document.activeElement as HTMLElement | null;

    const surface = surfaceRef.current;
    // A frame of delay lets the entry transform settle before focus lands,
    // which stops Safari from scrolling the surface into view mid-animation.
    const focusFrame = requestAnimationFrame(() => {
      const target =
        initialFocusRef?.current ??
        surface?.querySelector<HTMLElement>(FOCUSABLE) ??
        surface;
      target?.focus({ preventScroll: true });
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !surface) return;

      const focusable = Array.from(surface.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => element.offsetParent !== null || element === document.activeElement,
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    const { body, documentElement } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
      restoreFocusTo.current?.focus({ preventScroll: true });
    };
  }, [isOpen, onClose, initialFocusRef]);

  return surfaceRef;
}
