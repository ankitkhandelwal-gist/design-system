import { useId } from "react";
import type { ComponentPropsWithRef, ReactNode } from "react";
import "./Toggle.tokens.css";

export type ToggleSize = "small" | "medium" | "large";

export interface ToggleProps extends Omit<ComponentPropsWithRef<"input">, "type" | "size" | "className" | "children"> {
  /** The toggle label. Maps to the Figma `Label` property. Without a label, pass `aria-label`. */
  label?: ReactNode;
  /** Show or hide the supporting text without removing it. Maps to Figma `Show Subtext`. */
  showSubtext?: boolean;
  /** Supporting text below the label. Maps to the Figma `Subtext` property. */
  subtext?: ReactNode;
  /** Controls the track, knob and text sizes. Maps to the Figma `Size` property. */
  size?: ToggleSize;
  /** Class name for the root element. */
  className?: string;
}

/**
 * A switch for an immediate on/off setting. Figma states map to: Default (off), Active (`checked`),
 * Disabled (`disabled`). It is a native checkbox with role="switch", so keyboard and forms work as usual.
 */
export function Toggle({
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
}: ToggleProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const labelId = `${inputId}-label`;
  const subtextId = `${inputId}-subtext`;
  const hasLabel = label !== undefined && label !== null && label !== "";
  const hasSubtext = showSubtext && subtext !== undefined && subtext !== null && subtext !== "";

  return (
    <label
      className={className ? `ds-toggle ${className}` : "ds-toggle"}
      data-size={size}
      data-disabled={disabled ? "" : undefined}
      htmlFor={inputId}
    >
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        role="switch"
        className="ds-toggle__input"
        disabled={disabled}
        aria-labelledby={hasLabel ? labelId : undefined}
        aria-describedby={[hasSubtext ? subtextId : undefined, describedBy].filter(Boolean).join(" ") || undefined}
        {...rest}
      />
      <span className="ds-toggle__track" aria-hidden="true">
        <span className="ds-toggle__knob" />
      </span>
      {hasLabel || hasSubtext ? (
        <span className="ds-toggle__text">
          {hasLabel ? (
            <span className="ds-toggle__label" id={labelId}>
              {label}
            </span>
          ) : null}
          {hasSubtext ? (
            <span className="ds-toggle__subtext" id={subtextId}>
              {subtext}
            </span>
          ) : null}
        </span>
      ) : null}
    </label>
  );
}
