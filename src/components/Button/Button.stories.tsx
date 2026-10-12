import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = { title: "atoms/Button", component: Button } satisfies Meta<typeof Button>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: { children: "Button" } };
