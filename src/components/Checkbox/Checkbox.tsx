import { useEffect, useId, useRef } from "react";
import type { ComponentPropsWithRef, ReactNode, Ref } from "react";
import { CheckBoxFilledIcon, CheckBoxOutlineBlankIcon, IndeterminateCheckBoxFilledIcon } from "../../icons";
import "./Checkbox.tokens.css";

export type CheckboxSize = "small" | "medium" | "large";

export interface CheckboxProps extends Omit<ComponentPropsWithRef<"input">, "type" | "size" | "className" | "children"> {
  /** The checkbox label. Maps to the Figma `Label` property. Without a label, pass `aria-label`. */
  label?: ReactNode;
  /** Show or hide the supporting text without removing it. Maps to Figma `Show Subtext`. */
  showSubtext?: boolean;
  /** Supporting text below the label. Maps to the Figma `Subtext` property. */
  subtext?: ReactNode;
  /** Controls the box and text sizes. Maps to the Figma `Size` property. */
  size?: CheckboxSize;
  /** Mixed state, e.g. "select all" when only some children are checked. Maps to the Figma `Intermediate` state. */
  indeterminate?: boolean;
  /** Class name for the root element. */
  className?: string;
}

function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) (ref as { current: T | null }).current = value;
}

/**
 * A native checkbox. Figma states map to: Default (unchecked), Active (`checked`), Intermediate
 * (`indeterminate`), Disabled (`disabled`). The box is drawn with Material Symbols icons, like Figma.
 */
export function Checkbox({
  label,
  showSubtext = true,
  subtext,
  size = "small",
  indeterminate = false,
  disabled = false,
  id,
  className,
  ref,
  "aria-describedby": describedBy,
  ...rest
}: CheckboxProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const labelId = `${inputId}-label`;
  const subtextId = `${inputId}-subtext`;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const hasLabel = label !== undefined && label !== null && label !== "";
  const hasSubtext = showSubtext && subtext !== undefined && subtext !== null && subtext !== "";

  // `indeterminate` is a DOM property, not an HTML attribute.
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label
      className={className ? `ds-checkbox ${className}` : "ds-checkbox"}
      data-size={size}
      data-disabled={disabled ? "" : undefined}
      htmlFor={inputId}
    >
      <input
        ref={(node) => {
          inputRef.current = node;
          setRef(ref, node);
        }}
        id={inputId}
        type="checkbox"
        className="ds-checkbox__input"
        disabled={disabled}
        aria-labelledby={hasLabel ? labelId : undefined}
        aria-describedby={[hasSubtext ? subtextId : undefined, describedBy].filter(Boolean).join(" ") || undefined}
        {...rest}
      />
      <span className="ds-checkbox__box" aria-hidden="true">
        <CheckBoxOutlineBlankIcon className="ds-checkbox__icon ds-checkbox__icon--unchecked" />
        <CheckBoxFilledIcon className="ds-checkbox__icon ds-checkbox__icon--checked" />
        <IndeterminateCheckBoxFilledIcon className="ds-checkbox__icon ds-checkbox__icon--indeterminate" />
      </span>
      {hasLabel || hasSubtext ? (
        <span className="ds-checkbox__text">
          {hasLabel ? (
            <span className="ds-checkbox__label" id={labelId}>
              {label}
            </span>
          ) : null}
          {hasSubtext ? (
            <span className="ds-checkbox__subtext" id={subtextId}>
              {subtext}
            </span>
          ) : null}
        </span>
      ) : null}
    </label>
  );
}
