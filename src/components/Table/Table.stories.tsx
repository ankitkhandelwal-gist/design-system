import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { KeyboardArrowDownIcon, ChevronRightIcon } from "../../icons";
import { Cell } from "../Cell";
import { Checkbox } from "../Checkbox";
import { EmptyState } from "../EmptyState";
import { Pagination } from "../Pagination";
import { Row } from "../Row";
import { Tag } from "../Tag";
import { Table } from "./Table";

const meta = {
  title: "organisms/Table",
  component: Table,
  tags: ["autodocs"],
  args: { size: "default", "aria-label": "Team members" },
  argTypes: { size: { control: "inline-radio", options: ["compact", "default", "comfortable"] }, header: { control: false }, footer: { control: false }, empty: { control: false } },
  decorators: [(Story) => <div style={{ width: 880 }}><Story /></div>],
} satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;

const people = [
  ["Michael Scott", "Regional Manager", "Active", "$1,200"],
  ["Dwight Schrute", "Sales", "Active", "$980"],
  ["Jim Halpert", "Sales", "On leave", "$870"],
  ["Pam Beesly", "Reception", "Active", "$760"],
] as const;
const head = (
  <Row>
    <Cell>Name</Cell>
    <Cell>Role</Cell>
    <Cell>Status</Cell>
    <Cell align="right">Amount</Cell>
  </Row>
);
const body = people.map(([n, r, s, a]) => (
  <Row key={n}>
    <Cell>{n}</Cell>
    <Cell>{r}</Cell>
    <Cell>{s}</Cell>
    <Cell align="right">{a}</Cell>
  </Row>
));

/** Live controls: change the density. */
export const Default: Story = { render: (args) => <Table {...args} header={head}>{body}</Table> };

export const TableSizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "grid", gap: 24 }}>
      {(["compact", "default", "comfortable"] as const).map((s) => (
        <Table key={s} size={s} aria-label={s} header={head}>{body.slice(0, 2)}</Table>
      ))}
    </div>
  ),
};

/** Click a header to sort. The icon and aria-sort follow the state. */
export const SortableColumns: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [key, setKey] = useState<0 | 3>(0);
    const [dir, setDir] = useState<"ascending" | "descending">("ascending");
    const sortBy = (k: 0 | 3) => { if (k === key) setDir((d) => (d === "ascending" ? "descending" : "ascending")); else { setKey(k); setDir("ascending"); } };
    const num = (s: string) => Number(s.replace(/[^0-9.]/g, ""));
    const sorted = [...people].sort((a, b) => (key === 3 ? num(a[3]) - num(b[3]) : a[0].localeCompare(b[0])) * (dir === "ascending" ? 1 : -1));
    return (
      <Table aria-label="Sortable" header={<Row><Cell sort={key === 0 ? dir : "sortable"} onSort={() => sortBy(0)}>Name</Cell><Cell>Role</Cell><Cell>Status</Cell><Cell align="right" sort={key === 3 ? dir : "sortable"} onSort={() => sortBy(3)}>Amount</Cell></Row>}>
        {sorted.map(([n, r, s, a]) => <Row key={n}><Cell>{n}</Cell><Cell>{r}</Cell><Cell>{s}</Cell><Cell align="right">{a}</Cell></Row>)}
      </Table>
    );
  },
};

/** A checkbox column with a narrow width. The header checkbox is mixed when only some rows are chosen. */
export const SelectableRows: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [sel, setSel] = useState<string[]>(["Dwight Schrute"]);
    const all = sel.length === people.length;
    return (
      <Table aria-label="Selectable" header={<Row><Cell width={44}><Checkbox aria-label="Select all rows" checked={all} indeterminate={sel.length > 0 && !all} onChange={() => setSel(all ? [] : people.map((p) => p[0]))} /></Cell><Cell>Name</Cell><Cell>Role</Cell><Cell align="right">Amount</Cell></Row>}>
        {people.map(([n, r, , a]) => (
          <Row key={n} selected={sel.includes(n)}>
            <Cell><Checkbox aria-label={`Select ${n}`} checked={sel.includes(n)} onChange={(e) => setSel((s) => (e.target.checked ? [...s, n] : s.filter((x) => x !== n)))} /></Cell>
            <Cell>{n}</Cell><Cell>{r}</Cell><Cell align="right">{a}</Cell>
          </Row>
        ))}
      </Table>
    );
  },
};

/** Pagination in the footer, paging real rows. Changing the page size resets to page 1. */
export const WithPagination: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const all = Array.from({ length: 47 }, (_, i) => [`Person ${i + 1}`, people[i % 4]![1], people[i % 4]![3]] as const);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const rows = all.slice((page - 1) * pageSize, page * pageSize);
    return (
      <Table
        aria-label="People"
        header={<Row><Cell>Name</Cell><Cell>Role</Cell><Cell align="right">Amount</Cell></Row>}
        footer={<Pagination total={all.length} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} />}
      >
        {rows.map(([n, r, a]) => <Row key={n}><Cell>{n}</Cell><Cell>{r}</Cell><Cell align="right">{a}</Cell></Row>)}
      </Table>
    );
  },
};

/** Set a width on a header cell to size its column. The rest share what is left. */
export const ColumnWidths: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Table aria-label="Column widths" header={<Row><Cell width={56}>#</Cell><Cell width={220}>Name</Cell><Cell>Role</Cell><Cell width={120} align="right">Amount</Cell></Row>}>
      {people.map(([n, r, , a], i) => <Row key={n}><Cell>{i + 1}</Cell><Cell>{n}</Cell><Cell>{r}</Cell><Cell align="right">{a}</Cell></Row>)}
    </Table>
  ),
};

