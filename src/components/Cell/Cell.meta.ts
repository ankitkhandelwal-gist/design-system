import { defineMeta } from "../../meta/defineMeta";

export default defineMeta({
  component: {
    name: "Cell",
    category: "atoms",
    type: "display",
    description:
      "One cell of a table: a column header (<th>) in the Table header or a data cell (<td>) in the body. Text or any custom content, left, center or right aligned, optional sort icon, info icon and trailing icon.",
    path: "src/components/Cell",
    figma: { nodeId: "646:407" },
  },

  props: {
    children: {
      type: "ReactNode",
      description:
        "Cell content. Plain text wraps to two lines then truncates with an ellipsis. Any other content (a Tag, an icon with text, a value over a change) is a custom slot. Figma: Cell Text or Slot.",
    },
    align: {
      type: '"left" | "center" | "right"',
      default: "left",
      description: "Horizontal alignment. Right-align numbers. Figma: Align.",
      values: ["left", "center", "right"],
    },
    size: {
      type: '"compact" | "default" | "comfortable"',
      description: "Overrides the density the Table sets for all cells. Figma: Size.",
      values: ["compact", "default", "comfortable"],
    },
    sort: {
      type: '"none" | "sortable" | "ascending" | "descending"',
      default: "none",
      description: "Header only. Shows the sort icon and sets aria-sort. Figma: Sort.",
      values: ["none", "sortable", "ascending", "descending"],
    },
    onSort: { type: "() => void", description: "Header only. Makes the label a button that calls this when clicked. Use with sort." },
    info: { type: "boolean", default: false, description: "Shows an info icon after the label. Decorative. Figma: Info Icon." },
    trailingIcon: { type: "ReactNode", description: "Icon at the end of the cell. Decorative. Figma: Trailing Icon." },
    width: { type: "number | string", description: "Column width. Set on the header cell; the column follows." },
  },

  variants: {
    axes: {
      align: ["left", "center", "right"],
      size: ["compact", "default", "comfortable"],
      sort: ["none", "sortable", "ascending", "descending"],
    },
    purpose: {
      "align.left": "Text and identifiers (the default).",
      "align.center": "Short values such as scores, tags and status badges.",
      "align.right": "Numbers and amounts, so digits line up.",
      "size.compact": "Dense data. 37px row height.",
      "size.default": "Standard tables. 45px row height.",
      "size.comfortable": "Spacious or touch-friendly tables. 53px row height.",
      "sort.none": "Not sortable: no sort icon.",
      "sort.sortable": "Sortable but not currently sorted: up/down icon.",
      "sort.ascending": "Currently sorted ascending (A to Z, small to large).",
      "sort.descending": "Currently sorted descending (Z to A, large to small).",
    },
  },

  relationships: {
    mustBeChildOf: ["Row"],
    commonPartners: ["Tag", "Checkbox", "Button", "Toggle"],
    triggers: ["onSort"],
    exposesState: ["sort"],
    role: "columnheader (<th scope=col>) in the header, cell (<td>) in the body. Sorted columns set aria-sort.",
    keyboardSupport:
      "Plain cells are not focusable. A sortable header's label is a button: Tab focuses it, Enter or Space sorts.",
    screenReader:
      "Announced with its column header. aria-sort tells whether a column is sorted ascending, descending, or sortable. Icons are aria-hidden, so never rely on the icon or color alone for meaning.",
  },

  tokens: {
    color: {
      "body.bg": "--ds-color-table-row-bg",
      "body.text": "--ds-color-table-content-text",
      "header.bg": "--ds-color-table-header-bg",
      "header.text": "--ds-color-table-header-text",
      "header.bg-hover": "--ds-color-table-header-hover",
      border: "--ds-color-table-border-default",
      "icon.default": "--ds-color-icon-secondary",
      "icon.sorted": "--ds-color-icon-primary",
      "focus-ring": "--ds-color-border-primary-focus (not in Figma)",
    },
    spacing: {
      "padding-x": "--ds-spacing-5",
      "padding-y.compact": "--ds-spacing-4",
      "padding-y.default": "--ds-spacing-5",
      "padding-y.comfortable": "--ds-spacing-6",
      gap: "--ds-spacing-2",
      "icon-size": "--ds-icon-size-small",
    },
    typography: {
      body: "--ds-font-size-body-medium / --ds-line-height-body-medium, weight regular",
      header: "--ds-font-size-body-small / --ds-line-height-body-small, weight bold",
      family: "--ds-font-family",
    },
  },

  aiHints: {
    priority: "medium",
    keywords: ["cell", "table cell", "column header", "td", "th", "sort", "data cell", "grid cell"],
    selectionCriteria: {
      "align.right": "Numbers, amounts, percentages.",
      "align.center": "Scores, badges, short status.",
      "sort.sortable": "A column the user can sort. Pair with onSort.",
      info: "A column header that needs a short explanation (tooltip trigger in your app).",
      width: "Set on the header cell to size a column (a narrow expand or checkbox column, a wide text column).",
    },
    usage: {
      useCases: [
        "Column headers and data cells in a Table",
        "A cell showing a value with its change (custom content)",
        "A cell holding a Tag, a checkbox or an action button",
      ],
      commonPatterns: [
        { name: "Numeric column", composition: "Cell[align=right] for header and values" },
        { name: "Sortable header", composition: "Cell[sort=ascending|descending|sortable, onSort] in the header Row" },
        { name: "Status column", composition: "Cell containing a Tag" },
        { name: "Selection column", composition: "Cell[width=40] containing a Checkbox with an aria-label" },
      ],
      antiPatterns: [
        {
          scenario: "Using a Cell outside a Table and Row",
          reason: "It renders <td>/<th>, which are only valid inside a table row.",
          alternative: "Use Table and Row, or plain layout elements.",
        },
        {
          scenario: "Putting long paragraphs in a cell",
          reason: "Plain text truncates after two lines.",
          alternative: "Show a short summary and link to details.",
        },
        {
          scenario: "Showing sort icons on columns that cannot be sorted",
          reason: "The icon promises behavior that does not exist.",
          alternative: "Leave sort as none.",
        },
      ],
    },
  },
});
