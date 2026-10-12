import { defineMeta } from "../../meta/defineMeta";

// Fill every TODO. Keep in sync with props, variants and tokens in the sibling files.
export default defineMeta({
  component: {
    name: "__Name__",
    category: "__category__",
    type: "display", // TODO: interactive | display | container | input | navigation
    description: "TODO: what it is and when to use it",
    path: "src/components/__Name__",
    figma: { nodeId: null },
  },
  props: {
    children: { type: "ReactNode", description: "Content" },
  },
  variants: {
    axes: {}, // e.g. { size: ["sm", "md"] as const }
    purpose: {}, // e.g. { "size.sm": "Dense layouts" } (one entry per axis value)
  },
  relationships: {
    role: "TODO: ARIA role",
    keyboardSupport: "TODO",
    screenReader: "TODO",
  },
  tokens: {},
  aiHints: {
    priority: "medium",
    keywords: ["__name__"],
    selectionCriteria: {},
    usage: { useCases: [], commonPatterns: [], antiPatterns: [] },
  },
});
