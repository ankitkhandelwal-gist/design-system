import type { ComponentPropsWithRef, ReactNode } from "react";
import "./Button.tokens.css";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "destructive" | "success" | "link";
export type ButtonSize = "small" | "medium" | "large";

interface ButtonBaseProps extends Omit<ComponentPropsWithRef<"button">, "children"> {
  /** Visual style. Maps to the Figma `Type` property. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Show or hide the leading icon without removing it. Maps to Figma `Show Leading Icon`. */
  showLeadingIcon?: boolean;
  /** Icon shown before the label. Decorative (aria-hidden). */
  leadingIcon?: ReactNode;
  /** Show or hide the trailing icon without removing it. Maps to Figma `Show Trailing Icon`. */
  showTrailingIcon?: boolean;
  /** Icon shown after the label. Decorative (aria-hidden). */
  trailingIcon?: ReactNode;
}

/** A button has a visible label, or (icon-only) no label and an `aria-label`. */
type ButtonContentProps =
  | { /** The button label. */ children: ReactNode }
  | { children?: undefined; "aria-label": string };

export type ButtonProps = ButtonBaseProps & ButtonContentProps;

const hasLabel = (children: ReactNode) => children !== undefined && children !== null && children !== false && children !== "";

export function Button({
  variant = "primary",
  size = "small",
  leadingIcon,
  trailingIcon,
  showLeadingIcon = true,
  showTrailingIcon = true,
  type = "button",
  className,
  children,
  ...rest
}: ButtonProps) {
  const label = hasLabel(children);
  return (
    <button
      type={type}
      className={className ? `ds-button ${className}` : "ds-button"}
      data-variant={variant}
      data-size={size}
      data-icon-only={label ? undefined : ""}
      {...rest}
    >
      {showLeadingIcon && leadingIcon ? (
        <span className="ds-button__icon" aria-hidden="true">{leadingIcon}</span>
      ) : null}
      {label ? <span className="ds-button__label">{children}</span> : null}
      {showTrailingIcon && trailingIcon ? (
        <span className="ds-button__icon" aria-hidden="true">{trailingIcon}</span>
      ) : null}
    </button>
  );
}

export interface ButtonSkeletonProps extends ComponentPropsWithRef<"span"> {
  size?: ButtonSize;
  /** Override the default width, e.g. to match the label that will load. */
  width?: number | string;
}

/** Placeholder with the same height as a Button of `size`, shown while the real button's content loads. */
export function ButtonSkeleton({ size = "small", width, className, style, ...rest }: ButtonSkeletonProps) {
  return (
    <span
      className={className ? `ds-button-skeleton ${className}` : "ds-button-skeleton"}
      data-size={size}
      aria-hidden="true"
      style={width === undefined ? style : { width, ...style }}
      {...rest}
    />
  );
}
