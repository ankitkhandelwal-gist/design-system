import "../../tokens/index.css";
import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { Cell } from "../Cell";
import { Row } from "../Row";
import { Table } from "./Table";
import meta from "./Table.meta";

afterEach(cleanup);

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`;
};
const header = (
  <Row>
    <Cell>Name</Cell>
    <Cell align="right">Amount</Cell>
  </Row>
);
const rows = [
  <Row key="a"><Cell>Ada</Cell><Cell align="right">1,200</Cell></Row>,
  <Row key="b"><Cell>Grace</Cell><Cell align="right">980</Cell></Row>,
];
const container = () => document.querySelector(".ds-table") as HTMLElement;

describe("Table", () => {
  it("is a table named by aria-label, with column headers and data cells", () => {
    render(<Table aria-label="Payments" header={header}>{rows}</Table>);
    const table = screen.getByRole("table", { name: "Payments" });
    expect(within(table).getAllByRole("columnheader").length).toBe(2);
    expect(within(table).getAllByRole("row").length).toBe(3);
    expect(within(table).getAllByRole("cell").length).toBe(4);
    expect(table.querySelector("thead")).toBeTruthy();
    expect(table.querySelector("tbody")).toBeTruthy();
  });

  it("owns the outer border, the rounded corners and the clipping (Figma: 1px, radius md)", () => {
    render(<Table aria-label="T" header={header}>{rows}</Table>);
    const cs = getComputedStyle(container());
    expect(cs.borderTopWidth).toBe("1px");
    expect(cs.borderTopColor).toBe(rgb("#eeeeee")); // table/border-default: Grey/200
    expect(cs.borderTopLeftRadius).toBe("8px");
    expect(cs.overflow).toBe("hidden");
  });

  it("applies one density to all cells: rows are 37 / 45 / 53px tall", () => {
    const expected = { compact: 37, default: 45, comfortable: 53 } as const;
    for (const [size, h] of Object.entries(expected)) {
      const { unmount } = render(<Table aria-label="T" size={size as "compact"} header={header}>{rows}</Table>);
      for (const r of screen.getAllByRole("row")) expect(r.getBoundingClientRect().height, size).toBe(h);
      unmount();
    }
  });

  it("hides the last row's bottom line, unless a footer sits below it", () => {
    const { unmount } = render(<Table aria-label="T" header={header}>{rows}</Table>);
    const last = () => getComputedStyle(screen.getAllByRole("row").at(-1)!.querySelector("td")!).borderBottomColor;
    expect(last()).toBe("rgba(0, 0, 0, 0)");
    unmount();
    render(<Table aria-label="T" header={header} footer={<div>Footer</div>}>{rows}</Table>);
    expect(last()).toBe(rgb("#eeeeee"));
  });

  it("renders the footer below the rows", () => {
    render(<Table aria-label="T" header={header} footer={<div>Page 1 of 3</div>}>{rows}</Table>);
    expect(screen.getByText("Page 1 of 3")).toBeTruthy();
    expect(container().querySelector(".ds-table__footer")).toBeTruthy();
  });

  it("shows the empty content only when there are no rows", () => {
    const { unmount } = render(<Table aria-label="T" header={header} empty={<div>No results</div>} />);
    expect(screen.getByText("No results")).toBeTruthy();
    unmount();
    render(<Table aria-label="T" header={header} empty={<div>No results</div>}>{rows}</Table>);
    expect(screen.queryByText("No results")).toBeNull();
  });

  it("lets the header cell set a column width", () => {
    render(
      <Table aria-label="T" header={<Row><Cell width={90}>#</Cell><Cell>Name</Cell></Row>}>
        <Row><Cell>1</Cell><Cell>Ada</Cell></Row>
      </Table>,
    );
    expect(Math.round(screen.getByRole("columnheader", { name: "#" }).getBoundingClientRect().width)).toBe(90);
    expect(Math.round(screen.getByRole("cell", { name: "1" }).getBoundingClientRect().width)).toBe(90);
  });

  it("fills its container's width", () => {
    render(<div style={{ width: 500 }}><Table aria-label="T" header={header}>{rows}</Table></div>);
    expect(container().getBoundingClientRect().width).toBe(500);
  });

  it("forwards ref to the table and class name to the container", () => {
    const ref = createRef<HTMLTableElement>();
    render(<Table aria-label="T" ref={ref} className="custom" header={header}>{rows}</Table>);
    expect(ref.current).toBeInstanceOf(HTMLTableElement);
    expect(container().className).toContain("custom");
  });
});

describe("Table.meta", () => {
  it("matches the implemented props", () => {
    expect(meta.props.size?.values).toEqual(meta.variants.axes.size);
    expect(meta.component.figma?.nodeId).toBe("1342:2333");
  });
});
