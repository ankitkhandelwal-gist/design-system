import type { ComponentPropsWithRef, MouseEventHandler, ReactNode, Ref } from "react";
import "./Tag.tokens.css";

export type TagColor = "red" | "green" | "orange" | "blue" | "purple" | "teal" | "grey";
export type TagVariant = "subtle" | "outline" | "filled";

export interface TagProps extends Omit<ComponentPropsWithRef<"span">, "children" | "color" | "onClick" | "ref"> {
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
  /**
   * Makes the tag clickable: it renders as a `<button>` with hover, focus and keyboard support.
   * Without it the tag is static text (a `<span>`) and does not react to hover.
   */
  onClick?: MouseEventHandler<HTMLElement>;
  ref?: Ref<HTMLElement>;
}

export function Tag({
  color = "red",
  variant = "subtle",
  showLeadingIcon = true,
  leadingIcon,
  showTrailingIcon = true,
  trailingIcon,
  onClick,
  ref,
  className,
  children,
  ...rest
}: TagProps) {
  const props = {
    className: className ? `ds-tag ${className}` : "ds-tag",
    "data-color": color,
    "data-variant": variant,
    ...rest,
  };
  const content = (
    <>
      {showLeadingIcon && leadingIcon ? (
        <span className="ds-tag__icon" aria-hidden="true">{leadingIcon}</span>
      ) : null}
      <span className="ds-tag__label">{children}</span>
      {showTrailingIcon && trailingIcon ? (
        <span className="ds-tag__icon" aria-hidden="true">{trailingIcon}</span>
      ) : null}
    </>
  );

  return onClick ? (
    <button type="button" data-interactive="" onClick={onClick} ref={ref as Ref<HTMLButtonElement>} {...props}>
      {content}
    </button>
  ) : (
    <span ref={ref as Ref<HTMLSpanElement>} {...props}>
      {content}
    </span>
  );
}
