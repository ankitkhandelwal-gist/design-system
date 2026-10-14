import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as iconExports from "../../icons";
import { Button, ButtonSkeleton, type ButtonSize, type ButtonVariant } from "./Button";

const SquareIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" focusable="false">
    <rect width="20" height="20" rx="4" />
  </svg>
);

/**
 * Icon picker for the Controls panel: "None", the Figma placeholder square, and every `*Icon` exported
 * from src/icons. Add an icon there and it shows up in the dropdown automatically.
 */
const iconComponents: Record<string, () => ReactNode> = Object.fromEntries(
  Object.entries(iconExports)
    .filter(([name]) => name.endsWith("Icon"))
    .map(([name, Icon]) => [name.replace(/Icon$/, ""), () => <Icon />]),
);
const iconOptions = ["None", "Placeholder", ...Object.keys(iconComponents)];
const iconMapping: Record<string, ReactNode> = {
  None: undefined,
  Placeholder: <SquareIcon />,
  ...Object.fromEntries(Object.entries(iconComponents).map(([name, render]) => [name, render()])),
};
/** Default icon for stories that are not driven by Controls. */
const PlaceholderIcon = () => <>{iconMapping.Search ?? <SquareIcon />}</>;

const variants: ButtonVariant[] = ["primary", "secondary", "tertiary", "destructive", "success", "link"];
const sizes: ButtonSize[] = ["small", "medium", "large"];
const states = ["default", "focused", "hover", "disabled"] as const;
const titleCase = (s: string) => s[0]!.toUpperCase() + s.slice(1);

const meta = {
  title: "atoms/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Button",
    variant: "primary",
    size: "small",
    disabled: false,
    showLeadingIcon: true,
    leadingIcon: "Search" as unknown as ReactNode,
    showTrailingIcon: true,
    trailingIcon: "Search" as unknown as ReactNode,
  },
  argTypes: {
    children: { name: "label", control: "text", description: "The button text (Figma: Label). In code it is the children." },
    variant: { control: "select", options: variants },
    size: { control: "inline-radio", options: sizes },
    showLeadingIcon: { control: "boolean", description: "Show or hide the leading icon (Figma: Show Leading Icon)" },
    leadingIcon: { control: "select", options: iconOptions, mapping: iconMapping, description: "Pick an icon (stories only: in code pass any svg)" },
    showTrailingIcon: { control: "boolean", description: "Show or hide the trailing icon (Figma: Show Trailing Icon)" },
    trailingIcon: { control: "select", options: iconOptions, mapping: iconMapping, description: "Pick an icon (stories only: in code pass any svg)" },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

const column: CSSProperties = { display: "grid", gap: 24, justifyItems: "center" };
const row: CSSProperties = { display: "flex", gap: 24, alignItems: "center", justifyContent: "center", flexWrap: "wrap" };
const label: CSSProperties = { font: "var(--ds-font-weight-medium) var(--ds-font-size-body-small) var(--ds-font-family)", color: "var(--ds-color-text-secondary)", width: 96 };

function Row({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div style={{ ...row, justifyContent: "flex-start" }}>
      <span style={label}>{name}</span>
      {children}
    </div>
  );
}

/** Live controls, including the leading and trailing icon toggles. */
export const Default: Story = {};

export const ButtonTypes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      {variants.map((v) => (
        <Button key={v} variant={v} size="medium">
          {titleCase(v)}
        </Button>
      ))}
    </div>
  ),
};

export const ButtonSizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={column}>
      {variants.map((v) => (
        <Row key={v} name={titleCase(v)}>
          {sizes.map((s) => (
            <Button key={s} variant={v} size={s}>
              {titleCase(s)}
            </Button>
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
          <Button variant={v} size="medium" leadingIcon={<PlaceholderIcon />}>Leading</Button>
          <Button variant={v} size="medium" trailingIcon={<PlaceholderIcon />}>Trailing</Button>
          <Button variant={v} size="medium" leadingIcon={<PlaceholderIcon />} trailingIcon={<PlaceholderIcon />}>Both</Button>
        </Row>
      ))}
    </div>
  ),
};

/** In Figma, an empty label gives the icon-only button. Same padding and height as the labelled button; it must have an aria-label. */
export const IconsOnly: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={column}>
      {variants.map((v) => (
        <Row key={v} name={titleCase(v)}>
          {sizes.map((s) => (
            <Button key={s} variant={v} size={s} aria-label={`${titleCase(v)} ${s} icon button`} leadingIcon={<PlaceholderIcon />} />
          ))}
        </Row>
      ))}
    </div>
  ),
};

export const InlineButton: Story = {
  name: "Inline Button (Link)",
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ ...column, justifyItems: "start", maxWidth: 480 }}>
      {sizes.map((s) => (
        <p key={s} className={s === "small" ? "ds-text-body-14-regular" : "ds-text-body-16-regular"} style={{ margin: 0, color: "var(--ds-color-text-primary)" }}>
          By continuing you agree to our <Button variant="link" size={s}>Terms of Service</Button> and{" "}
          <Button variant="link" size={s}>Privacy Policy</Button>.
        </p>
      ))}
    </div>
  ),
};

/** Every Figma state per type, forced via data-state so they can be compared side by side. */
export const ButtonStates: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={column}>
      {variants.map((v) => (
        <Row key={v} name={titleCase(v)}>
          {states.map((st) => (
            <Button
              key={st}
              variant={v}
              size="medium"
              disabled={st === "disabled"}
              data-state={st === "default" || st === "disabled" ? undefined : st}
              leadingIcon={<PlaceholderIcon />}
              trailingIcon={<PlaceholderIcon />}
            >
              {titleCase(st)}
            </Button>
          ))}
        </Row>
      ))}
    </div>
  ),
};

const groupFrame: CSSProperties = { width: 420, padding: 16, border: "1px dashed var(--ds-color-border-default)", borderRadius: "var(--ds-radius-md)" };
const group = (justifyContent: CSSProperties["justifyContent"]): CSSProperties => ({ display: "flex", gap: "var(--ds-spacing-4)", justifyContent });

/** Composition only: groups use the 8px (spacing-4) gap. There is no Figma spec for groups. */
export const ButtonGroupPositioning: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={column}>
      {(["flex-start", "center", "flex-end"] as const).map((j) => (
        <div key={j} style={{ ...groupFrame, ...group(j) }}>
          <Button variant="secondary" size="medium">Cancel</Button>
          <Button variant="primary" size="medium">Save</Button>
        </div>
      ))}
      <div style={{ ...groupFrame, ...group("space-between") }}>
        <Button variant="tertiary" size="medium">Back</Button>
        <div style={group("flex-end")}>
          <Button variant="secondary" size="medium">Cancel</Button>
          <Button variant="primary" size="medium">Continue</Button>
        </div>
      </div>
      <div style={{ ...groupFrame, display: "grid", gap: "var(--ds-spacing-4)" }}>
        <Button variant="primary" size="large" style={{ width: "100%" }}>Continue</Button>
        <Button variant="secondary" size="large" style={{ width: "100%" }}>Cancel</Button>
      </div>
    </div>
  ),
};

/** Loading placeholder with the same height as the real button. Not in the Figma set. */
export const SkeletonState: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={column}>
      {sizes.map((s) => (
        <Row key={s} name={titleCase(s)}>
          <ButtonSkeleton size={s} />
          <ButtonSkeleton size={s} width={200} />
        </Row>
      ))}
    </div>
  ),
};
