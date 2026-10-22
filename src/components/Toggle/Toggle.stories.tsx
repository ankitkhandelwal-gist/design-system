import { useState, type CSSProperties, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toggle, type ToggleSize } from "./Toggle";

const sizes: ToggleSize[] = ["small", "medium", "large"];
const titleCase = (s: string) => s[0]!.toUpperCase() + s.slice(1);

const meta = {
  title: "atoms/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  args: {
    label: "Label",
    showSubtext: true,
    subtext: "Supporting text",
    size: "small",
    disabled: false,
  },
  argTypes: {
    label: { control: "text", description: "Figma: Label" },
    showSubtext: { control: "boolean", description: "Figma: Show Subtext" },
    subtext: { control: "text", description: "Figma: Subtext" },
    size: { control: "inline-radio", options: sizes },
    disabled: { control: "boolean" },
    checked: { table: { disable: true } },
    className: { table: { disable: true } },
    defaultChecked: { control: "boolean", description: "Initial on/off value (Figma: Active = on)" },
  },
} satisfies Meta<typeof Toggle>;
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

/** Live controls. Click the toggle or press Space when it is focused. */
export const Default: Story = {};

export const ToggleSizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={column}>
      {sizes.map((s) => (
        <Row key={s} name={titleCase(s)}>
          <Toggle size={s} label="Label" subtext="Supporting text" />
          <Toggle size={s} label="Label" subtext="Supporting text" defaultChecked />
        </Row>
      ))}
    </div>
  ),
};

/** The three Figma states per size: Default (off), Active (on) and Disabled. */
export const ToggleStates: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={column}>
      {sizes.map((s) => (
        <Row key={s} name={titleCase(s)}>
          <Toggle size={s} label="Default" subtext="Supporting text" />
          <Toggle size={s} label="Active" subtext="Supporting text" defaultChecked />
          <Toggle size={s} label="Disabled" subtext="Supporting text" disabled />
        </Row>
      ))}
    </div>
  ),
};

/** Figma has no Disabled + Active variant. This is the same disabled look with the knob on. */
export const DisabledOn: Story = {
  name: "Disabled and On",
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={column}>
      {sizes.map((s) => (
        <Row key={s} name={titleCase(s)}>
          <Toggle size={s} label="Disabled, on" subtext="Supporting text" disabled defaultChecked />
        </Row>
      ))}
    </div>
  ),
};

export const Subtext: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={column}>
      <Row name="With subtext"><Toggle size="medium" label="Email notifications" subtext="Get a summary every Monday" /></Row>
      <Row name="Hidden"><Toggle size="medium" label="Email notifications" subtext="Hidden" showSubtext={false} /></Row>
      <Row name="Label only"><Toggle size="medium" label="Email notifications" /></Row>
    </div>
  ),
};

/** No visible label: the switch is named by aria-label. Useful in table rows. */
export const WithoutLabel: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={column}>
      {sizes.map((s) => (
        <Row key={s} name={titleCase(s)}>
          <Toggle size={s} aria-label={`${titleCase(s)} toggle`} />
          <Toggle size={s} aria-label={`${titleCase(s)} toggle, on`} defaultChecked />
        </Row>
      ))}
    </div>
  ),
};

function ControlledExample() {
  const [on, setOn] = useState(true);
  return (
    <div style={column}>
      <Toggle size="medium" label="Dark mode" subtext={on ? "Dark theme is on" : "Dark theme is off"} checked={on} onChange={(e) => setOn(e.target.checked)} />
      <span style={{ ...rowLabel, width: "auto" }}>State in your app: {String(on)}</span>
    </div>
  );
}

/** Controlled: your app owns the value with `checked` and `onChange`. */
export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  render: () => <ControlledExample />,
};
