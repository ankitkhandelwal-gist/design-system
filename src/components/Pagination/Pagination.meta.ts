import { defineMeta } from "../../meta/defineMeta";

export default defineMeta({
  component: {
    name: "Pagination",
    category: "molecules",
    type: "navigation",
    description:
      "Results summary with a results-per-page menu on the left and previous, page numbers and next on the right. Goes under a Table, or any long list split into pages.",
    path: "src/components/Pagination",
    figma: { nodeId: "844:5529" },
  },

  props: {
    total: { type: "number", required: true, description: "Total results across all pages. Figma: Total Count." },
    page: { type: "number", description: "Current page, 1-based. Controlled; pair with onPageChange." },
    defaultPage: { type: "number", default: 1, description: "Starting page when uncontrolled." },
    pageSize: { type: "number", description: "Results per page. Controlled; pair with onPageSizeChange." },
    defaultPageSize: { type: "number", default: "first of pageSizeOptions", description: "Starting page size when uncontrolled." },
    pageSizeOptions: { type: "number[]", default: "[10, 25, 50, 100]", description: "Choices in the results-per-page menu." },
    onPageChange: { type: "(page: number) => void", description: "Called with the new page." },
    onPageSizeChange: { type: "(pageSize: number) => void", description: "Called with the new size. The page resets to 1." },
  },

  variants: {
    axes: {},
    purpose: {},
  },

  relationships: {
    commonPartners: ["Table"],
    triggers: ["onPageChange", "onPageSizeChange"],
    blocksWhen: [
      { when: "on the first page", effect: "Previous is disabled." },
      { when: "on the last page", effect: "Next is disabled." },
    ],
    exposesState: ["page", "pageSize"],
    role: "navigation labelled Pagination. The current page has aria-current=page.",
    keyboardSupport:
      "Tab moves through the size menu, previous, each page and next. Enter or Space on a page button goes to it. The size menu is a native select (arrow keys change it).",
    screenReader:
      "Announced as Pagination navigation. Buttons read Page N, Previous page, Next page; the current page is announced as current. The menu is named Results per page.",
  },

  tokens: {
    color: {
      background: "--ds-color-pagination-bg",
      divider: "--ds-color-pagination-border",
      "text-primary": "--ds-color-pagination-text-primary",
      "text-secondary": "--ds-color-pagination-text-secondary",
      "active.bg": "--ds-color-pagination-active-bg",
      "active.text": "--ds-color-pagination-active-text",
      "hover.bg": "--ds-color-pagination-hover-bg",
      icon: "--ds-color-pagination-primary-icon",
      "icon.disabled": "--ds-color-pagination-disabled-icon",
      "menu.bg": "--ds-color-pagination-dropdown-bg",
      "menu.border": "--ds-color-pagination-dropdown-border",
      "focus-ring": "--ds-color-border-primary-focus (not in Figma)",
    },
    spacing: { "padding-x": "--ds-spacing-6", "pages-gap": "--ds-spacing-2" },
    radius: { page: "--ds-radius-sm", menu: "--ds-radius-sm" },
    typography: { text: "ds-text-body-14-regular", values: "ds-text-body-14-semibold" },
    size: { page: "32px (Figma, no token)", "menu-height": "30px (Figma, no token)", bar: "48px tall including the top divider (Figma, no token)" },
  },

  aiHints: {
    priority: "medium",
    keywords: ["pagination", "pager", "pages", "next page", "previous page", "results per page", "page size", "table footer"],
    selectionCriteria: {},
    usage: {
      useCases: ["Footer of a Table with many rows", "A long list split into pages"],
      commonPatterns: [
        { name: "Table footer", composition: "Table[footer=<Pagination total=... page=... onPageChange=... />]" },
        { name: "Server-side paging", composition: "Pagination[page][pageSize][onPageChange][onPageSizeChange] driving a data fetch" },
      ],
      antiPatterns: [
        {
          scenario: "Using it when all rows fit on one page",
          reason: "It adds controls that do nothing.",
          alternative: "Show the Table without a footer.",
        },
        {
          scenario: "Infinite scroll or load-more lists",
          reason: "Page numbers imply a fixed, countable set.",
          alternative: "Use a Button that loads more.",
        },
      ],
    },
  },
});
