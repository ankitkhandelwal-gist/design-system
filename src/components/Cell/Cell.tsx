import { createContext, useContext } from "react";
import type { ComponentPropsWithRef, ReactNode, Ref } from "react";
import { ArrowDownwardIcon, ArrowUpwardIcon, InfoIcon, UnfoldMoreIcon } from "../../icons";
import "./Cell.tokens.css";

export type CellSize = "compact" | "default" | "comfortable";
export type CellAlign = "left" | "center" | "right";
export type CellSort = "none" | "sortable" | "ascending" | "descending";
export type TableSection = "header" | "body";

/** Provided by Table: the density, and whether the cell is in the header or the body. */
export interface TableContextValue {
  size: CellSize;
  section: TableSection;
}
export const TableContext = createContext<TableContextValue>({ size: "default", section: "body" });

export interface CellProps extends Omit<ComponentPropsWithRef<"td">, "align" | "width"> {
  /** Cell content. Plain text wraps to two lines, then truncates. Anything else (a Tag, an icon plus text) is a custom slot. */
  children?: ReactNode;
  /** Horizontal alignment of the content. Right-align numbers. Maps to the Figma `Align` property. */
  align?: CellAlign;
  /** Overrides the density set by the Table. Maps to the Figma `Size` property. */
  size?: CellSize;
  /** Header only. Shows a sort icon and sets aria-sort. Maps to the Figma `Sort` property. */
  sort?: CellSort;
  /** Header only. Makes the label a button that calls this when clicked. Needs `sort`. */
  onSort?: () => void;
  /** Shows an info icon after the label. Decorative. Maps to the Figma `Info Icon` property. */
  info?: boolean;
  /** Icon at the end of the cell. Decorative. Maps to the Figma `Trailing Icon` property. */
  trailingIcon?: ReactNode;
  /** Column width. Set it on the header cell; the rest of the column follows. */
  width?: number | string;
}

const sortIcons = { sortable: UnfoldMoreIcon, ascending: ArrowUpwardIcon, descending: ArrowDownwardIcon } as const;
const ariaSort = { sortable: "none", ascending: "ascending", descending: "descending" } as const;

/**
 * A table cell: `<th scope="col">` inside the Table header, `<td>` in the body.
 * Figma states map to: Hover and Selected come from the Row, Focused from keyboard focus, Disabled from the Row.
 */
export function Cell({
  children,
  align = "left",
  size,
  sort = "none",
  onSort,
  info = false,
  trailingIcon,
  width,
  className,
  style,
  ref,
  ...rest
}: CellProps) {
  const ctx = useContext(TableContext);
  const isHeader = ctx.section === "header";
  const isText = typeof children === "string" || typeof children === "number";
  const SortIcon = sort === "none" ? null : sortIcons[sort];
  const content = (
    <>
      <span className={isText ? "ds-cell__text" : "ds-cell__slot"}>{children}</span>
      {info ? (
        <span className="ds-cell__icon" aria-hidden="true">
          <InfoIcon />
        </span>
      ) : null}
      {isHeader && SortIcon ? (
        <span className="ds-cell__icon ds-cell__icon--sort" aria-hidden="true" data-sort={sort}>
          <SortIcon />
        </span>
      ) : null}
    </>
  );
  const sortable = isHeader && Boolean(onSort);
  const props = {
    className: className ? `ds-cell ${className}` : "ds-cell",
    "data-align": align,
    "data-size": size ?? ctx.size,
    "data-section": ctx.section,
    "data-sortable": sortable ? "" : undefined,
    style: width === undefined ? style : { width, minWidth: width, ...style },
    ...rest,
  };
  const inner = (
    <div className="ds-cell__content">
      {sortable ? (
        <button type="button" className="ds-cell__sort" onClick={onSort}>
          {content}
        </button>
      ) : (
        content
      )}
      {trailingIcon ? (
        <span className="ds-cell__icon" aria-hidden="true">
          {trailingIcon}
        </span>
      ) : null}
    </div>
  );
  return isHeader ? (
    <th scope="col" aria-sort={sort === "none" ? undefined : ariaSort[sort]} ref={ref as Ref<HTMLTableCellElement>} {...props}>
      {inner}
    </th>
  ) : (
    <td ref={ref} {...props}>
      {inner}
    </td>
  );
}
