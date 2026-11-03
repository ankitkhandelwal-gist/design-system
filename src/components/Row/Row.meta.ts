import { defineMeta } from "../../meta/defineMeta";

export default defineMeta({
  component: {
    name: "Row",
    category: "molecules",
    type: "container",
    description:
      "A table row (<tr>) that holds Cells. Draws hover, selected, focused and disabled for the whole row, and can be made clickable.",
    path: "src/components/Row",
    figma: { nodeId: "1390:4250" },
  },

  props: {
    children: { type: "ReactNode", description: "The row's Cells. Any number; there is no column limit. Figma: the Cells slot." },
    selected: {
      type: "boolean",
      default: false,
      description: "Marks the row as selected (tint and aria-selected). Figma: Selected state.",
    },
    disabled: { type: "boolean", default: false, description: "Fades the row and marks it unavailable. Figma: Disabled state." },
    onClick: {
      type: "(event) => void",
      description:
        "Makes the whole row clickable and focusable; Enter and Space activate it. Clicks on links, buttons and inputs inside the row do not trigger it.",
    },
  },

  variants: {
    axes: {
      state: ["default", "selected", "disabled"],
    },
    purpose: {
      "state.default": "A normal row. It tints on hover (body rows) and shows a ring when clickable and focused.",
      "state.selected": "The row is selected, e.g. by a checkbox in its first cell.",
      "state.disabled": "The row exists but cannot be used. Content fades.",
    },
  },

  relationships: {
    mustBeChildOf: ["Table"],
    mustBeParentOf: ["Cell"],
    commonPartners: ["Checkbox", "Tag", "Button"],
    triggers: ["onClick"],
    blocksWhen: [{ when: "disabled is true", effect: "The row fades, is not clickable and shows no hover tint." }],
    exposesState: ["selected"],
    role: "row. Selected rows set aria-selected; disabled rows set aria-disabled.",
    keyboardSupport:
      "A clickable row is focusable with Tab, shows a focus ring, and Enter or Space activates it. Controls inside the row keep their own keyboard behavior.",
    screenReader: "Announced as a row with its cells. aria-selected and aria-disabled report its state.",
  },

  tokens: {
    color: {
      "hover.bg": "--ds-color-table-row-hover",
      "selected.bg": "--ds-color-table-row-selected",
      "disabled.bg": "--ds-color-table-row-bg",
      "focus-ring": "--ds-color-border-primary-focus (not in Figma)",
    },
    border: { "focus-ring-width": "2px, inside" },
    motion: { opacity: "disabled: 0.6 on the cell content (Figma, no token)" },
  },

  aiHints: {
    priority: "medium",
    keywords: ["row", "table row", "tr", "selected row", "hover row", "clickable row", "list item"],
    selectionCriteria: {
      selected: "Rows chosen by the user, usually with a checkbox in the first cell.",
      onClick: "Only when the whole row does something (opens a detail view). Not for rows that just show data.",
      disabled: "Rows that exist but cannot be acted on.",
    },
    usage: {
      useCases: ["A row of data in a Table", "The header row of a Table", "A row that opens a detail panel when clicked"],
      commonPatterns: [
        { name: "Header row", composition: "Table[header=<Row><Cell>...</Cell></Row>]" },
        { name: "Selectable rows", composition: "Row[selected] with a Checkbox in the first Cell" },
        { name: "Clickable row", composition: "Row[onClick] containing Cells (no nested clickable controls needed)" },
      ],
      antiPatterns: [
        {
          scenario: "Adding onClick to a row that only displays data",
          reason: "A pointer cursor and focus stop imply an action that does not exist.",
          alternative: "Leave onClick off; the row still tints on hover.",
        },
        {
          scenario: "Using Row outside a Table",
          reason: "It renders <tr>, which is only valid inside a table.",
          alternative: "Use Table, or layout elements for a non-table list.",
        },
        {
          scenario: "Different numbers of cells per row",
          reason: "Columns stop lining up.",
          alternative: "Give every row the same cells, or use colSpan on a Cell deliberately.",
        },
      ],
    },
  },
});
