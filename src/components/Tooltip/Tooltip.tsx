import { cloneElement, isValidElement, useCallback, useId, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, ReactElement, ReactNode } from "react";
import "./Tooltip.tokens.css";

export type TooltipPlacement = "top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end" | "left" | "right";

export interface TooltipProps {
  /** The element the tooltip describes. Hover or keyboard focus on it shows the tooltip. */
  children: ReactNode;
  /** The tooltip text. Keep it short; it is not for interactive content. Maps to the Figma `label` property. */
  content: ReactNode;
  /** Preferred spot around the trigger; the arrow points back at it. It flips to the other side, or shifts its alignment, when there is no room in the viewport. Maps to the Figma `Placement` property. */
  placement?: TooltipPlacement;
  /** Force it open or closed. Leave unset to open on hover and focus. */
  open?: boolean;
  className?: string;
}

const MARGIN = 4;
type Side = "top" | "bottom" | "left" | "right";
type Align = "center" | "start" | "end";

/** Picks where the tooltip goes: the preferred side if it fits, else the opposite, else the roomier one. */
function resolvePlacement(preferred: TooltipPlacement, trigger: DOMRect, w: number, h: number, gap: number): { placement: TooltipPlacement; top: number; left: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const [prefSide, prefAlign = "center"] = preferred.split("-") as [Side, Align | undefined];
  const room: Record<Side, number> = {
    top: trigger.top - gap - MARGIN,
    bottom: vh - trigger.bottom - gap - MARGIN,
    left: trigger.left - gap - MARGIN,
    right: vw - trigger.right - gap - MARGIN,
  };
  const need = (s: Side) => (s === "top" || s === "bottom" ? h : w);
  const opposite: Record<Side, Side> = { top: "bottom", bottom: "top", left: "right", right: "left" };
  let side = prefSide;
  if (room[side] < need(side)) {
    const o = opposite[side];
    if (room[o] >= need(o) || room[o] > room[side]) side = o;
  }

  const cx = trigger.left + trigger.width / 2;
  const cy = trigger.top + trigger.height / 2;
  if (side === "left" || side === "right") {
    const top = Math.min(Math.max(cy - h / 2, MARGIN), Math.max(vh - h - MARGIN, MARGIN));
    return { placement: side, top, left: side === "left" ? trigger.left - gap - w : trigger.right + gap };
  }

  const lefts: Record<Align, number> = { center: cx - w / 2, start: trigger.left, end: trigger.right - w };
  // Start and end only need the free side to fit; the trigger itself may sit against the edge (it is clamped below).
  const fits: Record<Align, boolean> = {
    center: lefts.center >= MARGIN && lefts.center + w <= vw - MARGIN,
    start: lefts.start + w <= vw - MARGIN,
    end: lefts.end >= MARGIN,
  };
  const order: Align[] = [prefAlign as Align, "center", "start", "end"];
  const align = order.find((a) => fits[a]) ?? (prefAlign as Align);
  const left = Math.min(Math.max(lefts[align], MARGIN), Math.max(vw - w - MARGIN, MARGIN));
  return { placement: align === "center" ? side : (`${side}-${align}` as TooltipPlacement), top: side === "top" ? trigger.top - gap - h : trigger.bottom + gap, left };
}

/**
 * A short label that appears when the user hovers or focuses an element, to explain it
 * (an icon-only button, a truncated value). It is a description, not a replacement for a label,
 * and never holds links or buttons. It is placed against the viewport, so it is not clipped by
 * `overflow: hidden` parents, and it flips or shifts by itself when there is no room.
 */
export function Tooltip({ children, content, placement = "top", open, className }: TooltipProps) {
  const [hovered, setHovered] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [pos, setPos] = useState<{ placement: TooltipPlacement; top: number; left: number } | null>(null);
  const id = useId();
  const wrapRef = useRef<HTMLSpanElement>(null);
  const bodyRef = useRef<HTMLSpanElement>(null);
  const visible = open ?? (hovered && !dismissed);

  const place = useCallback(() => {
    const wrap = wrapRef.current;
    const body = bodyRef.current;
    if (!wrap || !body) return;
    const gap = parseFloat(getComputedStyle(body).getPropertyValue("--ds-tooltip-offset")) || 4;
    const { width, height } = body.getBoundingClientRect();
    setPos(resolvePlacement(placement, wrap.getBoundingClientRect(), width, height, gap));
  }, [placement]);

  // Measure before paint, and follow the trigger while the page scrolls or resizes.
  useLayoutEffect(() => {
    if (!visible) {
      setPos(null);
      return;
    }
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [visible, place, content]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && hovered) setDismissed(true);
  };
  const show = () => { setDismissed(false); setHovered(true); };
  const hide = () => { setHovered(false); setDismissed(false); };

  const trigger =
    visible && isValidElement(children)
      ? cloneElement(children as ReactElement<{ "aria-describedby"?: string }>, {
          "aria-describedby": [(children.props as { "aria-describedby"?: string })["aria-describedby"], id].filter(Boolean).join(" "),
        })
      : children;

  return (
    <span
      ref={wrapRef}
      className={className ? `ds-tooltip ${className}` : "ds-tooltip"}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={onKeyDown}
    >
      {trigger}
      {visible ? (
        <span
          ref={bodyRef}
          role="tooltip"
          id={id}
          className="ds-tooltip__body ds-text-body-12-medium"
          data-placement={pos?.placement ?? placement}
          style={(pos ? { top: pos.top, left: pos.left } : { top: 0, left: 0, visibility: "hidden" }) as CSSProperties}
        >
          {content}
          <span className="ds-tooltip__arrow" aria-hidden="true" />
        </span>
      ) : null}
    </span>
  );
}
