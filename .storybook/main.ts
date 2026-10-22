import type { StorybookConfig } from '@storybook/react-vite';
import { svgrPlugin } from '../vite.svgr.ts';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp"
  ],
  "framework": "@storybook/react-vite",
  async viteFinal(config) {
    config.plugins = [...(config.plugins ?? []), svgrPlugin()];
    return config;
  },
};
export default config;