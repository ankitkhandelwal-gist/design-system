import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchIcon } from "../../icons";
import { Row } from "../Row";
import { Table } from "../Table";
import { Tag } from "../Tag";
import { Cell, type CellAlign, type CellProps, type CellSize, type CellSort } from "./Cell";

const aligns: CellAlign[] = ["left", "center", "right"];
const sizes: CellSize[] = ["compact", "default", "comfortable"];
const sorts: CellSort[] = ["none", "sortable", "ascending", "descending"];
const titleCase = (s: string) => s[0]!.toUpperCase() + s.slice(1);

const meta = {
  title: "atoms/Cell",
  component: Cell,
  tags: ["autodocs"],
  args: { children: "Cell value", align: "left", sort: "none", info: false },
  argTypes: {
    children: { name: "label", control: "text", description: "The cell text. Any other content is a custom slot." },
    align: { control: "inline-radio", options: aligns },
    size: { control: "inline-radio", options: sizes },
    sort: { control: "select", options: sorts, description: "Header cells only" },
    info: { control: "boolean", description: "Shows an info icon (Figma: Info Icon)" },
    width: { control: "number" },
    trailingIcon: { control: false },
    onSort: { control: false },
  },
  decorators: [(Story) => <div style={{ width: 480 }}><Story /></div>],
} satisfies Meta<typeof Cell>;
export default meta;
type Story = StoryObj<typeof meta>;

/** A cell lives in a Table: here one header cell and one data cell share the same props. */
const Example = (args: CellProps) => (
  <Table aria-label="Cell example" header={<Row><Cell {...args}>Header</Cell></Row>}>
    <Row><Cell {...args} sort="none" onSort={undefined}>{args.children}</Cell></Row>
  </Table>
);

/** Live controls. The header cell shows sort, the data cell does not. */
export const Default: Story = { render: (args) => <Example {...args} /> };

const grid = (cell: (a: string) => React.ReactNode, items: readonly string[], header: (a: string) => React.ReactNode) => (
  <Table aria-label="Cells" header={<Row>{items.map((a) => header(a))}</Row>}>
    <Row>{items.map((a) => cell(a))}</Row>
  </Table>
);

export const CellAlignments: Story = {
  parameters: { controls: { disable: true } },
  render: () => grid((a) => <Cell key={a} align={a as CellAlign}>1,200.00</Cell>, aligns, (a) => <Cell key={a} align={a as CellAlign}>{titleCase(a)}</Cell>),
};

export const CellSizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      {sizes.map((s) => (
        <Table key={s} size={s} aria-label={s} header={<Row><Cell>{titleCase(s)}</Cell><Cell>Row height</Cell></Row>}>
          <Row><Cell>Value</Cell><Cell>{{ compact: "37px", default: "45px", comfortable: "53px" }[s]}</Cell></Row>
        </Table>
      ))}
    </div>
  ),
};

export const SortStates: Story = {
  parameters: { controls: { disable: true } },
  render: () => grid(() => null, sorts, (s) => <Cell key={s} sort={s as CellSort}>{titleCase(s)}</Cell>),
};

/** Plain text wraps to two lines, then truncates. */
export const TextTruncation: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Table aria-label="Truncation" header={<Row><Cell width={180}>Key</Cell><Cell>Description</Cell></Row>}>
      <Row><Cell>air_pollution_impacts_usd</Cell><Cell>Short</Cell></Row>
      <Row><Cell>water_and_land pollution_impacts_usd extra extra words</Cell><Cell>A long description that wraps onto a second line and then is cut off with an ellipsis once it runs out of room here</Cell></Row>
    </Table>
  ),
};

/** Anything that is not plain text is a free slot: a Tag, icons with text, a value over its change. */
export const CustomContent: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Table aria-label="Custom content" header={<Row><Cell>Status</Cell><Cell align="right">Value and change</Cell><Cell info trailingIcon={<SearchIcon />}>With icons</Cell></Row>}>
      <Row>
        <Cell><Tag color="green">Active</Tag></Cell>
        <Cell align="right">
          <div style={{ display: "grid", justifyItems: "end" }}>
            <span>5,467,100</span>
            <span className="ds-text-body-12-regular" style={{ color: "var(--ds-color-text-secondary)" }}>+24.11%</span>
          </div>
        </Cell>
        <Cell>Info and trailing icon</Cell>
      </Row>
    </Table>
  ),
};
