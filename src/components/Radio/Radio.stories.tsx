import { useState, type CSSProperties, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Radio, type RadioSize } from "./Radio";

const sizes: RadioSize[] = ["small", "medium", "large"];
const titleCase = (s: string) => s[0]!.toUpperCase() + s.slice(1);

const meta = {
  title: "atoms/Radio",
  component: Radio,
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
    defaultChecked: { control: "boolean", description: "Initial selection (Figma: Active = selected)" },
  },
} satisfies Meta<typeof Radio>;
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

/** Live controls. A single radio cannot be unselected once selected; see Radio Group for real use. */
export const Default: Story = {};

export const RadioSizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={column}>
      {sizes.map((s) => (
        <Row key={s} name={titleCase(s)}>
          <Radio size={s} name={`size-${s}`} label="Label" subtext="Supporting text" />
          <Radio size={s} name={`size-${s}-on`} label="Label" subtext="Supporting text" defaultChecked />
        </Row>
      ))}
    </div>
  ),
};

/** The three Figma states per size: Default (unselected), Active (selected) and Disabled. */
export const RadioStates: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={column}>
      {sizes.map((s) => (
        <Row key={s} name={titleCase(s)}>
          <Radio size={s} name={`st-${s}-a`} label="Default" subtext="Supporting text" />
          <Radio size={s} name={`st-${s}-b`} label="Active" subtext="Supporting text" defaultChecked />
          <Radio size={s} name={`st-${s}-c`} label="Disabled" subtext="Supporting text" disabled />
        </Row>
      ))}
    </div>
  ),
};

/** Figma has no Disabled + Active variant. This is the disabled look with the dot shown. */
export const DisabledSelected: Story = {
  name: "Disabled and Selected",
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={column}>
      {sizes.map((s) => (
        <Row key={s} name={titleCase(s)}>
          <Radio size={s} name={`ds-${s}`} label="Disabled, selected" subtext="Supporting text" disabled defaultChecked />
        </Row>
      ))}
    </div>
  ),
};

export const Subtext: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={column}>
      <Row name="With subtext"><Radio size="medium" name="sub-a" label="Standard delivery" subtext="3 to 5 working days" /></Row>
      <Row name="Hidden"><Radio size="medium" name="sub-b" label="Standard delivery" subtext="Hidden" showSubtext={false} /></Row>
      <Row name="Label only"><Radio size="medium" name="sub-c" label="Standard delivery" /></Row>
    </div>
  ),
};

/** No visible label: the radio is named by aria-label. */
export const WithoutLabel: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={column}>
      {sizes.map((s) => (
        <Row key={s} name={titleCase(s)}>
          <Radio size={s} name={`nl-${s}`} aria-label={`${titleCase(s)} option A`} />
          <Radio size={s} name={`nl-${s}`} aria-label={`${titleCase(s)} option B`} defaultChecked />
        </Row>
      ))}
    </div>
  ),
};

const plans = [
  { value: "basic", label: "Basic", subtext: "For individuals" },
  { value: "team", label: "Team", subtext: "Up to 20 people" },
  { value: "enterprise", label: "Enterprise", subtext: "Contact us for pricing" },
];

function GroupExample() {
  const [plan, setPlan] = useState("team");
  return (
    <fieldset style={{ border: 0, margin: 0, padding: 0, display: "grid", gap: 12 }}>
      <legend style={{ ...rowLabel, width: "auto", paddingBottom: 12 }}>Choose a plan (selected: {plan})</legend>
      {plans.map((p) => (
        <Radio
          key={p.value}
          size="medium"
          name="plan"
          value={p.value}
          label={p.label}
          subtext={p.subtext}
          checked={plan === p.value}
          onChange={() => setPlan(p.value)}
        />
      ))}
    </fieldset>
  );
}

/** Radios that share a name form a group: one selection, and the arrow keys move between them. Wrap them in a fieldset with a legend. */
export const RadioGroup: Story = {
  parameters: { controls: { disable: true } },
  render: () => <GroupExample />,
};
