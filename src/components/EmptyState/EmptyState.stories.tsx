import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import { Cell } from "../Cell";
import { Row } from "../Row";
import { Table } from "../Table";
import { EmptyState } from "./EmptyState";

const meta = {
  title: "molecules/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  args: { title: "No results found", description: "Try changing your search or filters to see more results." },
  argTypes: { icon: { control: false }, action: { control: false } },
  decorators: [(Story) => <div style={{ width: 640 }}><Story /></div>],
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Live controls. */
export const Default: Story = {};

/** With a call to action. */
export const WithAction: Story = {
  args: { action: <Button variant="secondary" size="small">Clear filters</Button> },
};

/** Without the icon. */
export const NoIcon: Story = { args: { icon: null } };

/** Title only. */
export const TitleOnly: Story = { args: { description: undefined } };

/** Inside a Table with no rows, through the `empty` prop. */
export const InTable: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <Table aria-label="Empty" header={<Row><Cell>Name</Cell><Cell>Role</Cell></Row>} empty={<EmptyState {...args} action={<Button variant="secondary" size="small">Clear filters</Button>} />} />
  ),
};
