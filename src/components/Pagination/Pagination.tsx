import { useState } from "react";
import type { ComponentPropsWithRef } from "react";
import { ArrowBackIosIcon, ArrowDropDownIcon, ArrowForwardIosIcon } from "../../icons";
import "./Pagination.tokens.css";

export interface PaginationProps extends Omit<ComponentPropsWithRef<"nav">, "onChange" | "children"> {
  /** Total number of results across all pages. Figma: Total Count. */
  total: number;
  /** Current page, 1-based. Use with `onPageChange` to control it. */
  page?: number;
  /** Starting page when uncontrolled. */
  defaultPage?: number;
  /** Results per page. Use with `onPageSizeChange` to control it. */
  pageSize?: number;
  /** Starting page size when uncontrolled. */
  defaultPageSize?: number;
  /** The choices in the "Showing [10] results" menu. */
  pageSizeOptions?: number[];
  /** Called with the new page when the user picks one. */
  onPageChange?: (page: number) => void;
  /** Called with the new size when the user picks one. The page resets to 1. */
  onPageSizeChange?: (pageSize: number) => void;
}

type Item = number | "ellipsis-start" | "ellipsis-end";

/** Which page buttons to show: up to 7 slots, with ellipses between the first, current and last pages. */
export function getPageItems(page: number, totalPages: number): Item[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, "ellipsis-end", totalPages];
  if (page >= totalPages - 3) return [1, "ellipsis-start", ...Array.from({ length: 5 }, (_, i) => totalPages - 4 + i)];
  return [1, "ellipsis-start", page - 1, page, page + 1, "ellipsis-end", totalPages];
}

/**
 * Results summary and page controls, usually in a Table's `footer`. Shows "Showing [size] results
 * out of N" on the left and previous / page numbers / next on the right.
 */
export function Pagination({
  total,
  page: pageProp,
  defaultPage = 1,
  pageSize: pageSizeProp,
  defaultPageSize,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  className,
  ref,
  ...rest
}: PaginationProps) {
  const [pageState, setPageState] = useState(defaultPage);
  const [sizeState, setSizeState] = useState(defaultPageSize ?? pageSizeOptions[0] ?? 10);
  const pageSize = pageSizeProp ?? sizeState;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(pageProp ?? pageState, 1), totalPages);

  const goTo = (next: number) => {
    if (next < 1 || next > totalPages || next === page) return;
    setPageState(next);
    onPageChange?.(next);
  };
  const changeSize = (next: number) => {
    setSizeState(next);
    setPageState(1);
    onPageSizeChange?.(next);
    if (page !== 1) onPageChange?.(1);
  };
  const sizes = pageSizeOptions.includes(pageSize) ? pageSizeOptions : [...pageSizeOptions, pageSize].sort((a, b) => a - b);

  return (
    <nav ref={ref} aria-label="Pagination" className={className ? `ds-pagination ${className}` : "ds-pagination"} {...rest}>
      <div className="ds-pagination__info ds-text-body-14-regular">
        <span className="ds-pagination__muted">Showing</span>
        <span className="ds-pagination__select">
          <select
            className="ds-pagination__select-input ds-text-body-14-semibold"
            aria-label="Results per page"
            value={pageSize}
            onChange={(e) => changeSize(Number(e.target.value))}
          >
            {sizes.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <span className="ds-pagination__select-icon" aria-hidden="true"><ArrowDropDownIcon /></span>
        </span>
        <span className="ds-pagination__muted">results out of</span>
        <span className="ds-pagination__strong ds-text-body-14-semibold">{total}</span>
      </div>

      <div className="ds-pagination__pages">
        <button type="button" className="ds-pagination__nav" aria-label="Previous page" disabled={page <= 1} onClick={() => goTo(page - 1)}>
          <ArrowBackIosIcon aria-hidden="true" />
        </button>
        {getPageItems(page, totalPages).map((item) =>
          typeof item === "number" ? (
            <button
              key={item}
              type="button"
              className="ds-pagination__page ds-text-body-14-regular"
              aria-label={`Page ${item}`}
              aria-current={item === page ? "page" : undefined}
              onClick={() => goTo(item)}
            >
              {item}
            </button>
          ) : (
            <span key={item} className="ds-pagination__ellipsis ds-text-body-14-regular" aria-hidden="true">...</span>
          ),
        )}
        <button type="button" className="ds-pagination__nav" aria-label="Next page" disabled={page >= totalPages} onClick={() => goTo(page + 1)}>
          <ArrowForwardIosIcon aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
