import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DefaultStoryIcon, iconMapping, iconOptions } from "../../icons/storyIcons";
import { Tag, type TagColor, type TagVariant } from "./Tag";

const colors: TagColor[] = ["red", "green", "orange", "blue", "purple", "teal", "grey"];
const variants: TagVariant[] = ["subtle", "outline", "filled"];
const titleCase = (s: string) => s[0]!.toUpperCase() + s.slice(1);
const Icon = DefaultStoryIcon;

const meta = {
  title: "atoms/Tag",
  component: Tag,
  tags: ["autodocs"],
  args: {
    children: "Label",
    color: "red",
    variant: "subtle",
    showLeadingIcon: true,
    leadingIcon: "Search" as unknown as ReactNode,
    showTrailingIcon: true,
    trailingIcon: "Search" as unknown as ReactNode,
  },
  argTypes: {
    children: { name: "label", control: "text", description: "The tag text (Figma: Label). In code it is the children." },
    color: { control: "select", options: colors },
    variant: { control: "inline-radio", options: variants },
    showLeadingIcon: { control: "boolean", description: "Show or hide the leading icon (Figma: Show Leading Icon)" },
    leadingIcon: { control: "select", options: iconOptions, mapping: iconMapping, description: "Pick an icon (stories only: in code pass any svg)" },
    showTrailingIcon: { control: "boolean", description: "Show or hide the trailing icon (Figma: Show Trailing Icon)" },
    trailingIcon: { control: "select", options: iconOptions, mapping: iconMapping, description: "Pick an icon (stories only: in code pass any svg)" },
  },
} satisfies Meta<typeof Tag>;
export default meta;
type Story = StoryObj<typeof meta>;

const column: CSSProperties = { display: "grid", gap: 16, justifyItems: "start" };
const row: CSSProperties = { display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" };
const rowLabel: CSSProperties = { font: "var(--ds-font-weight-medium) var(--ds-font-size-body-small) var(--ds-font-family)", color: "var(--ds-color-text-secondary)", width: 64 };

function Row({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div style={row}>
      <span style={rowLabel}>{name}</span>
      {children}
    </div>
  );
}

/** Live controls, including the leading and trailing icon toggles and pickers. */
export const Default: Story = {};

export const TagColors: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={column}>
      {variants.map((v) => (
        <Row key={v} name={titleCase(v)}>
          {colors.map((c) => (
            <Tag key={c} color={c} variant={v}>{titleCase(c)}</Tag>
          ))}
        </Row>
      ))}
    </div>
  ),
};

export const TagTypes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={column}>
      {colors.map((c) => (
        <Row key={c} name={titleCase(c)}>
          {variants.map((v) => (
            <Tag key={v} color={c} variant={v}>{titleCase(v)}</Tag>
          ))}
        </Row>
      ))}
    </div>
  ),
};

export const WithIcons: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={column}>
      {variants.map((v) => (
        <Row key={v} name={titleCase(v)}>
          <Tag color="blue" variant={v} leadingIcon={<Icon />}>Leading</Tag>
          <Tag color="blue" variant={v} trailingIcon={<Icon />}>Trailing</Tag>
          <Tag color="blue" variant={v} leadingIcon={<Icon />} trailingIcon={<Icon />}>Both</Tag>
          <Tag color="blue" variant={v}>None</Tag>
        </Row>
      ))}
    </div>
  ),
};

/** Default and Hover for every color and type. Hover is forced via data-state so it can be compared side by side. */
export const TagStates: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={column}>
      {colors.map((c) =>
        variants.map((v) => (
          <Row key={`${c}-${v}`} name={`${titleCase(c)} ${v}`}>
            <Tag color={c} variant={v} leadingIcon={<Icon />} trailingIcon={<Icon />}>Default</Tag>
            <Tag color={c} variant={v} data-state="hover" leadingIcon={<Icon />} trailingIcon={<Icon />}>Hover</Tag>
          </Row>
        )),
      )}
    </div>
  ),
};
