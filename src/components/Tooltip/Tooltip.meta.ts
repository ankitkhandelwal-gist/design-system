import { defineMeta } from "../../meta/defineMeta";

export default defineMeta({
  component: {
    name: "Tooltip",
    category: "atoms",
    type: "display",
    description:
      "A small dark label with an arrow that appears next to an element on hover or keyboard focus, to explain it. Use for icon-only buttons, truncated text and short hints. It positions itself: it flips to the other side or shifts to stay inside the viewport.",
    path: "src/components/Tooltip",
    figma: { nodeId: "894:39" },
  },

  props: {
    children: { type: "ReactNode", required: true, description: "The element the tooltip describes. Usually a single focusable element such as a Button." },
    content: { type: "ReactNode", required: true, description: "The tooltip text. Figma: label." },
    placement: {
      type: "TooltipPlacement",
      default: "top",
      description:
        "Preferred spot around the trigger; the arrow points back at it. Figma: Placement, with the same names (Top = top, Top Start = top-start, and so on). It is only a preference: the tooltip flips to the opposite side, or shifts its alignment, when there is no room in the viewport.",
    },
    open: { type: "boolean", description: "Force the tooltip open or closed. Leave unset for hover and focus." },
    className: { type: "string", description: "Extra class on the wrapper element." },
  },

  variants: {
    axes: {
      placement: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "right"] as const,
    },
    purpose: {
      "placement.top": "Default. Above the trigger, centered. Flips below if there is no room above.",
      "placement.top-start": "Above, lined up with the trigger's start.",
      "placement.top-end": "Above, lined up with the trigger's end.",
      "placement.bottom": "Below the trigger, centered. Flips above if there is no room below.",
      "placement.bottom-start": "Below, lined up with the trigger's start.",
      "placement.bottom-end": "Below, lined up with the trigger's end.",
      "placement.left": "To the left of the trigger. Flips to the right if there is no room.",
      "placement.right": "To the right of the trigger. Flips to the left if there is no room.",
    },
  },

  relationships: {
    commonPartners: ["Button", "Tag"],
    triggers: [],
    exposesState: [],
    role: "tooltip. The trigger gets aria-describedby pointing at it while it is shown.",
    keyboardSupport: "Appears when the trigger receives focus and hides on blur. Escape hides it while the trigger stays focused.",
    screenReader:
      "Read as the trigger's description, not its name, so an icon-only trigger still needs its own aria-label. Only visible while open.",
  },

  tokens: {
    color: { background: "--ds-color-tooltip-bg", text: "--ds-color-tooltip-text" },
    spacing: { "padding-y": "--ds-spacing-4", "padding-x": "--ds-spacing-5", offset: "--ds-spacing-2 (gap to trigger, not in Figma)" },
    radius: { body: "--ds-radius-md" },
    shadow: { body: "--ds-shadow-md" },
    typography: { label: "ds-text-body-12-medium" },
    size: { arrow: "9x5 (Figma, no token)", "max-width": "320px (not in Figma)" },
  },

  aiHints: {
    priority: "medium",
    keywords: ["tooltip", "hint", "hover text", "help text", "popover label", "title", "explain icon"],
    selectionCriteria: {
      placement: "Default top. It is only a preference, so do not pick a placement to avoid edges or clipping; the tooltip flips and shifts by itself.",
    },
    usage: {
      useCases: ["Name an icon-only Button", "Show the full value of truncated text", "A one-line hint on hover"],
      commonPatterns: [
        { name: "Icon button", composition: "Tooltip[content=...] > Button[iconOnly, aria-label=...]" },
        { name: "Beside the trigger", composition: "Tooltip[placement=right] in a toolbar or side rail" },
      ],
      antiPatterns: [
        {
          scenario: "Putting links, buttons or forms inside the tooltip",
          reason: "It disappears when the pointer or focus leaves the trigger, so it cannot be reached.",
          alternative: "Use a popover or dialog.",
        },
        {
          scenario: "Using it as the only label of a control",
          reason: "Touch users and screen readers may never see it.",
          alternative: "Give the control a visible label or aria-label; the tooltip adds detail.",
        },
        {
          scenario: "Long or essential content",
          reason: "It is hidden by default and meant for one short line.",
          alternative: "Show the text inline, or use helper text.",
        },
      ],
    },
  },
});
