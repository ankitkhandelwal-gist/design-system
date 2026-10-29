import { useState, type CSSProperties, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox, type CheckboxSize } from "./Checkbox";

const sizes: CheckboxSize[] = ["small", "medium", "large"];
const titleCase = (s: string) => s[0]!.toUpperCase() + s.slice(1);

const meta = {
  title: "atoms/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: {
    label: "Label",
    showSubtext: true,
    subtext: "Supporting text",
    size: "small",
    indeterminate: false,
    disabled: false,
  },
  argTypes: {
    label: { control: "text", description: "Figma: Label" },
    showSubtext: { control: "boolean", description: "Figma: Show Subtext" },
    subtext: { control: "text", description: "Figma: Subtext" },
    size: { control: "inline-radio", options: sizes },
    indeterminate: { control: "boolean", description: "Figma: Intermediate" },
    disabled: { control: "boolean" },
    checked: { table: { disable: true } },
    className: { table: { disable: true } },
    defaultChecked: { control: "boolean", description: "Initial checked value (Figma: Active = checked)" },
  },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

const column: CSSProperties = { display: "grid", gap: 24 };
const rowStyle: CSSProperties = { display: "flex", gap: 48, alignItems: "flex-start", flexWrap: "wrap" };
const rowLabel: CSSProperties = { font: "var(--ds-font-weight-medium) var(--ds-font-size-body-small) var(--ds-font-family)", color: "var(--ds-color-text-secondary)", width: 72, paddingTop: 4 };

function Row({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div style={rowStyle}>
      <span style={rowLabel}>{name}</span>
      {children}
    </div>
  );
}

/** Live controls. Click the checkbox or press Space when it is focused. */
export const Default: Story = {};

export const CheckboxSizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={column}>
      {sizes.map((s) => (
        <Row key={s} name={titleCase(s)}>
          <Checkbox size={s} label="Label" subtext="Supporting text" />
          <Checkbox size={s} label="Label" subtext="Supporting text" defaultChecked />
        </Row>
      ))}
    </div>
  ),
};

/** The four Figma states per size: Default, Active (checked), Intermediate (indeterminate) and Disabled. */
export const CheckboxStates: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={column}>
      {sizes.map((s) => (
        <Row key={s} name={titleCase(s)}>
          <Checkbox size={s} label="Default" subtext="Supporting text" />
          <Checkbox size={s} label="Active" subtext="Supporting text" defaultChecked />
          <Checkbox size={s} label="Intermediate" subtext="Supporting text" indeterminate />
          <Checkbox size={s} label="Disabled" subtext="Supporting text" disabled />
        </Row>
      ))}
    </div>
  ),
};

/** Figma has no Disabled + Active or Disabled + Intermediate variant. This shows the disabled look with those states. */
export const DisabledChecked: Story = {
  name: "Disabled and Checked",
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={column}>
      {sizes.map((s) => (
        <Row key={s} name={titleCase(s)}>
          <Checkbox size={s} label="Disabled, checked" subtext="Supporting text" disabled defaultChecked />
          <Checkbox size={s} label="Disabled, mixed" subtext="Supporting text" disabled indeterminate />
        </Row>
      ))}
    </div>
  ),
};

export const Subtext: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={column}>
      <Row name="With subtext"><Checkbox size="medium" label="Email me updates" subtext="At most one email a week" /></Row>
      <Row name="Hidden"><Checkbox size="medium" label="Email me updates" subtext="Hidden" showSubtext={false} /></Row>
      <Row name="Label only"><Checkbox size="medium" label="Email me updates" /></Row>
    </div>
  ),
};

/** No visible label: the checkbox is named by aria-label. Useful for table row selection. */
export const WithoutLabel: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={column}>
      {sizes.map((s) => (
        <Row key={s} name={titleCase(s)}>
          <Checkbox size={s} aria-label={`Select row (${s})`} />
          <Checkbox size={s} aria-label={`Select row (${s}), checked`} defaultChecked />
        </Row>
      ))}
    </div>
  ),
};

const items = ["Design tokens", "Components", "Documentation"];

function SelectAllExample() {
  const [selected, setSelected] = useState<string[]>(["Components"]);
  const all = selected.length === items.length;
  const some = selected.length > 0 && !all;
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Checkbox
        size="medium"
        label="Select all"
        checked={all}
        indeterminate={some}
        onChange={() => setSelected(all ? [] : items)}
      />
      <div style={{ display: "grid", gap: 12, paddingLeft: 28 }}>
        {items.map((item) => (
          <Checkbox
            key={item}
            size="medium"
            label={item}
            checked={selected.includes(item)}
            onChange={(e) => setSelected((cur) => (e.target.checked ? [...cur, item] : cur.filter((i) => i !== item)))}
          />
        ))}
      </div>
    </div>
  );
}

/** The parent is indeterminate when only some children are selected. Controlled by your app. */
export const SelectAll: Story = {
  parameters: { controls: { disable: true } },
  render: () => <SelectAllExample />,
};
