import svgr from "vite-plugin-svgr";

/**
 * Turns `import Icon from "x.svg?react"` into a React component. Shared by Storybook and Vitest.
 * - fill=currentColor: icons take the surrounding text color.
 * - 1em default size: components (Button, Tag, InputField) override it through CSS.
 * - no fixed width/height from the SVG file (Material Symbols ship 48x48).
 */
export const svgrPlugin = () =>
  svgr({
    include: "**/*.svg?react",
    svgrOptions: {
      dimensions: false,
      svgProps: { fill: "currentColor", width: "1em", height: "1em", focusable: "false" },
    },
  });
