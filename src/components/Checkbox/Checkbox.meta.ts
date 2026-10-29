import { defineMeta } from "../../meta/defineMeta";

export default defineMeta({
  component: {
    name: "Checkbox",
    category: "atoms",
    type: "input",
    description:
      "A box that lets users turn an option on or off, or select any number of items from a list. Three sizes, an optional label and supporting text, and an indeterminate (mixed) state.",
    path: "src/components/Checkbox",
    figma: { nodeId: "543:631" },
  },

  props: {
    label: { type: "ReactNode", description: "The checkbox label. Figma: Label. Without a label, pass aria-label." },
    showSubtext: { type: "boolean", default: true, description: "Show or hide the supporting text. Figma: Show Subtext." },
    subtext: { type: "ReactNode", description: "Supporting text below the label. Figma: Subtext." },
    size: {
      type: '"small" | "medium" | "large"',
      default: "small",
      description: "Controls box and text sizes. Maps to the Figma `Size` property.",
      values: ["small", "medium", "large"],
    },
    indeterminate: {
      type: "boolean",
      default: false,
      description: "Mixed state, e.g. a 'select all' checkbox when only some items are selected. Figma: Intermediate.",
    },
    checked: { type: "boolean", description: "Controlled checked value. Checked is the Figma Active state." },
    defaultChecked: { type: "boolean", default: false, description: "Initial value for an uncontrolled checkbox." },
    disabled: { type: "boolean", default: false, description: "Disables the checkbox and fades it to 60%. Figma: Disabled." },
    onChange: { type: "ChangeEventHandler<HTMLInputElement>", description: "Called when the user checks or unchecks it." },
    name: { type: "string", description: "Form field name. It is a native checkbox, so it submits with forms." },
    value: { type: "string", description: "Value submitted when checked." },
    "aria-label": { type: "string", description: "Accessible name when there is no visible label." },
  },

  variants: {
    axes: {
      size: ["small", "medium", "large"],
    },
    purpose: {
      "size.small": "Dense lists, table rows and filters. 16px box, 12px label.",
      "size.medium": "Default for forms. 20px box, 14px label.",
      "size.large": "Prominent or touch-first choices. 24px box, 16px label.",
    },
  },

  relationships: {
    commonPartners: ["Table", "Card", "Button", "Dropdown"],
    triggers: ["onChange"],
    exposesState: ["checked", "indeterminate"],
    blocksWhen: [
      { when: "disabled is true", effect: "The checkbox cannot be changed or focused and fades to 60% opacity." },
    ],
    role: "checkbox (native input). Indeterminate is exposed as aria-checked=mixed by the browser. Label is linked with aria-labelledby; supporting text with aria-describedby.",
    keyboardSupport:
      "Tab focuses the checkbox and shows a focus ring. Space toggles it. Disabled checkboxes are skipped. Clicking the label also toggles it.",
    screenReader:
      "Announced as a checkbox with its label, checked, unchecked or mixed, and the supporting text. Without a visible label, aria-label is required.",
  },

  tokens: {
    color: {
      "box.unchecked": "--ds-color-checkbox-unchecked-border",
      "box.checked": "--ds-color-checkbox-checked-bg",
      "box.disabled": "--ds-color-checkbox-disabled-bg",
      label: "--ds-color-checkbox-text",
      subtext: "--ds-color-checkbox-subtext",
      "text.disabled": "--ds-color-checkbox-disabled-text",
      "focus-ring": "--ds-color-border-primary-focus (not in Figma)",
    },
    spacing: {
      "gap.small": "--ds-spacing-3",
      "gap.medium": "--ds-spacing-4",
      "gap.large": "--ds-spacing-5",
      "text-gap": "--ds-spacing-2",
      "box-size.small": "--ds-icon-size-small",
      "box-size.medium": "--ds-icon-size-medium",
      "box-size.large": "--ds-icon-size-large",
    },
    typography: {
      "label.small": "--ds-font-size-body-small / --ds-line-height-body-small, weight medium",
      "label.medium": "--ds-font-size-body-medium / --ds-line-height-body-medium, weight regular",
      "label.large": "--ds-font-size-body-large / --ds-line-height-body-large, weight regular",
      "subtext.small": "--ds-font-size-body-xsmall / --ds-line-height-body-xsmall",
      "subtext.medium": "--ds-font-size-body-small / --ds-line-height-body-small",
      "subtext.large": "--ds-font-size-body-medium / --ds-line-height-body-medium",
      family: "--ds-font-family",
    },
    motion: {
      opacity: "disabled: 0.6 on the whole checkbox (Figma, no token)",
    },
  },

  aiHints: {
    priority: "medium",
    keywords: ["checkbox", "check box", "select", "multi-select", "tick", "agree", "terms", "select all", "filter"],
    selectionCriteria: {
      "size.small": "Dense lists, table rows, filters.",
      "size.medium": "Default for forms.",
      "size.large": "Prominent or touch-first choices.",
      indeterminate: "A parent 'select all' checkbox when only some children are selected.",
      subtext: "Add supporting text when the label alone does not explain the option.",
    },
    usage: {
      useCases: [
        "Agree to terms or confirm an option in a form",
        "Select any number of items from a list",
        "Select all / some / none in a table header",
      ],
      commonPatterns: [
        { name: "Select all", composition: "Checkbox[indeterminate=some selected, checked=all selected] above a list of Checkbox items" },
        { name: "Table row selection", composition: "Checkbox[size=small, aria-label=Select row] as the first cell of each Table row" },
        { name: "Terms", composition: "Checkbox[label=I agree to the terms, size=medium] above a primary Button" },
      ],
      antiPatterns: [
        {
          scenario: "Choosing exactly one option from a list",
          reason: "Checkboxes allow several selections.",
          alternative: "Use Radio buttons (or a Dropdown for long lists).",
        },
        {
          scenario: "A setting that applies immediately when flipped",
          reason: "A checkbox implies the value is submitted later.",
          alternative: "Use Toggle.",
        },
        {
          scenario: "Using the indeterminate state as a third user-selectable value",
          reason: "Indeterminate is computed from children, not chosen by the user.",
          alternative: "Set it only from the state of the items below.",
        },
        {
          scenario: "No label and no aria-label",
          reason: "A screen reader announces an unnamed checkbox.",
          alternative: "Always provide a visible label or aria-label.",
        },
      ],
    },
  },
});
