import "../../tokens/index.css";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Cell } from "../Cell";
import { Table } from "../Table";
import { Row } from "./Row";
import meta from "./Row.meta";

afterEach(cleanup);

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`;
};
const renderRow = (row: React.ReactElement) => render(<Table aria-label="Test">{row}</Table>);
const cellBg = () => getComputedStyle(screen.getByRole("cell")).backgroundColor;

describe("Row", () => {
  it("is a row with its cells", () => {
    renderRow(<Row><Cell>A</Cell><Cell>B</Cell></Row>);
    expect(screen.getAllByRole("row").length).toBe(1);
    expect(screen.getAllByRole("cell").length).toBe(2);
  });

  it("allows any number of cells (no column limit)", () => {
    renderRow(<Row>{Array.from({ length: 14 }, (_, i) => <Cell key={i}>{i}</Cell>)}</Row>);
    expect(screen.getAllByRole("cell").length).toBe(14);
  });

  it("tints the whole row on hover (forced state) with the Figma hover color", () => {
    renderRow(<Row data-state="hover"><Cell>A</Cell></Row>);
    expect(cellBg()).toBe(rgb("#fafafa")); // table/row-hover: Grey/50
  });

  it("marks selected rows with aria-selected and the selected tint, which wins over hover", () => {
    renderRow(<Row selected data-state="hover"><Cell>A</Cell></Row>);
    expect(screen.getByRole("row").getAttribute("aria-selected")).toBe("true");
    expect(cellBg()).toBe(rgb("#ecf1ff")); // table/row-selected: Brand Navy Blue/50
  });

  it("fades a disabled row, marks it aria-disabled and removes the hover tint", () => {
    renderRow(<Row disabled data-state="hover"><Cell>A</Cell></Row>);
    expect(screen.getByRole("row").getAttribute("aria-disabled")).toBe("true");
    expect(getComputedStyle(document.querySelector(".ds-cell__content")!).opacity).toBe("0.6");
  });

  it("draws the focus ring when focused (forced state)", () => {
    renderRow(<Row data-state="focused"><Cell>A</Cell></Row>);
    const row = screen.getByRole("row");
    expect(getComputedStyle(row).outlineWidth).toBe("2px");
    expect(getComputedStyle(row).outlineColor).toBe(rgb("#0080e5")); // border/primary_focus
  });

  it("is not focusable or clickable by default", () => {
    renderRow(<Row><Cell>A</Cell></Row>);
    expect(screen.getByRole("row").hasAttribute("tabindex")).toBe(false);
    expect(screen.getByRole("row").hasAttribute("data-interactive")).toBe(false);
  });

  it("becomes focusable and clickable with onClick, and Enter or Space activate it", () => {
    const onClick = vi.fn();
    renderRow(<Row onClick={onClick}><Cell>A</Cell></Row>);
    const row = screen.getByRole("row");
    expect(row.getAttribute("tabindex")).toBe("0");
    fireEvent.click(screen.getByRole("cell"));
    fireEvent.keyDown(row, { key: "Enter" });
    fireEvent.keyDown(row, { key: " " });
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it("does not trigger the row when a control inside it is clicked", () => {
    const onClick = vi.fn();
    const onButton = vi.fn();
    renderRow(<Row onClick={onClick}><Cell><button onClick={onButton}>Edit</button></Cell></Row>);
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(onButton).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("does nothing on click when disabled", () => {
    const onClick = vi.fn();
    renderRow(<Row disabled onClick={onClick}><Cell>A</Cell></Row>);
    fireEvent.click(screen.getByRole("cell"));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole("row").hasAttribute("tabindex")).toBe(false);
  });

  it("header rows never get hover, selected or clickable behavior", () => {
    render(<Table aria-label="Test" header={<Row selected onClick={() => {}}><Cell>H</Cell></Row>} />);
    const row = screen.getAllByRole("row")[0]!;
    expect(row.hasAttribute("aria-selected")).toBe(false);
    expect(row.hasAttribute("tabindex")).toBe(false);
  });

  it("forwards ref and class name", () => {
    const ref = createRef<HTMLTableRowElement>();
    renderRow(<Row ref={ref} className="custom"><Cell>A</Cell></Row>);
    expect(ref.current).toBeInstanceOf(HTMLTableRowElement);
    expect(ref.current?.className).toContain("custom");
  });
});

describe("Row.meta", () => {
  it("matches the implemented props", () => {
    expect(meta.variants.axes.state).toEqual(["default", "selected", "disabled"]);
    expect(meta.component.figma?.nodeId).toBe("1390:4250");
  });
});
