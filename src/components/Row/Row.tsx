import { useContext } from "react";
import type { ComponentPropsWithRef, KeyboardEvent, MouseEvent } from "react";
import { TableContext } from "../Cell";
import "./Row.tokens.css";

export interface RowProps extends Omit<ComponentPropsWithRef<"tr">, "onClick"> {
  /** Marks the row as selected (tint + aria-selected). Maps to the Figma Row `Selected` state. */
  selected?: boolean;
  /** Fades the row and marks it unavailable. Maps to the Figma Row `Disabled` state. */
  disabled?: boolean;
  /**
   * Makes the whole row clickable: it becomes focusable (Tab) and Enter or Space activate it.
   * Keep real controls inside the row (links, buttons) as they are; clicks on them do not trigger the row.
   */
  onClick?: (event: MouseEvent<HTMLTableRowElement> | KeyboardEvent<HTMLTableRowElement>) => void;
}

/**
 * A table row (`<tr>`). Figma states map to: Default, Hover (`:hover`, body rows only), Selected (`selected`),
 * Focused (keyboard focus, when clickable) and Disabled (`disabled`).
 * Put it in the Table's `header` for the header row, and as a child of Table for body rows.
 */
export function Row({ selected = false, disabled = false, onClick, className, onKeyDown, ref, ...rest }: RowProps) {
  const { section } = useContext(TableContext);
  const interactive = Boolean(onClick) && !disabled && section === "body";
  // Clicks on real controls inside the row (links, buttons, checkboxes) belong to those controls, not to the row.
  const handleClick = (e: MouseEvent<HTMLTableRowElement>) => {
    if (!(e.target as HTMLElement).closest("a, button, input, select, textarea, label")) onClick?.(e);
  };
  return (
    <tr
      ref={ref}
      className={className ? `ds-row ${className}` : "ds-row"}
      data-section={section}
      data-interactive={interactive ? "" : undefined}
      aria-selected={selected && section === "body" ? true : undefined}
      aria-disabled={disabled ? true : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? handleClick : undefined}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (interactive && e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick?.(e);
        }
      }}
      {...rest}
    />
  );
}
