import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DefaultStoryIcon, iconMapping, iconOptions } from "../../icons/storyIcons";
import { InputField } from "./InputField";

const Icon = DefaultStoryIcon;
const icon = (name: string) => name as unknown as ReactNode;

const meta = {
  title: "molecules/InputField",
  component: InputField,
  tags: ["autodocs"],
  args: {
    label: "Label",
    showLabelIcon: true,
    labelIcon: icon("Search"),
    required: true,
    placeholder: "Placeholder text",
    showLeadingIcon: true,
    leadingIcon: icon("Search"),
    showTrailingIcon: true,
    trailingIcon: icon("Search"),
    showHelperText: true,
    helperText: "Helper text",
    status: "default",
    disabled: false,
  },
  argTypes: {
    label: { control: "text" },
    showLabelIcon: { control: "boolean", description: "Figma: Show Label Icon" },
    labelIcon: { control: "select", options: iconOptions, mapping: iconMapping, description: "Pick an icon (stories only: in code pass any svg)" },
    required: { control: "boolean", description: "Figma: Is mandatory" },
    placeholder: { control: "text" },
    showLeadingIcon: { control: "boolean", description: "Figma: Show Leading Icon" },
    leadingIcon: { control: "select", options: iconOptions, mapping: iconMapping, description: "Pick an icon (stories only: in code pass any svg)" },
    showTrailingIcon: { control: "boolean", description: "Figma: Show Trailing Icon" },
    trailingIcon: { control: "select", options: iconOptions, mapping: iconMapping, description: "Pick an icon (stories only: in code pass any svg)" },
    showHelperText: { control: "boolean", description: "Figma: Show Subtext" },
    helperText: { control: "text", description: "Figma: Subtext" },
    status: { control: "inline-radio", options: ["default", "error", "success"] },
    disabled: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputField>;
export default meta;
type Story = StoryObj<typeof meta>;

const column: CSSProperties = { display: "grid", gap: 24, width: 320 };
const caption: CSSProperties = { font: "var(--ds-font-weight-medium) var(--ds-font-size-body-small) var(--ds-font-family)", color: "var(--ds-color-text-secondary)", marginBottom: 8 };

function Case({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div>
      <div style={caption}>{name}</div>
      {children}
    </div>
  );
}

const full = {
  label: "Label",
  required: true,
  placeholder: "Placeholder text",
  helperText: "Helper text",
  labelIcon: <Icon />,
  leadingIcon: <Icon />,
  trailingIcon: <Icon />,
};

/** Live controls, including every show/hide toggle and icon picker from Figma. */
export const Default: Story = {};

/** The six Figma states. Focused is forced via data-state; in real use it follows keyboard focus. */
export const InputStates: Story = {
  parameters: { controls: { disable: true }, layout: "padded" },
  decorators: [],
  render: () => (
    <div style={column}>
      <Case name="Default"><InputField {...full} /></Case>
      <Case name="Focused">
        <div data-state="focused" style={{ display: "contents" }}>
          <InputField {...full} />
        </div>
      </Case>
      <Case name="Filled"><InputField {...full} defaultValue="Entered value" /></Case>
      <Case name="Error"><InputField {...full} status="error" defaultValue="Entered value" helperText="Error message" /></Case>
      <Case name="Success"><InputField {...full} status="success" defaultValue="Entered value" helperText="Success message" /></Case>
      <Case name="Disabled"><InputField {...full} disabled /></Case>
    </div>
  ),
};

export const WithIcons: Story = {
  parameters: { controls: { disable: true } },
  decorators: [],
  render: () => (
    <div style={column}>
      <Case name="Leading icon"><InputField label="Search" placeholder="Search" leadingIcon={<Icon />} /></Case>
      <Case name="Trailing icon"><InputField label="Email" placeholder="name@company.com" trailingIcon={<Icon />} /></Case>
      <Case name="Label icon"><InputField label="Display name" placeholder="Placeholder text" labelIcon={<Icon />} /></Case>
      <Case name="All icons"><InputField {...full} /></Case>
      <Case name="No icons"><InputField label="Label" placeholder="Placeholder text" /></Case>
    </div>
  ),
};

export const MandatoryAndLabel: Story = {
  name: "Mandatory and Label",
  parameters: { controls: { disable: true } },
  decorators: [],
  render: () => (
    <div style={column}>
      <Case name="Mandatory"><InputField label="Full name" required placeholder="Placeholder text" /></Case>
      <Case name="Optional"><InputField label="Full name" placeholder="Placeholder text" /></Case>
      <Case name="No visible label (aria-label)"><InputField aria-label="Search" placeholder="Search" leadingIcon={<Icon />} /></Case>
    </div>
  ),
};

export const HelperText: Story = {
  parameters: { controls: { disable: true } },
  decorators: [],
  render: () => (
    <div style={column}>
      <Case name="Helper text"><InputField label="Username" placeholder="Placeholder text" helperText="Letters and numbers only" /></Case>
      <Case name="Error"><InputField label="Username" status="error" defaultValue="ab" helperText="Must be at least 3 characters" /></Case>
      <Case name="Success"><InputField label="Username" status="success" defaultValue="ankit" helperText="Username is available" /></Case>
      <Case name="Hidden"><InputField label="Username" placeholder="Placeholder text" helperText="Hidden" showHelperText={false} /></Case>
    </div>
  ),
};
