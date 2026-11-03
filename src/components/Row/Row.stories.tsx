import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Cell } from "../Cell";
import { Checkbox } from "../Checkbox";
import { Table } from "../Table";
import { Row, type RowProps } from "./Row";

const meta = {
  title: "molecules/Row",
  component: Row,
  tags: ["autodocs"],
  args: { selected: false, disabled: false },
  argTypes: { selected: { control: "boolean" }, disabled: { control: "boolean" }, onClick: { control: false } },
  decorators: [(Story) => <div style={{ width: 640 }}><Story /></div>],
} satisfies Meta<typeof Row>;
export default meta;
type Story = StoryObj<typeof meta>;

const head = <Row><Cell>Name</Cell><Cell>Role</Cell><Cell align="right">Amount</Cell></Row>;
const cells = (name: string) => (<><Cell>{name}</Cell><Cell>Engineer</Cell><Cell align="right">$1,200</Cell></>);
const Wrap = ({ children }: { children: React.ReactNode }) => <Table aria-label="Row example" header={head}>{children}</Table>;

/** Live controls. Hover the row to see the tint. */
export const Default: Story = { render: (args) => <Wrap><Row {...args}>{cells("Ada Lovelace")}</Row></Wrap> };

/** The states side by side. Hover and Focused are forced here so they can be compared; in real use they follow the mouse and the keyboard. */
export const RowStates: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Wrap>
      <Row>{cells("Default")}</Row>
      <Row data-state="hover">{cells("Hover")}</Row>
      <Row selected>{cells("Selected")}</Row>
      <Row data-state="focused">{cells("Focused")}</Row>
      <Row disabled>{cells("Disabled")}</Row>
    </Wrap>
  ),
};

/** onClick makes the whole row clickable and focusable (Tab, then Enter or Space). */
export const ClickableRow: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [last, setLast] = useState("nothing yet");
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <Wrap>
          {["Ada Lovelace", "Grace Hopper", "Alan Turing"].map((n) => (
            <Row key={n} onClick={() => setLast(n)}>{cells(n)}</Row>
          ))}
        </Wrap>
        <span className="ds-text-body-14-regular">Clicked: {last}</span>
      </div>
    );
  },
};

/** A checkbox in the first cell drives `selected`. Clicking the checkbox does not trigger the row. */
export const SelectableRows: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const names = ["Ada Lovelace", "Grace Hopper", "Alan Turing"];
    const [sel, setSel] = useState<string[]>(["Grace Hopper"]);
    return (
      <Table aria-label="Selectable" header={<Row><Cell width={44}><Checkbox aria-label="Select all" checked={sel.length === names.length} indeterminate={sel.length > 0 && sel.length < names.length} onChange={() => setSel(sel.length === names.length ? [] : names)} /></Cell><Cell>Name</Cell></Row>}>
        {names.map((n) => (
          <Row key={n} selected={sel.includes(n)}>
            <Cell><Checkbox aria-label={`Select ${n}`} checked={sel.includes(n)} onChange={(e) => setSel((s) => (e.target.checked ? [...s, n] : s.filter((x) => x !== n)))} /></Cell>
            <Cell>{n}</Cell>
          </Row>
        ))}
      </Table>
    );
  },
};

export type { RowProps };
