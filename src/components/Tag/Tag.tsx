import type { ComponentPropsWithRef, ReactNode } from "react";
import "./Tag.tokens.css";

export type TagColor = "red" | "green" | "orange" | "blue" | "purple" | "teal" | "grey";
export type TagVariant = "subtle" | "outline" | "filled";

export interface TagProps extends Omit<ComponentPropsWithRef<"span">, "children" | "color"> {
  /** The tag text. Maps to the Figma `Label` property. */
  children: ReactNode;
  /** Color family. Maps to the Figma `Color` property. */
  color?: TagColor;
  /** Fill style. Maps to the Figma `Type` property. */
  variant?: TagVariant;
  /** Show or hide the leading icon without removing it. Maps to Figma `Show Leading Icon`. */
  showLeadingIcon?: boolean;
  /** Icon shown before the label. Decorative (aria-hidden). */
  leadingIcon?: ReactNode;
  /** Show or hide the trailing icon without removing it. Maps to Figma `Show Trailing Icon`. */
  showTrailingIcon?: boolean;
  /** Icon shown after the label. Decorative (aria-hidden). */
  trailingIcon?: ReactNode;
}

export function Tag({
  color = "red",
  variant = "subtle",
  showLeadingIcon = true,
  leadingIcon,
  showTrailingIcon = true,
  trailingIcon,
  className,
  children,
  ...rest
}: TagProps) {
  return (
    <span
      className={className ? `ds-tag ${className}` : "ds-tag"}
      data-color={color}
      data-variant={variant}
      {...rest}
    >
      {showLeadingIcon && leadingIcon ? (
        <span className="ds-tag__icon" aria-hidden="true">{leadingIcon}</span>
      ) : null}
      <span className="ds-tag__label">{children}</span>
      {showTrailingIcon && trailingIcon ? (
        <span className="ds-tag__icon" aria-hidden="true">{trailingIcon}</span>
      ) : null}
    </span>
  );
}
