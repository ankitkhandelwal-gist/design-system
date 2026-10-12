import type { Meta, StoryObj } from "@storybook/react-vite";
import { __Name__ } from "./__Name__";

const meta = { title: "__category__/__Name__", component: __Name__ } satisfies Meta<typeof __Name__>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: { children: "__Name__" } };
