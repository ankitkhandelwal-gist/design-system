import { defineMeta } from "../../meta/defineMeta";

export default defineMeta({
  component: {
    name: "Dropdown",
    category: "molecules",
    type: "input",
    description:
      "A select field that opens a floating menu of options. Single select picks one option and shows its name; multi select toggles checkboxes and shows a count such as '2 selected'. The menu has optional search, group headings, an empty state and an optional Clear / Apply footer. Built from InputField (trigger), Checkbox and Button.",
    path: "src/components/Dropdown",
    figma: { nodeId: "1426:626" },
  },

  props: {
    label: { type: "string", description: "The field label. Figma: Label (on the Trigger). Without it, pass aria-label." },
    required: { type: "boolean", default: false, description: "Shows the mandatory asterisk and sets aria-required. Figma: Is mandatory." },
    showLabelIcon: { type: "boolean", default: true, description: "Show or hide the icon next to the label. Figma: Show Label Icon." },
    labelIcon: { type: "ReactNode", description: "Icon after the label (e.g. info). Decorative." },
    showLeadingIcon: { type: "boolean", default: true, description: "Show or hide the leading icon in the trigger. Figma: Show Leading Icon." },
    leadingIcon: { type: "ReactNode", description: "Icon inside the trigger before the value. Decorative." },
    placeholder: {
      type: "string",
      default: "Select an option",
      description: "Hint shown while nothing is selected. Defaults to 'Select options' when multiple. Figma: Placeholder.",
    },
    showHelperText: { type: "boolean", default: true, description: "Show or hide the helper text. Figma: Show Subtext." },
    helperText: { type: "string", description: "Text below the trigger. Figma: Subtext. Colored by status." },
    status: {
      type: '"default" | "error"',
      default: "default",
      description: "Validation state. error maps to the Figma Error state and sets aria-invalid. Always pair it with helperText.",
      values: ["default", "error"],
    },
    options: {
      type: "DropdownOption[]",
      required: true,
      description:
        "Options in display order. { value, label, disabled?, icon? } for an option, { type: 'group', label } for a heading. Figma: the Options slot filled with Menu Items.",
    },
    multiple: { type: "boolean", default: false, description: "Multi select. Options get checkboxes and the menu stays open. Figma: Selection=Multi." },
    value: {
      type: "string | null | string[]",
      description: "Controlled value: one option value (single) or an array (multiple). Any selection is the Figma Filled state.",
    },
    defaultValue: { type: "string | null | string[]", description: "Initial value when uncontrolled." },
    onValueChange: {
      type: "(value: string | null) => void | (value: string[]) => void",
      description: "Called with the chosen value (single) or all chosen values (multiple). With showFooter it fires on Apply only.",
    },
    menuPlacement: {
      type: '"auto" | "bottom" | "top"',
      default: "auto",
      description: "Where the floating menu opens. auto opens below and flips above when there is no room.",
      values: ["auto", "bottom", "top"],
    },
    open: { type: "boolean", description: "Controlled open state. Figma: State=Open." },
    defaultOpen: { type: "boolean", default: false, description: "Initial open state when uncontrolled." },
    onOpenChange: { type: "(open: boolean) => void", description: "Called when the menu opens or closes." },
    showSearch: { type: "boolean", default: true, description: "Show the search field in the menu. Figma: Show Search." },
    searchPlaceholder: { type: "string", default: "Search...", description: "Placeholder of the search field." },
    emptyText: { type: "string", default: "No results found", description: "Shown when the search matches nothing. Figma: State=Empty." },
    showFooter: {
      type: "boolean",
      default: false,
      description: "Multiple only. Shows Clear and Apply; changes are held until Apply. Figma: Show Footer.",
    },
    selectedCountText: {
      type: "(count: number) => string",
      default: "n => `${n} selected`",
      description: "Multiple only. Builds the trigger text for the current count (for localisation).",
    },
    disabled: { type: "boolean", default: false, description: "Cannot be opened or focused. Figma: State=Disabled." },
    id: { type: "string", description: "Id of the trigger input. Generated when omitted." },
    className: { type: "string", description: "Class name for the root element." },
    ref: { type: "Ref<HTMLInputElement>", description: "Ref to the trigger input." },
  },

  variants: {
    axes: {
      selection: ["single", "multi"],
      state: ["closed", "filled", "open", "error", "disabled"],
    },
    purpose: {
      "selection.single": "Pick exactly one option. Choosing closes the menu and the trigger shows the option name.",
      "selection.multi": "Pick any number of options. The menu stays open and the trigger shows a count such as '2 selected'.",
      "state.closed": "Resting state with the placeholder.",
      "state.filled": "A value is chosen: the option name (single) or the count (multi).",
      "state.open": "The floating menu is visible; the field keeps the focus border and the chevron points up.",
      "state.error": "Validation failed. Red field with helper text that says how to fix it.",
      "state.disabled": "Not available. Cannot be opened and is skipped by Tab.",
    },
  },

  relationships: {
    requires: ["InputField", "Checkbox", "Button"],
    commonPartners: ["InputField", "Button", "Tag"],
    triggers: ["onValueChange", "onOpenChange"],
    exposesState: ["value", "open"],
    blocksWhen: [
      { when: "disabled is true", effect: "The menu cannot open, the field is skipped by Tab and the value stays visible at reduced contrast." },
      { when: "an option has disabled: true", effect: "That option cannot be chosen and is skipped by the arrow keys." },
    ],
    role: "combobox (trigger, readonly input) controlling a listbox of options. role=option with aria-selected; aria-multiselectable for multiple.",
    keyboardSupport:
      "Enter, Space or the arrow keys open the menu. Up and Down move between options (skipping disabled ones), Home and End jump to the first and last. Enter or Space picks the active option (Space types in the search field). Escape closes and returns focus to the trigger; Tab closes and moves on. Without a search field, typing a letter jumps to the matching option.",
    screenReader:
      "The trigger is announced as a combobox with its label, required state, expanded state and current value. The active option is exposed with aria-activedescendant, so focus stays on the trigger or search field. Errors set aria-invalid and the helper text is linked with aria-describedby. Checkboxes in multi select are decorative: the option row carries aria-selected.",
  },

  tokens: {
    color: {
      "menu.bg": "--ds-color-background-primary (Figma menu/bg pending)",
      "menu.border": "--ds-color-border-default (Figma menu/menu-border pending)",
      "option.text": "--ds-color-text-primary",
      "option.text-disabled": "--ds-color-text-disabled",
      "option.hover": "--ds-color-background-secondary (Figma menu/item-hover pending)",
      "option.pressed": "--ds-color-background-tertiary (Figma menu/item-pressed pending)",
      "option.selected": "--ds-color-background-brand-subtle (Figma menu/item-selected pending)",
      "group.text": "--ds-color-text-secondary",
      "focus.ring": "--ds-color-border-primary-focus",
      "footer.divider": "--ds-color-divider-default",
      trigger: "InputField tokens (--ds-input-field-*)",
      search: "InputField tokens (--ds-input-field-*)",
    },
    spacing: {
      "menu.offset": "--ds-spacing-2 (4px below the trigger)",
      "menu.padding-and-gap": "--ds-spacing-1 (2px)",
      "option.height": "44px",
      "option.padding": "--ds-spacing-5 vertical, --ds-spacing-4 horizontal",
      "option.gap": "--ds-spacing-4",
      "menu.max-height": "320px, then the list scrolls",
      "footer.padding-and-gap": "--ds-spacing-4",
    },
    typography: {
      option: "--ds-font-size-body-medium / --ds-line-height-body-medium, regular",
      group: "--ds-font-size-body-small / --ds-line-height-body-small, medium",
      family: "--ds-font-family",
    },
    border: {
      "menu.radius": "--ds-radius-md",
      "option.radius": "--ds-radius-sm",
      width: "1px",
    },
    elevation: {
      menu: "--ds-shadow-md",
    },
  },

  aiHints: {
    priority: "high",
    keywords: ["dropdown", "select", "picker", "combobox", "menu", "options", "multi select", "choose from list", "filter"],
    selectionCriteria: {
      "selection.single": "Exactly one answer from a known list of about 5 to 15 options.",
      "selection.multi": "A small set of options can combine, for example filters or tags.",
      showSearch: "Keep on when there are more than about 8 options; turn off for short lists.",
      showFooter: "Multi select where changes should be confirmed (Clear / Apply), for example filters that run a query.",
      status: "Use error after validation fails on a required field, with helperText that says how to fix it.",
    },
    usage: {
      useCases: [
        "Choose a country, role or category",
        "Filter a table by several statuses",
        "Pick an option when space is tight",
      ],
      commonPatterns: [
        { name: "Required single select", composition: "Dropdown[label, required, options, status=error + helperText after failed validation]" },
        { name: "Multi select filter", composition: "Dropdown[multiple, showFooter, options] above a Table" },
        { name: "Grouped options", composition: "Dropdown[options=[{type: 'group', label}, ...options]]" },
        { name: "Form field", composition: "Dropdown next to InputField(s), then Button[primary] at the bottom" },
      ],
      antiPatterns: [
        {
          scenario: "Two to four options",
          reason: "Hiding a short list behind a click makes people work harder.",
          alternative: "Use Radio or Checkbox so every choice stays visible.",
        },
        {
          scenario: "A very long or server-side list",
          reason: "A static menu will not scale and search only filters what is loaded.",
          alternative: "Use an autocomplete input.",
        },
        {
          scenario: "Triggering an action",
          reason: "A dropdown stores a value; it does not run commands.",
          alternative: "Use a Button or an action menu.",
        },
        {
          scenario: "A yes or no choice",
          reason: "A menu for two states is heavy.",
          alternative: "Use Toggle or Checkbox.",
        },
      ],
    },
  },
});
