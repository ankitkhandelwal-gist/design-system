import { defineMeta } from "../../meta/defineMeta";

export default defineMeta({
  component: {
    name: "EmptyState",
    category: "molecules",
    type: "display",
    description:
      "A centered icon, title, short description and optional action shown where there is nothing to display, such as a table with no rows or a search with no matches.",
    path: "src/components/EmptyState",
    figma: { nodeId: "1327:2052" },
  },

  props: {
    title: { type: "string", required: true, description: "Short headline. Figma: Title." },
    description: { type: "string", description: "One supporting sentence, up to 480px wide. Figma: Description." },
    icon: {
      type: "ReactNode",
      default: "<SearchOffIcon />",
      description: "Icon above the title, decorative. Pass null to hide it.",
    },
    action: { type: "ReactNode", description: "Optional call to action, usually a secondary small Button. Figma: Show Action." },
    className: { type: "string", description: "Extra class on the root element." },
  },

  variants: {
    axes: {},
    purpose: {},
  },

  relationships: {
    commonPartners: ["Table", "Button"],
    role: "No role of its own; plain text content. The icon is aria-hidden.",
    keyboardSupport: "Not interactive itself. An action Button inside it is focusable as usual.",
    screenReader: "Reads the title, then the description, then the action.",
  },

  tokens: {
    color: {
      background: "--ds-color-table-row-bg",
      icon: "--ds-color-icon-secondary",
      title: "--ds-color-heading-primary",
      description: "--ds-color-text-secondary",
    },
    spacing: {
      "padding-y": "--ds-spacing-9",
      "padding-x": "--ds-spacing-8",
      gap: "--ds-spacing-5",
    },
    typography: { title: "ds-text-body-16-semibold", description: "ds-text-body-14-regular" },
    size: { icon: "--ds-icon-size-x-large", "max-width": "480px (Figma, no token)" },
  },

  aiHints: {
    priority: "medium",
    keywords: ["empty state", "no results", "no data", "nothing here", "zero state", "blank slate", "no matches"],
    selectionCriteria: {},
    usage: {
      useCases: ["A table or list with no rows", "A search or filter that matches nothing", "A section the user has not filled yet"],
      commonPatterns: [
        { name: "Empty table", composition: "Table[empty=<EmptyState title=... description=... />]" },
        { name: "With next step", composition: "EmptyState[action=<Button variant=secondary size=small>]" },
      ],
      antiPatterns: [
        {
          scenario: "Showing it while data is still loading",
          reason: "It tells the user there is nothing when there may be something.",
          alternative: "Show a skeleton or spinner until the data arrives.",
        },
        {
          scenario: "Using it for errors",
          reason: "An empty result and a failed request need different wording and actions.",
          alternative: "Use an Alert or Snackbar for failures.",
        },
      ],
    },
  },
});
