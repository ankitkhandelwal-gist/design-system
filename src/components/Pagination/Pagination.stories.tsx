import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Cell } from "../Cell";
import { Row } from "../Row";
import { Table } from "../Table";
import { Pagination } from "./Pagination";

const meta = {
  title: "molecules/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  args: { total: 100, defaultPage: 1 },
  argTypes: { page: { control: false }, pageSize: { control: false }, onPageChange: { control: false }, onPageSizeChange: { control: false } },
  decorators: [(Story) => <div style={{ width: 880 }}><Story /></div>],
} satisfies Meta<typeof Pagination>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Live controls. Click through the pages; change the results per page. */
export const Default: Story = {};

/** Figma "Different page": a page in the middle. */
export const MiddlePage: Story = { args: { defaultPage: 6, total: 200 } };

/** The last page: Next is disabled. */
export const LastPage: Story = { args: { defaultPage: 10 } };

/** Few results: every page is shown, no ellipsis. */
export const FewPages: Story = { args: { total: 35 } };

/** One page only: both arrows are disabled. */
export const SinglePage: Story = { args: { total: 8 } };

/** Controlled from outside: the parent owns page and size. */
export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => {
    const [page, setPage] = useState(3);
    const [pageSize, setPageSize] = useState(25);
    return (
      <div>
        <Pagination {...args} total={240} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} />
        <p className="ds-text-body-14-regular" style={{ padding: 12, margin: 0 }}>page {page}, {pageSize} per page</p>
      </div>
    );
  },
};

/** As a Table footer, paging real rows. */
export const InTable: Story = {
  parameters: { controls: { disable: true } },
  decorators: [(Story) => <div style={{ width: 880 }}><Story /></div>],
  render: () => {
    const all = Array.from({ length: 47 }, (_, i) => `Person ${i + 1}`);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const rows = all.slice((page - 1) * size, page * size);
    return (
      <Table
        aria-label="People"
        header={<Row><Cell>Name</Cell></Row>}
        footer={<Pagination total={all.length} page={page} pageSize={size} onPageChange={setPage} onPageSizeChange={(n) => { setSize(n); setPage(1); }} />}
      >
        {rows.map((n) => <Row key={n}><Cell>{n}</Cell></Row>)}
      </Table>
    );
  },
};
