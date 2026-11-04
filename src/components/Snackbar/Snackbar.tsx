import { useEffect, useRef } from "react";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { CheckCircleFilledIcon, ErrorFilledIcon, InfoFilledIcon, WarningFilledIcon } from "../../icons";
import "./Snackbar.tokens.css";

export type SnackbarType = "info" | "success" | "danger" | "warning";

const defaultIcons: Record<SnackbarType, ReactNode> = {
  info: <InfoFilledIcon />,
  success: <CheckCircleFilledIcon />,
  danger: <ErrorFilledIcon />,
  warning: <WarningFilledIcon />,
};

export interface SnackbarProps extends Omit<ComponentPropsWithRef<"div">, "children" | "title"> {
  /** What kind of message this is. Sets the accent bar color and the default icon. Maps to the Figma `State` property. */
  type?: SnackbarType;
  /** Bold first line. Leave out to hide it. Maps to Figma `Heading` and `Show Heading`. */
  heading?: string;
  /** The message. Maps to the Figma `Supporting text` property. */
  description: ReactNode;
  /** Show or hide the icon. Maps to Figma `Show Icon`. */
  showIcon?: boolean;
  /** Replaces the default icon of the type. Decorative (aria-hidden). Maps to the Figma icon swap. */
  icon?: ReactNode;
  /** Called when the user presses Dismiss, or when `duration` runs out. */
  onDismiss?: () => void;
  /** Show the Dismiss button. It also needs `onDismiss`. Set false to close only by `duration`. Maps to Figma `Show Dismiss`. */
  showDismiss?: boolean;
  /** Dismiss button text. Maps to Figma `Dismiss label`. */
  dismissLabel?: string;
  /** Called when the user presses the action button. The button only shows when this is set. Maps to Figma `Show Action`. */
  onAction?: () => void;
  /** Action button text, e.g. "Undo" or "View". Maps to Figma `Action label`. */
  actionLabel?: string;
  /** Milliseconds before `onDismiss` is called on its own. Pauses while the pointer or focus is on the snackbar. Leave unset to keep it until dismissed. */
  duration?: number;
}

/**
 * A short message about something that just happened ("Report exported", "Could not save"),
 * with up to two actions. It is dark with a colored bar on the left that shows the type.
 * It does not position itself or stack: place it (usually bottom or top of the screen) and
 * mount or unmount it from your own state.
 */
export function Snackbar({
  type = "info",
  heading,
  description,
  showIcon = true,
  icon,
  onDismiss,
  showDismiss = true,
  dismissLabel = "Dismiss",
  onAction,
  actionLabel = "Action",
  duration,
  className,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...rest
}: SnackbarProps) {
  // Danger and warning interrupt the screen reader; info and success wait their turn.
  const urgent = type === "danger" || type === "warning";
  const paused = useRef(false);
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  useEffect(() => {
    if (!duration || duration <= 0) return;
    let remaining = duration;
    let startedAt = Date.now();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const run = () => {
      startedAt = Date.now();
      timer = setTimeout(() => onDismissRef.current?.(), remaining);
    };
    const tick = setInterval(() => {
      if (paused.current && timer !== undefined) {
        clearTimeout(timer);
        timer = undefined;
        remaining -= Date.now() - startedAt;
      } else if (!paused.current && timer === undefined) {
        run();
      }
    }, 50);
    run();
    return () => {
      clearInterval(tick);
      if (timer !== undefined) clearTimeout(timer);
    };
  }, [duration]);

  const dismissVisible = Boolean(onDismiss) && showDismiss;
  const hasActions = dismissVisible || Boolean(onAction);
  return (
    <div
      role={urgent ? "alert" : "status"}
      data-type={type}
      className={className ? `ds-snackbar ${className}` : "ds-snackbar"}
      onMouseEnter={(e) => { paused.current = true; onMouseEnter?.(e); }}
      onMouseLeave={(e) => { paused.current = false; onMouseLeave?.(e); }}
      onFocus={(e) => { paused.current = true; onFocus?.(e); }}
      onBlur={(e) => { paused.current = false; onBlur?.(e); }}
      {...rest}
    >
      {showIcon ? <span className="ds-snackbar__icon" aria-hidden="true">{icon ?? defaultIcons[type]}</span> : null}
      <div className="ds-snackbar__content">
        {heading ? <p className="ds-snackbar__heading ds-text-body-14-semibold">{heading}</p> : null}
        <p className="ds-snackbar__description ds-text-body-14-regular">{description}</p>
      </div>
      {hasActions ? (
        <div className="ds-snackbar__actions">
          {dismissVisible ? (
            <button type="button" className="ds-snackbar__button ds-text-body-14-medium" data-kind="dismiss" onClick={onDismiss}>
              {dismissLabel}
            </button>
          ) : null}
          {onAction ? (
            <button type="button" className="ds-snackbar__button ds-text-body-14-medium" data-kind="action" onClick={onAction}>
              {actionLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
