import type { ReactNode } from "react";
import { SearchOffIcon } from "../../icons";
import "./EmptyState.tokens.css";

export interface EmptyStateProps {
  /** Short headline, e.g. "No results found". Maps to the Figma `Title` property. */
  title: string;
  /** Supporting sentence under the title. Maps to the Figma `Description` property. */
  description?: string;
  /** Icon above the title. Decorative (aria-hidden). Pass `null` to hide it. Defaults to the search-off icon. */
  icon?: ReactNode;
  /** Optional call to action, usually a secondary small Button. Maps to Figma `Show Action`. */
  action?: ReactNode;
  className?: string;
}

/**
 * Centered message for a place that has nothing to show yet: an empty table, a search with no
 * matches. Pass it to `Table`'s `empty` prop, or use it on its own inside any container.
 */
export function EmptyState({ title, description, icon = <SearchOffIcon />, action, className }: EmptyStateProps) {
  return (
    <div className={className ? `ds-empty-state ${className}` : "ds-empty-state"}>
      {icon ? <span className="ds-empty-state__icon" aria-hidden="true">{icon}</span> : null}
      <div className="ds-empty-state__text">
        <p className="ds-empty-state__title ds-text-body-16-semibold">{title}</p>
        {description ? <p className="ds-empty-state__description ds-text-body-14-regular">{description}</p> : null}
      </div>
      {action ? <div className="ds-empty-state__action">{action}</div> : null}
    </div>
  );
}
