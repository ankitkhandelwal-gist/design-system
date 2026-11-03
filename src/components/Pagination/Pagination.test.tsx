import "../../tokens/index.css";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Pagination, getPageItems } from "./Pagination";
import meta from "./Pagination.meta";

afterEach(cleanup);

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`;
};

describe("getPageItems", () => {
  it("shows every page when there are 7 or fewer", () => {
    expect(getPageItems(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });
  it("matches Figma at the start: 1 2 3 4 5 ... last", () => {
    expect(getPageItems(1, 10)).toEqual([1, 2, 3, 4, 5, "ellipsis-end", 10]);
  });
  it("puts ellipses on both sides in the middle", () => {
    expect(getPageItems(6, 20)).toEqual([1, "ellipsis-start", 5, 6, 7, "ellipsis-end", 20]);
  });
  it("shows the last five at the end", () => {
    expect(getPageItems(10, 10)).toEqual([1, "ellipsis-start", 6, 7, 8, 9, 10]);
  });
});

describe("Pagination", () => {
  it("is a navigation landmark and shows the results summary", () => {
    render(<Pagination total={100} />);
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeTruthy();
    expect(document.querySelector(".ds-pagination__strong")?.textContent).toBe("100");
    expect(screen.getByText("results out of")).toBeTruthy();
  });

  it("marks the current page and moves on click, calling onPageChange", () => {
    const onPageChange = vi.fn();
    render(<Pagination total={100} onPageChange={onPageChange} />);
    expect(screen.getByRole("button", { name: "Page 1" }).getAttribute("aria-current")).toBe("page");
    fireEvent.click(screen.getByRole("button", { name: "Page 3" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
    expect(screen.getByRole("button", { name: "Page 3" }).getAttribute("aria-current")).toBe("page");
  });

  it("next and previous move one page and disable at the ends", () => {
    render(<Pagination total={30} />);
    const prev = screen.getByRole("button", { name: "Previous page" }) as HTMLButtonElement;
    const next = screen.getByRole("button", { name: "Next page" }) as HTMLButtonElement;
    expect(prev.disabled).toBe(true);
    fireEvent.click(next);
    expect(screen.getByRole("button", { name: "Page 2" }).getAttribute("aria-current")).toBe("page");
    fireEvent.click(next);
    expect(next.disabled).toBe(true);
  });

  it("does not move when controlled and the parent keeps the page", () => {
    const onPageChange = vi.fn();
    render(<Pagination total={100} page={2} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
    expect(screen.getByRole("button", { name: "Page 2" }).getAttribute("aria-current")).toBe("page");
  });

  it("changing the page size calls onPageSizeChange, resets to page 1 and recomputes pages", () => {
    const onPageSizeChange = vi.fn();
    render(<Pagination total={100} defaultPage={4} onPageSizeChange={onPageSizeChange} />);
    fireEvent.change(screen.getByRole("combobox", { name: "Results per page" }), { target: { value: "50" } });
    expect(onPageSizeChange).toHaveBeenCalledWith(50);
    expect(screen.getByRole("button", { name: "Page 1" }).getAttribute("aria-current")).toBe("page");
    expect(screen.queryByRole("button", { name: "Page 3" })).toBeNull();
  });

  it("keeps a page size that is not in the options selectable", () => {
    render(<Pagination total={100} pageSize={15} />);
    expect((screen.getByRole("combobox") as HTMLSelectElement).value).toBe("15");
  });

  it("clamps a page beyond the last page", () => {
    render(<Pagination total={20} page={9} />);
    expect(screen.getByRole("button", { name: "Page 2" }).getAttribute("aria-current")).toBe("page");
  });

  it("matches the Figma spec: 32px active page in navy with white text, 4px radius, 48px bar", () => {
    const { container } = render(<div style={{ width: 900 }}><Pagination total={100} /></div>);
    const active = screen.getByRole("button", { name: "Page 1" });
    const s = getComputedStyle(active);
    expect(s.width).toBe("32px");
    expect(s.height).toBe("32px");
    expect(s.borderTopLeftRadius).toBe("4px");
    expect(s.backgroundColor).toBe(rgb("#173e73")); // pagination/active-bg: Brand Navy Blue/500
    expect(s.color).toBe(rgb("#ffffff"));
    expect((container.querySelector("nav") as HTMLElement).getBoundingClientRect().height).toBe(48); // includes the 1px top divider
    expect(getComputedStyle(screen.getByRole("combobox")).height).toBe("30px");
  });

  it("has meta with a name and keywords", () => {
    expect(meta.component.name).toBe("Pagination");
    expect(meta.aiHints.keywords.length).toBeGreaterThan(0);
  });
});
