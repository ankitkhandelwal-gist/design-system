import { defineMeta } from "../../meta/defineMeta";

export default defineMeta({
  component: {
    name: "Toggle",
    category: "atoms",
    type: "input",
    description:
      "A switch for an on/off setting that takes effect immediately. Three sizes, an optional label and supporting text. Off, on and disabled states are handled automatically.",
    path: "src/components/Toggle",
    figma: { nodeId: "543:998" },
  },

  props: {
    label: {
      type: "ReactNode",
      description: "The toggle label. Figma: Label. Without a label, pass aria-label.",
    },
    showSubtext: { type: "boolean", default: true, description: "Show or hide the supporting text. Figma: Show Subtext." },
    subtext: { type: "ReactNode", description: "Supporting text below the label. Figma: Subtext." },
    size: {
      type: '"small" | "medium" | "large"',
      default: "small",
      description: "Controls track, knob and text sizes. Maps to the Figma `Size` property.",
      values: ["small", "medium", "large"],
    },
    checked: { type: "boolean", description: "Controlled on/off value. On is the Figma Active state." },
    defaultChecked: { type: "boolean", default: false, description: "Initial value for an uncontrolled toggle." },
    disabled: { type: "boolean", default: false, description: "Disables the toggle and fades it to 60%. Figma: Disabled." },
    onChange: { type: "ChangeEventHandler<HTMLInputElement>", description: "Called when the user flips the switch." },
    name: { type: "string", description: "Form field name. The toggle is a native checkbox, so it submits with forms." },
    "aria-label": { type: "string", description: "Accessible name when there is no visible label." },
  },

  variants: {
    axes: {
      size: ["small", "medium", "large"],
    },
    purpose: {
      "size.small": "Dense settings lists and table rows. 16px track, 12px text.",
      "size.medium": "Default for forms and settings pages. 20px track, 14px text.",
      "size.large": "Prominent or touch-first settings. 24px track, 16px text.",
    },
  },

  relationships: {
    commonPartners: ["Card", "Table", "Tooltip", "Button"],
    triggers: ["onChange"],
    exposesState: ["checked"],
    blocksWhen: [
      { when: "disabled is true", effect: "The toggle cannot be flipped or focused and fades to 60% opacity." },
    ],
    role: "switch (native checkbox with role=switch). Label is linked with aria-labelledby; supporting text with aria-describedby.",
    keyboardSupport:
      "Tab focuses the switch and shows a focus ring. Space flips it. Disabled toggles are skipped. Clicking the label also flips it.",
    screenReader:
      "Announced as a switch with its label, on or off, and the supporting text. Without a visible label, aria-label is required.",
  },

  tokens: {
    color: {
      "track.off": "--ds-color-toggle-inactive-bg",
      "track.on": "--ds-color-toggle-active-bg",
      "track.disabled": "--ds-color-toggle-disabled-bg",
      knob: "--ds-color-toggle-knob",
      label: "--ds-color-toggle-text",
      subtext: "--ds-color-toggle-subtext",
      "text.disabled": "--ds-color-toggle-disabled-text",
      "focus-ring": "--ds-color-border-primary-focus (not in Figma)",
    },
    spacing: {
      "gap.small": "--ds-spacing-3",
      "gap.medium": "--ds-spacing-4",
      "gap.large": "--ds-spacing-5",
      "text-gap": "--ds-spacing-2",
      "knob-padding": "--ds-spacing-1",
      "knob-size.small": "--ds-spacing-5",
      "knob-size.medium": "--ds-spacing-6",
      "knob-size.large": "--ds-spacing-7",
    },
    typography: {
      "label.small": "--ds-font-size-body-small / --ds-line-height-body-small",
      "label.medium": "--ds-font-size-body-medium / --ds-line-height-body-medium",
      "label.large": "--ds-font-size-body-large / --ds-line-height-body-large",
      "subtext.small": "--ds-font-size-body-xsmall / --ds-line-height-body-xsmall",
      "subtext.medium": "--ds-font-size-body-small / --ds-line-height-body-small",
      "subtext.large": "--ds-font-size-body-medium / --ds-line-height-body-medium",
      "label.weight": "--ds-font-weight-medium",
      "subtext.weight": "--ds-font-weight-regular",
      family: "--ds-font-family",
    },
    border: {
      radius: "--ds-radius-full",
    },
    motion: {
      opacity: "disabled: 0.6 on the whole toggle (Figma, no token)",
    },
  },

  aiHints: {
    priority: "medium",
    keywords: ["toggle", "switch", "on off", "setting", "enable", "disable", "preference", "boolean"],
    selectionCriteria: {
      "size.small": "Dense lists, table rows, compact settings.",
      "size.medium": "Default for forms and settings pages.",
      "size.large": "Prominent settings, touch-first screens.",
      subtext: "Add supporting text when the label alone does not explain what turning it on does.",
    },
    usage: {
      useCases: [
        "Enable or disable a feature or notification setting",
        "Preference lists where each change applies immediately",
        "Show or hide a section of a dashboard",
      ],
      commonPatterns: [
        { name: "Settings row", composition: "Toggle[label, subtext, size=medium] one per row in a settings card" },
        { name: "Compact table cell", composition: "Toggle[size=small, aria-label] with no visible label in a table row" },
        { name: "Disabled with reason", composition: "Toggle[disabled, subtext explaining why it is unavailable]" },
      ],
      antiPatterns: [
        {
          scenario: "Using a toggle inside a form that needs a Save button",
          reason: "A toggle implies the change happens immediately.",
          alternative: "Use a checkbox when the value is submitted later with the form.",
        },
        {
          scenario: "A toggle with an unclear label (e.g. 'Dark')",
          reason: "Users cannot tell if on means the option is enabled or the opposite.",
          alternative: "Name the setting (e.g. 'Dark mode') so on means enabled.",
        },
        {
          scenario: "Choosing one of several options",
          reason: "A toggle is a single boolean.",
          alternative: "Use radio buttons, a dropdown or tabs.",
        },
        {
          scenario: "No label and no aria-label",
          reason: "A screen reader announces an unnamed switch.",
          alternative: "Always provide a visible label or aria-label.",
        },
      ],
    },
  },
});
