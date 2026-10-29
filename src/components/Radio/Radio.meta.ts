import { defineMeta } from "../../meta/defineMeta";

export default defineMeta({
  component: {
    name: "Radio",
    category: "atoms",
    type: "input",
    description:
      "A round button for choosing exactly one option from a short list. Radios that share a name form a group. Three sizes, an optional label and supporting text.",
    path: "src/components/Radio",
    figma: { nodeId: "543:807" },
  },

  props: {
    label: { type: "ReactNode", description: "The radio label. Figma: Label. Without a label, pass aria-label." },
    showSubtext: { type: "boolean", default: true, description: "Show or hide the supporting text. Figma: Show Subtext." },
    subtext: { type: "ReactNode", description: "Supporting text below the label. Figma: Subtext." },
    size: {
      type: '"small" | "medium" | "large"',
      default: "small",
      description: "Controls circle and text sizes. Maps to the Figma `Size` property.",
      values: ["small", "medium", "large"],
    },
    name: { type: "string", description: "Group name. Radios with the same name are one group: one selection, arrow-key navigation." },
    value: { type: "string", description: "Value submitted when this radio is selected." },
    checked: { type: "boolean", description: "Controlled selected value. Selected is the Figma Active state." },
    defaultChecked: { type: "boolean", default: false, description: "Initial selection for an uncontrolled radio." },
    disabled: { type: "boolean", default: false, description: "Disables the radio and fades it to 60%. Figma: Disabled." },
    onChange: { type: "ChangeEventHandler<HTMLInputElement>", description: "Called when this radio becomes selected." },
    "aria-label": { type: "string", description: "Accessible name when there is no visible label." },
  },

  variants: {
    axes: {
      size: ["small", "medium", "large"],
    },
    purpose: {
      "size.small": "Dense forms and filters. 16px circle, 12px label.",
      "size.medium": "Default for forms. 20px circle, 14px label.",
      "size.large": "Prominent or touch-first choices. 24px circle, 16px label.",
    },
  },

  relationships: {
    commonPartners: ["Card", "Button", "InputField"],
    triggers: ["onChange"],
    exposesState: ["checked"],
    blocksWhen: [
      { when: "disabled is true", effect: "The radio cannot be selected or focused and fades to 60% opacity." },
    ],
    role: "radio (native input). Radios with the same name act as a radio group. Label is linked with aria-labelledby; supporting text with aria-describedby.",
    keyboardSupport:
      "Tab moves focus into the group (to the selected radio, or the first). Arrow keys move the selection within the group. Space selects the focused radio. Disabled radios are skipped. Clicking the label also selects it.",
    screenReader:
      "Announced as a radio button with its label, selected or not, its position in the group, and the supporting text. Wrap a group in a fieldset with a legend so the group question is announced.",
  },

  tokens: {
    color: {
      "circle.border-off": "--ds-color-radio-inactive-border",
      "circle.border-on": "--ds-color-radio-active-bg",
      dot: "--ds-color-radio-active-bg",
      "circle.disabled": "--ds-color-radio-disabled-bg",
      label: "--ds-color-radio-text",
      subtext: "--ds-color-radio-subtext",
      "text.disabled": "--ds-color-radio-disabled-text",
      "focus-ring": "--ds-color-border-primary-focus (not in Figma)",
    },
    spacing: {
      "gap.small": "--ds-spacing-3",
      "gap.medium": "--ds-spacing-4",
      "gap.large": "--ds-spacing-5",
      "text-gap": "--ds-spacing-2",
      "circle-size.small": "--ds-icon-size-small",
      "circle-size.medium": "--ds-icon-size-medium",
      "circle-size.large": "--ds-icon-size-large",
    },
    typography: {
      "label.small": "--ds-font-size-body-small / --ds-line-height-body-small",
      "label.medium": "--ds-font-size-body-medium / --ds-line-height-body-medium",
      "label.large": "--ds-font-size-body-large / --ds-line-height-body-large",
      "label.weight": "--ds-font-weight-medium",
      "subtext.small": "--ds-font-size-body-xsmall / --ds-line-height-body-xsmall",
      "subtext.medium": "--ds-font-size-body-small / --ds-line-height-body-small",
      "subtext.large": "--ds-font-size-body-medium / --ds-line-height-body-medium",
      family: "--ds-font-family",
    },
    border: {
      radius: "--ds-radius-full",
      "width.small-medium": "1.5px, inside (Figma, no token)",
      "width.large": "2px, inside (Figma, no token)",
    },
    motion: {
      opacity: "disabled: 0.6 on the whole radio (Figma, no token)",
    },
  },

  aiHints: {
    priority: "medium",
    keywords: ["radio", "radio button", "option", "choose one", "single select", "choice", "group", "form"],
    selectionCriteria: {
      "size.small": "Dense forms and filters.",
      "size.medium": "Default for forms.",
      "size.large": "Prominent or touch-first choices.",
      name: "Give every radio in a group the same name so only one can be selected.",
      subtext: "Add supporting text when the label alone does not explain the option.",
    },
    usage: {
      useCases: [
        "Pick one option from two to five choices",
        "Choose a plan, a delivery method or a format",
        "Settings where the options should all be visible at once",
      ],
      commonPatterns: [
        { name: "Radio group", composition: "fieldset[legend=question] > Radio[name=group, size=medium] x 2-5, stacked 12px apart" },
        { name: "With explanation", composition: "Radio[label, subtext] for each plan or option" },
        { name: "Form step", composition: "Radio group above a primary Button" },
      ],
      antiPatterns: [
        {
          scenario: "Choosing several options",
          reason: "Radios allow only one selection.",
          alternative: "Use Checkbox.",
        },
        {
          scenario: "More than about six options",
          reason: "A long list of radios takes too much space and is hard to scan.",
          alternative: "Use a Dropdown.",
        },
        {
          scenario: "A single on/off setting",
          reason: "One radio cannot be turned off once selected.",
          alternative: "Use Toggle or Checkbox.",
        },
        {
          scenario: "Radios in a group without a shared name",
          reason: "Each one then behaves independently and the arrow keys do not move between them.",
          alternative: "Give all radios in the group the same name.",
        },
      ],
    },
  },
});
