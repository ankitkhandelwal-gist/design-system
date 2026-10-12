import type { ComponentPropsWithRef, ReactNode } from "react";
import "./Button.tokens.css";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "destructive" | "success" | "link";
export type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps extends Omit<ComponentPropsWithRef<"button">, "children"> {
  /** Visual style. Maps to the Figma `Type` property. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icon shown before the label. Decorative: pass `aria-label` on the button for icon-only use. */
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  /** The button label. */
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "small",
  leadingIcon,
  trailingIcon,
  type = "button",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={className ? `ds-button ${className}` : "ds-button"}
      data-variant={variant}
      data-size={size}
      {...rest}
    >
      {leadingIcon ? <span className="ds-button__icon" aria-hidden="true">{leadingIcon}</span> : null}
      <span className="ds-button__label">{children}</span>
      {trailingIcon ? <span className="ds-button__icon" aria-hidden="true">{trailingIcon}</span> : null}
    </button>
  );
}
