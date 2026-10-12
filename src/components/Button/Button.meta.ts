import { defineMeta } from "../../meta/defineMeta";

export default defineMeta({
  component: {
    name: "Button",
    category: "atoms",
    type: "interactive",
    description:
      "Triggers an action or submits a form. Six visual variants and three sizes, with optional leading and trailing icons. Hover, focus and disabled states are handled automatically.",
    path: "src/components/Button",
    figma: { nodeId: "263:829" },
  },

  props: {
    variant: {
      type: '"primary" | "secondary" | "tertiary" | "destructive" | "success" | "link"',
      default: "primary",
      description: "Visual style. Maps to the Figma `Type` property.",
      values: ["primary", "secondary", "tertiary", "destructive", "success", "link"],
    },
    size: {
      type: '"small" | "medium" | "large"',
      default: "small",
      description: "Controls padding, font size and icon size.",
      values: ["small", "medium", "large"],
    },
    children: { type: "ReactNode", required: true, description: "The button label." },
    leadingIcon: {
      type: "ReactNode",
      description: "Icon before the label. Decorative (aria-hidden). Use svg with currentColor.",
    },
    trailingIcon: { type: "ReactNode", description: "Icon after the label. Decorative (aria-hidden)." },
    disabled: { type: "boolean", default: false, description: "Disables the button (native disabled attribute)." },
    type: {
      type: '"button" | "submit" | "reset"',
      default: "button",
      description: "Native button type. Defaults to button so it never submits a form by accident.",
      values: ["button", "submit", "reset"],
    },
    onClick: { type: "MouseEventHandler<HTMLButtonElement>", description: "Click handler." },
    "aria-label": {
      type: "string",
      description: "Required when there is no visible text label (icon-only buttons).",
    },
  },

  variants: {
    axes: {
      variant: ["primary", "secondary", "tertiary", "destructive", "success", "link"],
      size: ["small", "medium", "large"],
    },
    purpose: {
      "variant.primary": "The single main action in a view (Save, Submit, Continue). Use at most one per section.",
      "variant.secondary": "Supporting action next to a primary (Cancel, Back). Grey filled.",
      "variant.tertiary": "Low-emphasis action with no container (Skip, Edit, Learn more in dense UI).",
      "variant.destructive": "Irreversible or harmful action (Delete, Remove, Revoke).",
      "variant.success": "Positive confirmation action (Approve, Mark complete).",
      "variant.link": "Navigation-like action that reads as inline text, in the link color.",
      "size.small": "Dense layouts such as tables, toolbars and cards. 36px tall (filled).",
      "size.medium": "Default size for forms and dialogs. 40px tall (filled).",
      "size.large": "Prominent actions such as page-level CTAs. 48px tall (filled).",
    },
  },

  relationships: {
    commonPartners: ["Tooltip", "Dropdown", "InputField", "Snackbar", "Table"],
    triggers: ["onClick"],
    blocksWhen: [
      { when: "disabled is true", effect: "Click events do not fire and the button leaves the tab order." },
    ],
    role: "button",
    keyboardSupport:
      "Tab focuses the button (visible 2px focus ring). Enter and Space activate it. Disabled buttons are not focusable.",
    screenReader:
      "Announced as a button with its label. Icons are aria-hidden, so icon-only buttons must set aria-label. Disabled state is announced as unavailable.",
  },

  tokens: {
    color: {
      "primary.bg": "--ds-color-button-primary-bg",
      "primary.bg-hover": "--ds-color-button-primary-hover",
      "primary.bg-disabled": "--ds-color-button-primary-disabled-bg",
      "primary.text": "--ds-color-button-primary-text",
      "primary.text-disabled": "--ds-color-button-primary-disabled-text",
      "primary.focus-ring": "--ds-color-border-primary-focus",
      "secondary.bg": "--ds-color-button-secondary-grey-bg",
      "secondary.bg-hover": "--ds-color-button-secondary-grey-hover",
      "secondary.bg-disabled": "--ds-color-button-secondary-grey-disabled-bg",
      "secondary.text": "--ds-color-button-secondary-grey-text",
      "secondary.text-disabled": "--ds-color-button-secondary-grey-disabled-text",
      "secondary.focus-ring": "--ds-color-border-default",
      "tertiary.text": "--ds-color-button-tertiary-text",
      "tertiary.text-hover": "--ds-color-button-tertiary-hover",
      "tertiary.text-disabled": "--ds-color-button-tertiary-disabled",
      "tertiary.focus-ring": "--ds-color-border-primary-focus",
      "destructive.bg": "--ds-color-button-danger-bg",
      "destructive.bg-hover": "--ds-color-button-danger-hover",
      "destructive.bg-disabled": "--ds-color-button-danger-disabled-bg",
      "destructive.text": "--ds-color-button-danger-text",
      "destructive.focus-ring": "--ds-color-border-error-focus",
      "success.bg": "--ds-color-button-success-bg",
      "success.bg-hover": "--ds-color-button-success-hover",
      "success.bg-disabled": "--ds-color-button-success-disabled-bg",
      "success.text": "--ds-color-button-success-text",
      "success.text-disabled": "--ds-color-button-success-disabled-text",
      "success.focus-ring": "--ds-color-border-success-focus",
      "link.text": "--ds-color-button-link-text",
      "link.text-hover": "--ds-color-button-link-hover",
      "link.text-disabled": "--ds-color-button-link-disabled",
      "link.focus-ring": "--ds-color-border-primary",
      "icon.filled": "--ds-color-icon-inverse (primary, destructive, success)",
      "icon.secondary": "--ds-color-icon-secondary",
      "icon.tertiary": "--ds-color-icon-primary",
      "icon.link": "--ds-color-icon-info",
      "icon.disabled": "--ds-color-icon-disabled",
    },
    spacing: {
      "padding-x.small": "--ds-spacing-5",
      "padding-x.medium-large": "--ds-spacing-6",
      "padding-y.small-medium": "--ds-spacing-4",
      "padding-y.large": "--ds-spacing-5",
      "gap.small": "--ds-spacing-3",
      "gap.medium-large": "--ds-spacing-4",
      "icon-size.small": "--ds-icon-size-small",
      "icon-size.medium-large": "--ds-icon-size-medium",
    },
    typography: {
      "size.small": "--ds-font-size-body-medium / --ds-line-height-body-medium",
      "size.medium-large": "--ds-font-size-body-large / --ds-line-height-body-large",
      weight: "--ds-font-weight-medium",
      family: "--ds-font-family",
    },
    border: {
      radius: "--ds-radius-md",
      "focus-width": "2px, inset",
    },
  },

  aiHints: {
    priority: "high",
    keywords: ["button", "cta", "action", "submit", "save", "cancel", "delete", "confirm", "link button", "click"],
    selectionCriteria: {
      primary: "The one main action in the view. Never use more than one per section.",
      secondary: "An alternative or cancelling action that sits beside a primary.",
      tertiary: "A low-emphasis action where a filled button would add visual noise.",
      destructive: "The action deletes or cannot be undone.",
      success: "The action approves or completes something positive.",
      link: "The action behaves like navigation and should read as text.",
      "size.small": "Tables, toolbars, cards and other dense areas.",
      "size.medium": "Forms and dialogs (default choice for page content).",
      "size.large": "Hero or page-level calls to action.",
    },
    usage: {
      useCases: [
        "Submit or save a form",
        "Confirm or cancel a dialog",
        "Trigger a destructive action after confirmation",
        "Inline text-style action inside dense UI",
      ],
      commonPatterns: [
        { name: "Dialog footer", composition: "Button[secondary] (Cancel) + Button[primary] (Confirm), right-aligned" },
        { name: "Destructive confirm", composition: "Button[secondary] (Cancel) + Button[destructive] (Delete)" },
        { name: "Row action", composition: "Button[tertiary, size=small] with a leadingIcon inside a Table row" },
        { name: "Icon-only", composition: "Button with leadingIcon, empty-looking label avoided: set aria-label and a Tooltip" },
      ],
      antiPatterns: [
        {
          scenario: "Two primary buttons side by side",
          reason: "Competing calls to action dilute the main action.",
          alternative: "Keep one primary and make the other secondary.",
        },
        {
          scenario: "Using Button to navigate to another page",
          reason: "Buttons trigger actions; navigation should be an anchor for semantics and right-click behavior.",
          alternative: "Render a real link; style it with the link variant tokens.",
        },
        {
          scenario: "Destructive variant for a non-destructive 'No' or 'Cancel'",
          reason: "Red implies data loss.",
          alternative: "Use secondary.",
        },
        {
          scenario: "Icon-only button without aria-label",
          reason: "Icons are aria-hidden, so screen readers get no name.",
          alternative: "Always set aria-label (and ideally a Tooltip).",
        },
      ],
    },
  },
});
