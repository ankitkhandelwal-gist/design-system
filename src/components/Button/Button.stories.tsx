import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, type ButtonSize, type ButtonVariant } from "./Button";

const PlaceholderIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" focusable="false">
    <rect width="20" height="20" rx="4" />
  </svg>
);

const variants: ButtonVariant[] = ["primary", "secondary", "tertiary", "destructive", "success", "link"];
const sizes: ButtonSize[] = ["small", "medium", "large"];
const states = ["default", "focused", "hover", "disabled"] as const;

const meta = {
  title: "atoms/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Button", variant: "primary", size: "small", disabled: false },
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "inline-radio", options: sizes },
    leadingIcon: { control: false },
    trailingIcon: { control: false },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithIcons: Story = {
  args: { leadingIcon: <PlaceholderIcon />, trailingIcon: <PlaceholderIcon /> },
};

export const Disabled: Story = { args: { disabled: true } };

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
      {variants.map((v) => (
        <Button key={v} variant={v}>
          {v}
        </Button>
      ))}
    </div>
  ),
};

/** Mirrors the Figma component set: every type x size x state. States are forced via data-state. */
export const AllStates: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ display: "grid", gap: 24 }}>
      {variants.map((v) => (
        <div key={v} style={{ display: "grid", gap: 12 }}>
          {sizes.map((s) => (
            <div key={s} style={{ display: "flex", gap: 32, alignItems: "center" }}>
              {states.map((st) => (
                <Button
                  key={st}
                  variant={v}
                  size={s}
                  disabled={st === "disabled"}
                  data-state={st === "default" ? undefined : st}
                  leadingIcon={<PlaceholderIcon />}
                  trailingIcon={<PlaceholderIcon />}
                >
                  Button
                </Button>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};
