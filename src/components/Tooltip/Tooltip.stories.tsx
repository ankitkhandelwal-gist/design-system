import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import { Tooltip, type TooltipPlacement } from "./Tooltip";

const placements: TooltipPlacement[] = ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "right"];

const meta = {
  title: "atoms/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  args: { content: "Tooltip text", placement: "top", children: <Button variant="secondary">Hover me</Button> },
  argTypes: { placement: { control: "select", options: placements }, open: { control: "boolean" }, children: { control: false } },
  decorators: [(Story) => <div style={{ padding: "64px 120px", display: "flex", justifyContent: "center" }}><Story /></div>],
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Live controls. Hover or tab to the button. */
export const Default: Story = {};

/** Every placement, forced open. The arrow always points at the trigger. Matches the 8 Figma Placement variants. */
export const AllPlacements: Story = {
  parameters: { controls: { disable: true } },
  decorators: [(Story) => <div style={{ padding: "56px 120px" }}><Story /></div>],
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, auto)", gap: "72px 140px", justifyContent: "start" }}>
      {placements.map((p) => (
        <Tooltip key={p} placement={p} content="Tooltip text" open>
          <Button variant="secondary" size="small">{p}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

/** Longer text wraps at 320px. */
export const LongText: Story = {
  args: { open: true, content: "This tooltip has more to say, so it wraps onto a second line instead of growing wider than 320px." },
};

/** Placement is only a preference. Near the edges of the screen the tooltip flips to the other side and shifts its alignment so it stays visible. */
export const FlipsToFit: Story = {
  parameters: { controls: { disable: true }, layout: "fullscreen" },
  decorators: [(Story) => <Story />],
  render: () => {
    const corner = (style: React.CSSProperties, placement: TooltipPlacement) => (
      <div style={{ position: "fixed", ...style }}>
        <Tooltip placement={placement} content={`Asked for ${placement}`} open>
          <Button variant="secondary" size="small">{placement}</Button>
        </Tooltip>
      </div>
    );
    return (
      <>
        {corner({ top: 8, left: 8 }, "top")}
        {corner({ top: 8, right: 8 }, "top")}
        {corner({ bottom: 8, left: 8 }, "bottom")}
        {corner({ bottom: 8, right: 8 }, "bottom-start")}
        {corner({ top: "45%", left: 8 }, "left")}
        {corner({ top: "45%", right: 8 }, "right")}
      </>
    );
  },
};
