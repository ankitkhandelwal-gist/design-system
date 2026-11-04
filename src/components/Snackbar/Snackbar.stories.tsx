import { useCallback, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import { Snackbar, type SnackbarProps, type SnackbarType } from "./Snackbar";
import { iconMapping, iconOptions } from "../../icons/storyIcons";

const types: SnackbarType[] = ["info", "success", "danger", "warning"];
const noop = () => {};

const meta = {
  title: "molecules/Snackbar",
  component: Snackbar,
  tags: ["autodocs"],
  args: {
    type: "info",
    heading: "Info notification",
    description: "Supporting text with additional details about the notification.",
    showIcon: true,
    dismissLabel: "Dismiss",
    actionLabel: "Action",
    onDismiss: noop,
    onAction: noop,
  },
  argTypes: {
    type: { control: "inline-radio", options: types },
    icon: { control: "select", options: iconOptions, mapping: iconMapping, description: "Pick an icon (stories only: in code pass any svg). None keeps the default of the type." },
    onDismiss: { control: false },
    onAction: { control: false },
    duration: { control: "number" },
  },
} satisfies Meta<typeof Snackbar>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Live controls. */
export const Default: Story = {};

/** The four types. Matches the Figma State variants. */
export const AllTypes: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 16 }}>
      {types.map((t) => (
        <Snackbar key={t} {...args} type={t} heading={`${t[0]!.toUpperCase()}${t.slice(1)} notification`} />
      ))}
    </div>
  ),
};

/** Message only: no heading, no actions. */
export const MessageOnly: Story = {
  args: { heading: undefined, onDismiss: undefined, onAction: undefined, description: "Report exported." },
};

/** Dismiss only. */
export const DismissOnly: Story = { args: { onAction: undefined } };

/** One action with a custom label, e.g. Undo. */
export const UndoAction: Story = {
  args: { type: "success", heading: "Row deleted", description: "The row was removed from the table.", onDismiss: undefined, actionLabel: "Undo" },
};

/** Without the icon. */
export const NoIcon: Story = { args: { showIcon: false } };

/** Long text wraps; the actions stay at the top right. */
export const LongText: Story = {
  args: { description: "The export has finished, but 14 rows were skipped because their project code was missing. Download the skipped rows to fix them and try again." },
};

/** Closes itself after `duration`. The timer pauses while the pointer or focus is on it. */
export const AutoDismiss: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: "grid", gap: 16, justifyItems: "start", minHeight: 160 }}>
        <Button variant="secondary" onClick={() => setOpen(true)}>Show snackbar (5s)</Button>
        {open ? <Snackbar {...args} type="success" heading="Saved" description="Your changes were saved." duration={5000} onDismiss={() => setOpen(false)} onAction={undefined} /> : null}
      </div>
    );
  },
};

type Option = { label: string; props: Omit<SnackbarProps, "type"> };
const options: Option[] = [
  { label: "Heading + message + both actions", props: { heading: "Info notification", description: "Supporting text with additional details about the notification.", onAction: noop, onDismiss: noop } },
  { label: "Message only", props: { description: "Report exported.", duration: 5000, showDismiss: false, onDismiss: noop } },
  { label: "Heading + message", props: { heading: "Info notification", description: "Supporting text with additional details about the notification.", duration: 5000, showDismiss: false, onDismiss: noop } },
  { label: "Dismiss only", props: { description: "Your filters were reset.", onDismiss: noop } },
  { label: "Action only (Undo)", props: { description: "Row deleted.", onAction: noop, actionLabel: "Undo" } },
  { label: "Without icon", props: { showIcon: false, heading: "Info notification", description: "This one has no icon.", onDismiss: noop } },
  { label: "Custom action labels", props: { heading: "New version available", description: "Reload to get the latest changes.", onDismiss: noop, dismissLabel: "Later", onAction: noop, actionLabel: "Reload" } },
  { label: "Long text", props: { description: "The export has finished, but 14 rows were skipped because their project code was missing. Download the skipped rows to fix them and try again.", onDismiss: noop } },
  { label: "Auto-dismiss after 5s", props: { description: "This closes by itself. Hover it to pause the timer.", duration: 5000, onDismiss: noop } },
];

const EXIT_MS = 180;

/**
 * How it behaves. Press a button and the snackbar slides in from the corner; dismiss it, or wait
 * when it has a timer, and it slides back out. Press several to stack them. Info type only.
 */
export const TryIt: Story = {
  tags: ["!autodocs"],
  parameters: { controls: { disable: true }, layout: "fullscreen" },
  render: () => {
    const [side, setSide] = useState<"right" | "left">("right");
    const [items, setItems] = useState<{ id: number; option: Option; exiting: boolean }[]>([]);
    const nextId = useRef(0);

    const dismiss = useCallback((id: number) => {
      setItems((list) => list.map((i) => (i.id === id ? { ...i, exiting: true } : i)));
      setTimeout(() => setItems((list) => list.filter((i) => i.id !== id)), EXIT_MS);
    }, []);
    const show = (option: Option) => setItems((list) => [...list, { id: nextId.current++, option, exiting: false }]);

    const x = side === "right" ? "48px" : "-48px";
    return (
      <div style={{ padding: 32, display: "grid", gap: 24, maxWidth: 560 }}>
        <div className="ds-text-body-14-regular" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          Corner:
          <Button variant={side === "right" ? "primary" : "secondary"} size="small" onClick={() => setSide("right")}>Bottom right</Button>
          <Button variant={side === "left" ? "primary" : "secondary"} size="small" onClick={() => setSide("left")}>Bottom left</Button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {options.map((o) => (
            <Button key={o.label} variant="secondary" onClick={() => show(o)}>{o.label}</Button>
          ))}
        </div>
        <div
          aria-label="Notifications"
          style={{
            position: "fixed", bottom: 24, [side]: 24, display: "flex", flexDirection: "column", gap: 12,
            alignItems: side === "right" ? "flex-end" : "flex-start", maxWidth: "calc(100vw - 48px)",
            "--ds-snackbar-enter-x": x, "--ds-snackbar-enter-y": "0px",
          } as CSSProperties}
        >
          {items.map(({ id, option, exiting }) => (
            <Snackbar
              key={id}
              type="info"
              {...option.props}
              data-exiting={exiting ? "" : undefined}
              onDismiss={option.props.onDismiss ? () => dismiss(id) : undefined}
              onAction={option.props.onAction ? () => dismiss(id) : undefined}
            />
          ))}
        </div>
      </div>
    );
  },
};
