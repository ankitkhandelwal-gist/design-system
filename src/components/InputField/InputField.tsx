import { useId } from "react";
import type { ComponentPropsWithRef, MouseEventHandler, ReactNode } from "react";
import "./InputField.tokens.css";

export type InputFieldStatus = "default" | "error" | "success";

interface InputFieldBaseProps extends Omit<ComponentPropsWithRef<"input">, "className"> {
  /** The field label. Maps to the Figma `Label` property. Without it, pass `aria-label`. */
  label?: string;
  /** Show or hide the icon next to the label without removing it. Maps to Figma `Show Label Icon`. */
  showLabelIcon?: boolean;
  /** Icon after the label (e.g. info). Decorative (aria-hidden). */
  labelIcon?: ReactNode;
  /** Shows the mandatory asterisk and sets the native `required` attribute. Maps to Figma `Is mandatory`. */
  required?: boolean;
  /** Show or hide the leading icon without removing it. Maps to Figma `Show Leading Icon`. */
  showLeadingIcon?: boolean;
  /** Icon inside the field, before the text. Decorative (aria-hidden). */
  leadingIcon?: ReactNode;
  /** Show or hide the trailing icon without removing it. Maps to Figma `Show Trailing Icon`. */
  showTrailingIcon?: boolean;
  /** Icon inside the field, after the text. Decorative (aria-hidden). */
  trailingIcon?: ReactNode;
  /** Show or hide the helper text without removing it. Maps to Figma `Show Subtext`. */
  showHelperText?: boolean;
  /** Text below the field. Maps to the Figma `Subtext` property. Colored by `status`. */
  helperText?: string;
  /** Validation state. `error` and `success` map to the Figma Error and Success states. */
  status?: InputFieldStatus;
  /** Class name for the root element. */
  className?: string;
}

/**
 * Optional action on the trailing icon (e.g. a clear button). When set, the trailing icon renders as a
 * real `<button>` and needs an accessible name. Without it the icon is decorative.
 */
type TrailingIconAction =
  | { onTrailingIconClick?: undefined; trailingIconLabel?: string }
  | { onTrailingIconClick: MouseEventHandler<HTMLButtonElement>; trailingIconLabel: string };

export type InputFieldProps = InputFieldBaseProps & TrailingIconAction;

/**
 * Figma states map to: Default (idle), Focused (:focus-within), Filled (has a value),
 * Error / Success (`status`), Disabled (`disabled`).
 */
export function InputField({
  label,
  showLabelIcon = true,
  labelIcon,
  required = false,
  showLeadingIcon = true,
  leadingIcon,
  showTrailingIcon = true,
  trailingIcon,
  onTrailingIconClick,
  trailingIconLabel,
  showHelperText = true,
  helperText,
  status = "default",
  disabled = false,
  id,
  className,
  ref,
  "aria-describedby": describedBy,
  ...rest
}: InputFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const helperId = `${inputId}-helper`;
  const hasHelper = showHelperText && Boolean(helperText);
  const hasLabelIcon = showLabelIcon && Boolean(labelIcon);
  const hasLabelRow = Boolean(label) || hasLabelIcon;

  return (
    <div
      className={className ? `ds-input-field ${className}` : "ds-input-field"}
      data-status={status}
      data-disabled={disabled ? "" : undefined}
    >
      {hasLabelRow ? (
        <div className="ds-input-field__label-row">
          {label ? (
            <label className="ds-input-field__label" htmlFor={inputId}>
              {label}
            </label>
          ) : null}
          {label && required ? (
            <span className="ds-input-field__mandatory" aria-hidden="true">*</span>
          ) : null}
          {hasLabelIcon ? (
            <span className="ds-input-field__icon ds-input-field__icon--label" aria-hidden="true">{labelIcon}</span>
          ) : null}
        </div>
      ) : null}

      <div className="ds-input-field__container">
        {showLeadingIcon && leadingIcon ? (
          <span className="ds-input-field__icon ds-input-field__icon--leading" aria-hidden="true">{leadingIcon}</span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className="ds-input-field__input"
          disabled={disabled}
          required={required}
          aria-invalid={status === "error" ? true : undefined}
          aria-describedby={[hasHelper ? helperId : undefined, describedBy].filter(Boolean).join(" ") || undefined}
          {...rest}
        />
        {showTrailingIcon && trailingIcon ? (
          onTrailingIconClick ? (
            <button
              type="button"
              className="ds-input-field__icon ds-input-field__icon--trailing ds-input-field__icon-button"
              aria-label={trailingIconLabel}
              disabled={disabled}
              onClick={onTrailingIconClick}
            >
              {trailingIcon}
            </button>
          ) : (
            <span className="ds-input-field__icon ds-input-field__icon--trailing" aria-hidden="true">{trailingIcon}</span>
          )
        ) : null}
      </div>

      {hasHelper ? (
        <div className="ds-input-field__helper" id={helperId}>
          {helperText}
        </div>
      ) : null}
    </div>
  );
}
