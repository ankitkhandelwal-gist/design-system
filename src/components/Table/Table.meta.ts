import { defineMeta } from "../../meta/defineMeta";

export default defineMeta({
  component: {
    name: "Table",
    category: "organisms",
    type: "container",
    description:
      "A data table with an outer border, rounded corners and clipping. A real HTML table with a header, body rows, an empty state and an optional footer, in three densities.",
    path: "src/components/Table",
    figma: { nodeId: "1342:2333" },
  },

  props: {
    header: { type: "ReactNode", description: "The header: one Row of Cells. Rendered in <thead>. Figma: Header slot." },
    children: { type: "ReactNode", description: "Body rows: Row elements. Rendered in <tbody>. Figma: Rows slot." },
    empty: { type: "ReactNode", description: "Shown under the header instead of rows when there are none (e.g. an empty state)." },
    footer: {
      type: "ReactNode",
      description: "Optional footer below the rows, e.g. pagination. Keeps the divider above it. Figma: Footer slot.",
    },
    size: {
      type: '"compact" | "default" | "comfortable"',
      default: "default",
      description: "Density for every cell: 37, 45 or 53px rows. Figma: Cell Size.",
      values: ["compact", "default", "comfortable"],
    },
    "aria-label": { type: "string", description: "Accessible name for the table. Provide one (or aria-labelledby)." },
  },

  variants: {
    axes: {
      size: ["compact", "default", "comfortable"],
    },
    purpose: {
      "size.compact": "Dense data and long lists. 37px rows.",
      "size.default": "Standard tables. 45px rows.",
      "size.comfortable": "Spacious or touch-friendly tables. 53px rows.",
    },
  },

  relationships: {
    mustBeParentOf: ["Row"],
    requires: ["Row", "Cell"],
    commonPartners: ["Pagination", "InputField", "Button", "Checkbox", "Tag"],
    optionalSibling: ["Pagination"],
    role: "table, with row, columnheader and cell roles from its parts. Name it with aria-label.",
    keyboardSupport:
      "The table itself is not focusable. Focus moves through the interactive controls inside it (sort buttons, checkboxes, clickable rows) in reading order.",
    screenReader:
      "Announced as a table with row and column counts. Header cells are column headers, so each data cell is read with its column.",
  },

  tokens: {
    color: {
      border: "--ds-color-table-border-default",
      bg: "--ds-color-table-row-bg",
    },
    border: { radius: "--ds-radius-md", width: "1px, inside the container" },
  },

  aiHints: {
    priority: "high",
    keywords: ["table", "data table", "grid", "list", "rows and columns", "report", "records", "sortable table", "datagrid"],
    selectionCriteria: {
      size: "compact for many rows, default for most tables, comfortable for touch or sparse data.",
      footer: "Add a footer when there is pagination or a summary.",
      empty: "Always provide an empty state when the table can have no rows.",
    },
    usage: {
      useCases: [
        "Lists of records with several attributes each",
        "Comparing values across rows and columns",
        "Sortable, selectable and expandable data",
      ],
      commonPatterns: [
        {
          name: "Basic table",
          composition: "Table[aria-label, header=<Row>Cell...</Row>] > Row > Cell (same cell count per row)",
        },
        { name: "Selectable table", composition: "First column: Cell[width=40] with a Checkbox; Row[selected] for chosen rows" },
        { name: "Paged table", composition: "Table[footer=<Pagination />]" },
        { name: "Expandable rows", composition: "Row with an expand button in the first Cell, followed by a Row whose single Cell spans all columns (colSpan)" },
      ],
      antiPatterns: [
        {
          scenario: "Using a table for page layout",
          reason: "Screen readers announce tables as data, which confuses layout.",
          alternative: "Use layout elements (flex, grid).",
        },
        {
          scenario: "No accessible name",
          reason: "Screen reader users cannot tell what the table shows.",
          alternative: "Set aria-label (or aria-labelledby).",
        },
        {
          scenario: "Dozens of columns on a narrow screen",
          reason: "The table overflows and is hard to read.",
          alternative: "Show fewer columns, or put the table in a horizontally scrolling container.",
        },
      ],
    },
  },
});
