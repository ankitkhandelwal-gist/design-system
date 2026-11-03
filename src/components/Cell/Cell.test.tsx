import "../../tokens/index.css";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Row } from "../Row";
import { Table } from "../Table";
import { Cell } from "./Cell";
import meta from "./Cell.meta";

afterEach(cleanup);

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`;
};
const inBody = (cell: React.ReactNode, props: React.ComponentProps<typeof Table> = {}) =>
  render(
    <Table aria-label="Test" {...props}>
      <Row>{cell}</Row>
    </Table>,
  );
const inHeader = (cell: React.ReactNode, props: React.ComponentProps<typeof Table> = {}) =>
  render(<Table aria-label="Test" header={<Row>{cell}</Row>} {...props} />);

describe("Cell", () => {
  it("is a column header (<th scope=col>) in the header and a <td> in the body", () => {
    inHeader(<Cell>Name</Cell>);
    expect(screen.getByRole("columnheader", { name: "Name" }).getAttribute("scope")).toBe("col");
    cleanup();
    inBody(<Cell>Ada</Cell>);
    expect(screen.getByRole("cell", { name: "Ada" }).tagName).toBe("TD");
  });

  it("aligns content left (default), center and right", () => {
    for (const align of ["left", "center", "right"] as const) {
      const { unmount } = inBody(<Cell align={align}>Value</Cell>);
      const cell = screen.getByRole("cell");
      expect(cell.dataset.align).toBe(align);
      expect(getComputedStyle(cell).textAlign).toBe(align);
      unmount();
    }
  });

  it("wraps plain text to two lines and truncates after that", () => {
    inBody(<Cell>{"A long value that keeps going ".repeat(12)}</Cell>);
    const text = document.querySelector(".ds-cell__text") as HTMLElement;
    expect(getComputedStyle(text).getPropertyValue("-webkit-line-clamp")).toBe("2");
    expect(getComputedStyle(text).overflow).toBe("hidden");
  });

  it("treats non-text children as a free slot (no clamping)", () => {
    inBody(<Cell><span data-testid="custom">Custom</span></Cell>);
    expect(document.querySelector(".ds-cell__text")).toBeNull();
    expect(document.querySelector(".ds-cell__slot")).toBeTruthy();
    expect(screen.getByTestId("custom")).toBeTruthy();
  });

  it("matches the Figma heights for header and body cells: 37 / 45 / 53", () => {
    const expected = { compact: 37, default: 45, comfortable: 53 } as const;
    for (const [size, h] of Object.entries(expected)) {
      const header = inHeader(<Cell>H</Cell>, { size: size as "compact" });
      expect(screen.getByRole("columnheader").getBoundingClientRect().height, "header " + size).toBe(h);
      header.unmount();
      const body = inBody(<Cell>B</Cell>, { size: size as "compact" });
      expect(screen.getByRole("cell").getBoundingClientRect().height, "body " + size).toBe(h);
      body.unmount();
    }
  });

  it("lets a cell override the table density", () => {
    inBody(<Cell size="comfortable">B</Cell>, { size: "compact" });
    expect(screen.getByRole("cell").getBoundingClientRect().height).toBe(53);
  });

  it("uses the Figma colors: header bg and text, body bg and text", () => {
    inHeader(<Cell>H</Cell>);
    expect(getComputedStyle(screen.getByRole("columnheader")).backgroundColor).toBe(rgb("#eff2f4")); // Blue Grey/50
    expect(getComputedStyle(screen.getByRole("columnheader")).fontWeight).toBe("700");
    cleanup();
    inBody(<Cell>B</Cell>);
    expect(getComputedStyle(screen.getByRole("cell")).backgroundColor).toBe(rgb("#ffffff"));
    expect(getComputedStyle(screen.getByRole("cell")).color).toBe(rgb("#616161")); // Grey/700
  });

  it("sets aria-sort and shows the matching sort icon on header cells", () => {
    const expected = { sortable: "none", ascending: "ascending", descending: "descending" } as const;
    for (const [sort, aria] of Object.entries(expected)) {
      const { unmount } = inHeader(<Cell sort={sort as "sortable"}>Name</Cell>);
      expect(screen.getByRole("columnheader").getAttribute("aria-sort")).toBe(aria);
      expect(document.querySelector(".ds-cell__icon--sort")?.getAttribute("data-sort")).toBe(sort);
      unmount();
    }
    inHeader(<Cell>Name</Cell>);
    expect(screen.getByRole("columnheader").hasAttribute("aria-sort")).toBe(false);
    expect(document.querySelector(".ds-cell__icon--sort")).toBeNull();
  });

  it("makes a sortable header's label a button that calls onSort", () => {
    const onSort = vi.fn();
    inHeader(<Cell sort="ascending" onSort={onSort}>Name</Cell>);
    fireEvent.click(screen.getByRole("button", { name: "Name" }));
    expect(onSort).toHaveBeenCalledTimes(1);
  });

  it("renders no sort icon or button in body cells", () => {
    inBody(<Cell sort="ascending" onSort={() => {}}>Body</Cell>);
    expect(screen.queryByRole("button")).toBeNull();
    expect(document.querySelector(".ds-cell__icon--sort")).toBeNull();
  });

  it("shows decorative info and trailing icons", () => {
    inBody(<Cell info trailingIcon={<svg data-testid="trail" />}>Value</Cell>);
    const icons = [...document.querySelectorAll(".ds-cell__icon")];
    expect(icons.length).toBe(2);
    expect(icons.every((i) => i.getAttribute("aria-hidden") === "true")).toBe(true);
    expect(screen.getByTestId("trail")).toBeTruthy();
  });

  it("sizes the column from the width prop", () => {
    inHeader(<><Cell width={120}>Name</Cell><Cell>Other</Cell></>);
    expect(Math.round(screen.getByRole("columnheader", { name: "Name" }).getBoundingClientRect().width)).toBe(120);
  });

  it("forwards ref and class name", () => {
    const ref = createRef<HTMLTableCellElement>();
    inBody(<Cell ref={ref} className="custom">x</Cell>);
    expect(ref.current).toBeInstanceOf(HTMLTableCellElement);
    expect(ref.current?.className).toContain("custom");
  });
});

describe("Cell.meta", () => {
  it("matches the implemented props and variants", () => {
    expect(meta.props.align?.values).toEqual(meta.variants.axes.align);
    expect(meta.props.size?.values).toEqual(meta.variants.axes.size);
    expect(meta.props.sort?.values).toEqual(meta.variants.axes.sort);
    expect(meta.component.figma?.nodeId).toBe("646:407");
  });
});