/** No rows: the `empty` content shows under the header. */
export const NoRows: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Table
      aria-label="Empty"
      header={head}
      empty={<EmptyState title="No results found" description="Try changing your search or filters to see more results." />}
    />
  ),
};

/** Value over its change in a custom cell, right-aligned. Mirrors the Figma "capitals" reference. */
export const ValueAndChange: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const cell = (v: string, d: string, bold = false) => (
      <Cell align="right">
        <div style={{ display: "grid", justifyItems: "end", gap: 4 }}>
          <span style={{ fontWeight: bold ? "var(--ds-font-weight-bold)" : undefined }}>{v}</span>
          <span className="ds-text-body-12-regular" style={{ color: "var(--ds-color-text-secondary)" }}>{d}</span>
        </div>
      </Cell>
    );
    return (
      <Table aria-label="Impacts by year" header={<Row><Cell width={90}>Capitals</Cell><Cell width={200}>Key</Cell><Cell align="right">2021</Cell><Cell align="right">2022</Cell><Cell align="right">2023</Cell></Row>}>
        <Row><Cell>NCX</Cell><Cell>ghg_impacts_usd</Cell>{cell("5,467,100", "+24.11%")}{cell("5,467,100", "+24.11%")}{cell("5,467,100", "+24.11%")}</Row>
        <Row><Cell>NCX</Cell><Cell>air_pollution_impacts_usd</Cell>{cell("28,465.90", "+12.02%")}{cell("1664.81", "-55%", true)}{cell("28,465.90", "+12.02%")}</Row>
        <Row><Cell>FCX</Cell><Cell>fcx_impacts_usd</Cell>{cell("1664.81", "-11.02%", true)}{cell("5,201,430", "-11.02%")}{cell("5,201,430", "-11.02%")}</Row>
      </Table>
    );
  },
};

const scoreColor = (n: number) => (n >= 90 ? "green" : n >= 80 ? "red" : "orange");
const projects = [
  { id: "UBI-0012XXXX-PF-0043", name: "Narmada Hydro Project", sector: "Infrastructure", scores: [84, 91, 88], assets: [["A002", "Hydropower Substation", "Barwani, Madhya Pradesh"], ["A003", "Transmission Substation", "Barwani, Madhya Pradesh"]] },
  { id: "UBI-0012XXXX-PF-0071", name: "MP Coal Mining Expansion", sector: "Mining", scores: [78, 82, 79], assets: [] },
  { id: "UBI-0012XXXX-PF-0013", name: "Gujarat Solar Park", sector: "Renewable Energy", scores: [92, 95, 89], assets: [] },
];
const visuallyHidden: CSSProperties = { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" };
const nestedStyle: CSSProperties = { padding: 0, position: "relative" };

/** Expandable rows: a button in the first cell toggles a detail row that spans all columns and holds a nested Table. Mirrors the Figma "nested rows" reference. */
export const NestedRows: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [open, setOpen] = useState<string[]>(["UBI-0012XXXX-PF-0043"]);
    const toggle = (id: string) => setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]));
    const rows: ReactNode[] = [];
    for (const p of projects) {
      const isOpen = open.includes(p.id);
      rows.push(
        <Row key={p.id}>
          <Cell width={44}>
            {p.assets.length ? (
              <button type="button" aria-expanded={isOpen} aria-label={`${isOpen ? "Collapse" : "Expand"} ${p.name}`} onClick={() => toggle(p.id)} style={{ all: "unset", display: "inline-flex", width: 20, height: 20, cursor: "pointer" }}>
                {isOpen ? <KeyboardArrowDownIcon /> : <ChevronRightIcon />}
              </button>
            ) : null}
          </Cell>
          <Cell>{p.id}</Cell><Cell>{p.name}</Cell><Cell>{p.sector}</Cell>
          {p.scores.map((s, i) => <Cell key={i} align="center"><Tag color={scoreColor(s)}>{String(s)}</Tag></Cell>)}
        </Row>,
      );
      if (isOpen && p.assets.length) {
        rows.push(
          <Row key={`${p.id}-details`}>
            <Cell colSpan={7} style={nestedStyle} className="ds-story-nested-cell">
              <Table size="compact" aria-label={`${p.name} assets`} className="ds-story-nested" header={<Row><Cell>Asset Name</Cell><Cell>Asset Type</Cell><Cell>Asset Location</Cell></Row>}>
                {p.assets.map(([a, t, l]) => <Row key={a}><Cell>{a}</Cell><Cell>{t}</Cell><Cell>{l}</Cell></Row>)}
              </Table>
            </Cell>
          </Row>,
        );
      }
    }
    return (
      <>
        <style>{`.ds-story-nested{border:0;border-radius:0}.ds-story-nested-cell::before{content:"";position:absolute;inset:0 auto 0 0;width:4px;background:var(--ds-color-border-primary);z-index:1}`}</style>
        <Table aria-label="Projects" header={<Row><Cell width={44}><span style={visuallyHidden}>Expand</span></Cell><Cell>Loan Account</Cell><Cell>Project Name</Cell><Cell>Sector</Cell><Cell align="center">Nature and Biodiversity</Cell><Cell align="center">Key Nature Risk</Cell><Cell align="center">Ecosystem Services</Cell></Row>}>{rows}</Table>
      </>
    );
  },
};
