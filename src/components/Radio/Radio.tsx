import { useId } from "react";
import type { ComponentPropsWithRef, ReactNode } from "react";
import "./Radio.tokens.css";

export type RadioSize = "small" | "medium" | "large";

export interface RadioProps extends Omit<ComponentPropsWithRef<"input">, "type" | "size" | "className" | "children"> {
  /** The radio label. Maps to the Figma `Label` property. Without a label, pass `aria-label`. */
  label?: ReactNode;
  /** Show or hide the supporting text without removing it. Maps to Figma `Show Subtext`. */
  showSubtext?: boolean;
  /** Supporting text below the label. Maps to the Figma `Subtext` property. */
  subtext?: ReactNode;
  /** Controls the circle and text sizes. Maps to the Figma `Size` property. */
  size?: RadioSize;
  /** Class name for the root element. */
  className?: string;
}

/**
 * A native radio button. Figma states map to: Default (unselected), Active (`checked`), Disabled (`disabled`).
 * Radios with the same `name` form a group: only one can be selected and the arrow keys move between them.
 */
export function Radio({
  label,
  showSubtext = true,
  subtext,
  size = "small",
  disabled = false,
  id,
  className,
  ref,
  "aria-describedby": describedBy,
  ...rest
}: RadioProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const labelId = `${inputId}-label`;
  const subtextId = `${inputId}-subtext`;
  const hasLabel = label !== undefined && label !== null && label !== "";
  const hasSubtext = showSubtext && subtext !== undefined && subtext !== null && subtext !== "";

  return (
    <label
      className={className ? `ds-radio ${className}` : "ds-radio"}
      data-size={size}
      data-disabled={disabled ? "" : undefined}
      htmlFor={inputId}
    >
      <input
        ref={ref}
        id={inputId}
        type="radio"
        className="ds-radio__input"
        disabled={disabled}
        aria-labelledby={hasLabel ? labelId : undefined}
        aria-describedby={[hasSubtext ? subtextId : undefined, describedBy].filter(Boolean).join(" ") || undefined}
        {...rest}
      />
      <span className="ds-radio__control" aria-hidden="true">
        <span className="ds-radio__dot" />
      </span>
      {hasLabel || hasSubtext ? (
        <span className="ds-radio__text">
          {hasLabel ? (
            <span className="ds-radio__label" id={labelId}>
              {label}
            </span>
          ) : null}
          {hasSubtext ? (
            <span className="ds-radio__subtext" id={subtextId}>
              {subtext}
            </span>
          ) : null}
        </span>
      ) : null}
    </label>
  );
}
