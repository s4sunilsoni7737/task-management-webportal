"use client";

import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { cn } from "@/lib/utils";

type Side = "bottom" | "top" | "right" | "left";
type Align = "start" | "end" | "center";

interface PopoverProps {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement>;
  children: ReactNode;
  side?: Side;
  align?: Align;
  offset?: number;
  className?: string;
  /** When true, outside-click/escape are ignored (used by nested submenus). */
  disableDismiss?: boolean;
}

const GAP = 6;
const VIEWPORT_PADDING = 8;

/**
 * Portal-based, viewport-aware popover used for every menu/submenu/calendar
 * in the app (WorkspaceMenu, ThemeSubmenu, ColorModeSubmenu, PriorityPopover,
 * DatePickerPopover, FieldsPopover, FilterPopover, OverflowMenu, MemberPicker).
 *
 * Positions itself relative to `anchorRef` via `getBoundingClientRect`,
 * clamps to the viewport, and closes on outside click or Escape per the
 * interaction requirements in design_break_down.md §11.
 */
export function Popover({
  open,
  onClose,
  anchorRef,
  children,
  side = "bottom",
  align = "start",
  offset = GAP,
  className,
  disableDismiss = false,
}: PopoverProps) {
  const contentRef = useRef<HTMLDivElement>(null!);
  const [style, setStyle] = useState<React.CSSProperties>({ opacity: 0 });

  useClickOutside(contentRef, onClose, open && !disableDismiss);
  useEscapeKey(onClose, open && !disableDismiss);

  useLayoutEffect(() => {
    if (!open) return;

    function position() {
      const anchor = anchorRef.current;
      const content = contentRef.current;
      if (!anchor || !content) return;

      const anchorRect = anchor.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let top = 0;
      let left = 0;

      if (side === "bottom") {
        top = anchorRect.bottom + offset;
        left = align === "end" ? anchorRect.right - contentRect.width : anchorRect.left;
      } else if (side === "top") {
        top = anchorRect.top - contentRect.height - offset;
        left = align === "end" ? anchorRect.right - contentRect.width : anchorRect.left;
      } else if (side === "right") {
        left = anchorRect.right + offset;
        top = anchorRect.top;
      } else {
        left = anchorRect.left - contentRect.width - offset;
        top = anchorRect.top;
      }

      // Clamp inside viewport
      left = Math.min(Math.max(VIEWPORT_PADDING, left), vw - contentRect.width - VIEWPORT_PADDING);
      top = Math.min(Math.max(VIEWPORT_PADDING, top), vh - contentRect.height - VIEWPORT_PADDING);

      setStyle({ position: "fixed", top, left, opacity: 1 });
    }

    position();
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => {
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
    };
  }, [open, anchorRef, side, align, offset]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={contentRef}
      role="menu"
      style={style}
      className={cn(
        "z-[var(--z-popover)] animate-fade-in-scale rounded-md border border-border bg-surface shadow-popover",
        className,
      )}
    >
      {children}
    </div>,
    document.body,
  );
}
