import { defineMeta } from "../../meta/defineMeta";

export default defineMeta({
  component: {
    name: "InputField",
    category: "molecules",
    type: "input",
    description:
      "A single-line text field with a label, optional icons, a mandatory marker and helper text. Handles default, focused, filled, error, success and disabled states.",
    path: "src/components/InputField",
    figma: { nodeId: "1198:36037" },
  },

  props: {
    label: { type: "string", description: "The field label. Figma: Label. Without a label, pass aria-label." },
    showLabelIcon: { type: "boolean", default: true, description: "Show or hide the icon next to the label. Figma: Show Label Icon." },
    labelIcon: { type: "ReactNode", description: "Icon after the label (e.g. info). Decorative (aria-hidden)." },
    required: {
      type: "boolean",
      default: false,
      description: "Shows the mandatory asterisk and sets the native required attribute. Figma: Is mandatory.",
    },
    placeholder: { type: "string", description: "Hint text shown while empty. Figma: Placeholder." },
    showLeadingIcon: { type: "boolean", default: true, description: "Show or hide the leading icon. Figma: Show Leading Icon." },
    leadingIcon: { type: "ReactNode", description: "Icon inside the field before the text (20px). Decorative." },
    showTrailingIcon: { type: "boolean", default: true, description: "Show or hide the trailing icon. Figma: Show Trailing Icon." },
    trailingIcon: {
      type: "ReactNode",
      description: "Icon inside the field after the text (16px). Takes the error or success color from status. Decorative.",
    },
    onTrailingIconClick: {
      type: "MouseEventHandler<HTMLButtonElement>",
      description:
        "Makes the trailing icon a button. The component does not define what it does: pass any icon and any handler (clear, delete, open help...). Requires trailingIconLabel. Without it the icon is decorative. The leading icon has no action.",
    },
    trailingIconLabel: {
      type: "string",
      description: "Accessible name of the trailing icon button. Required when onTrailingIconClick is set.",
    },
    showHelperText: { type: "boolean", default: true, description: "Show or hide the helper text. Figma: Show Subtext." },
    helperText: { type: "string", description: "Text below the field. Figma: Subtext. Colored by status." },
    status: {
      type: '"default" | "error" | "success"',
      default: "default",
      description: "Validation state. Maps to the Figma Error and Success states. error also sets aria-invalid.",
      values: ["default", "error", "success"],
    },
    disabled: { type: "boolean", default: false, description: "Disables the input and greys the whole field." },
    value: { type: "string", description: "Controlled value. Any non-empty value is the Figma Filled state." },
    onChange: { type: "ChangeEventHandler<HTMLInputElement>", description: "Change handler." },
  },

  variants: {
    axes: {
      status: ["default", "error", "success"],
    },
    purpose: {
      "status.default": "No validation result yet. Idle, focused and filled all use this.",
      "status.error": "The value is invalid. Pair with helper text that explains how to fix it.",
      "status.success": "The value was validated successfully (e.g. an available username).",
    },
  },

  relationships: {
    commonPartners: ["Button", "Dropdown", "Tooltip", "Snackbar"],
    triggers: ["onChange", "onFocus", "onBlur", "onTrailingIconClick"],
    exposesState: ["value", "focused", "status"],
    blocksWhen: [
      { when: "disabled is true", effect: "The field cannot be focused or edited and all colors switch to the disabled set." },
    ],
    role: "textbox (native input). The label is a real <label>; helper text is linked with aria-describedby.",
    keyboardSupport:
      "Tab focuses the input and shows the focus ring. Standard text editing keys apply. A trailing icon with an action is the next tab stop; Enter and Space activate it. Disabled fields are skipped.",
    screenReader:
      "Announced with its label, required state and helper text. error sets aria-invalid. Icons are aria-hidden, so the status must also appear in the helper text, not only in color or icons. A trailing icon with an action is a button named by trailingIconLabel.",
  },

  tokens: {
    color: {
      "container.bg": "--ds-color-input-bg",
      "container.bg-disabled": "--ds-color-input-disabled-bg",
      "border.default": "--ds-color-input-border",
      "border.focus": "--ds-color-input-border-focus",
      "border.error": "--ds-color-input-border-error",
      "border.success": "--ds-color-border-success",
      "border.disabled": "--ds-color-border-disabled",
      "ring.error": "--ds-color-border-error-focus (50%)",
      "ring.success": "--ds-color-border-success-focus (50%)",
      "ring.default": "rgb(176 186 201 / 0.5) (no Figma variable; hardcoded in InputField.tokens.css)",
      "text.value": "--ds-color-input-text",
      "text.placeholder": "--ds-color-input-placeholder",
      "text.disabled": "--ds-color-input-disabled-text",
      label: "--ds-color-input-label",
      "label.disabled": "--ds-color-text-disabled",
      mandatory: "--ds-color-input-mandatory",
      "helper.default": "--ds-color-input-helper-text",
      "helper.error": "--ds-color-text-error",
      "helper.success": "--ds-color-text-success",
      "helper.disabled": "--ds-color-text-disabled",
      "icon.leading": "--ds-color-icon-primary",
      "icon.trailing": "--ds-color-icon-secondary",
      "icon.trailing-error": "--ds-color-icon-error",
      "icon.trailing-success": "--ds-color-icon-success",
      "icon.label": "--ds-color-icon-secondary",
      "icon.disabled": "--ds-color-icon-disabled",
    },
    spacing: {
      "container.padding-x": "--ds-spacing-5",
      "container.padding-y": "--ds-spacing-4",
      "container.gap": "--ds-spacing-4",
      "stack.gap": "--ds-spacing-2",
      "icon-size.leading": "--ds-icon-size-medium",
      "icon-size.trailing-and-label": "--ds-icon-size-small",
    },
    typography: {
      "label-and-value": "--ds-font-size-body-medium / --ds-line-height-body-medium",
      "label.weight": "--ds-font-weight-medium",
      "value.weight": "--ds-font-weight-regular",
      "helper-text": "--ds-font-size-body-small / --ds-line-height-body-small",
      family: "--ds-font-family",
    },
    border: {
      radius: "--ds-radius-md",
      width: "1px",
      "focus-ring-width": "3px, outside",
    },
  },

  aiHints: {
    priority: "high",
    keywords: ["input", "text field", "textbox", "form field", "text input", "search field", "label", "validation", "helper text"],
    selectionCriteria: {
      "status.default": "Before validation, or when there is nothing to report.",
      "status.error": "After validation fails. Always set helperText to say what is wrong.",
      "status.success": "Only when a positive validation result is useful (availability, verified).",
      required: "Set for mandatory fields. It shows the asterisk and sets the native required attribute.",
      leadingIcon: "A hint for the content type, such as search or email.",
      trailingIcon: "An action or status glyph. Error and success colors apply automatically.",
    },
    usage: {
      useCases: [
        "Form fields for names, emails and short text",
        "Search box with a leading search icon",
        "Inline validation with error or success feedback",
      ],
      commonPatterns: [
        { name: "Required form field", composition: "InputField[label, required, helperText] stacked 16px apart in a form" },
        { name: "Search", composition: "InputField[leadingIcon=search, placeholder, no label]" },
        {
          name: "Trailing icon action",
          composition: "InputField[trailingIcon=any icon (close, delete, info...), trailingIconLabel=what it does, onTrailingIconClick=the action]. The leading icon is always decorative.",
        },
        {
          name: "Search with clear button",
          composition: "InputField[aria-label=Search, leadingIcon=search, trailingIcon=close, onTrailingIconClick=clear, trailingIconLabel=Clear search, showTrailingIcon only when there is a value]",
        },
        { name: "Validation error", composition: "InputField[status=error, helperText=how to fix, trailingIcon=error]" },
        { name: "Form footer", composition: "InputField(s) above Button[secondary] + Button[primary]" },
      ],
      antiPatterns: [
        {
          scenario: "Placeholder used instead of a label",
          reason: "The placeholder disappears when typing and is not a reliable accessible name.",
          alternative: "Always provide label (or aria-label); use placeholder only as an example value.",
        },
        {
          scenario: "Error shown by color only",
          reason: "Color alone is not accessible, and a red border does not say what is wrong.",
          alternative: "Set status=error together with helperText that explains the fix.",
        },
        {
          scenario: "Multi-line text",
          reason: "InputField is a single-line input.",
          alternative: "Use a textarea component.",
        },
        {
          scenario: "Choosing from a fixed list of options",
          reason: "Free text invites invalid values.",
          alternative: "Use Dropdown, radio buttons or checkboxes.",
        },
      ],
    },
  },
});
