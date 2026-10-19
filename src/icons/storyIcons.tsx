import type { ReactNode } from "react";
import * as iconExports from "./index";

/** The Figma placeholder square. */
export const SquareIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" focusable="false">
    <rect width="20" height="20" rx="4" />
  </svg>
);

/**
 * Icon picker for Storybook Controls: "None", the Figma placeholder square, and every `*Icon`
 * exported from src/icons. Add an icon there and it shows up in the dropdown automatically.
 */
const components: Record<string, ReactNode> = Object.fromEntries(
  Object.entries(iconExports)
    .filter(([name]) => name.endsWith("Icon"))
    .map(([name, Icon]) => [name.replace(/Icon$/, ""), <Icon key={name} />]),
);
export const iconOptions = ["None", "Placeholder", ...Object.keys(components)];
export const iconMapping: Record<string, ReactNode> = { None: undefined, Placeholder: <SquareIcon />, ...components };
/** Default icon for stories that are not driven by Controls. */
export const DefaultStoryIcon = () => <>{iconMapping.Search ?? <SquareIcon />}</>;
