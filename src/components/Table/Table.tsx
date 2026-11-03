import { Children } from "react";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { TableContext } from "../Cell";
import type { CellSize } from "../Cell";
import "./Table.tokens.css";

export interface TableProps extends Omit<ComponentPropsWithRef<"table">, "children" | "className"> {
  /** The header: one Row of Cells. Rendered in <thead>, so its cells are column headers. */
  header?: ReactNode;
  /** The body rows: Row elements. Rendered in <tbody>. */
  children?: ReactNode;
  /** Shown instead of rows when there are none, under the header (e.g. an empty state). */
  empty?: ReactNode;
  /** Optional footer below the rows, e.g. pagination. Keeps the divider above it. Maps to the Figma `Footer` slot. */
  footer?: ReactNode;
  /** Density for every cell: compact 37px, default 45px, comfortable 53px rows. Maps to the Figma Cell `Size`. */
  size?: CellSize;
  /** Class name for the outer container. */
  className?: string;
}

/**
 * A data table. The container owns the outer border, the rounded corners and the clipping,
 * so rows never need them. It is a real <table>, so columns line up and screen readers
 * announce rows and column headers. Give it an accessible name with `aria-label`.
 */
export function Table({ header, children, empty, footer, size = "default", className, ref, ...rest }: TableProps) {
  const hasRows = Children.toArray(children).length > 0;
  return (
    <div className={className ? `ds-table ${className}` : "ds-table"} data-size={size} data-footer={footer ? "" : undefined}>
      <table ref={ref} className="ds-table__table" {...rest}>
        {header ? (
          <thead>
            <TableContext.Provider value={{ size, section: "header" }}>{header}</TableContext.Provider>
          </thead>
        ) : null}
        <tbody>
          <TableContext.Provider value={{ size, section: "body" }}>{children}</TableContext.Provider>
        </tbody>
      </table>
      {!hasRows && empty ? <div className="ds-table__empty">{empty}</div> : null}
      {footer ? <div className="ds-table__footer">{footer}</div> : null}
    </div>
  );
}
