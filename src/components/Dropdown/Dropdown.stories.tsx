import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { InfoIcon, LogoutIcon, PersonIcon, SettingsIcon } from "../../icons";
import { Dropdown, type DropdownOption, type DropdownProps } from "./Dropdown";

/** Stories drive the dropdown through Controls, so they use the single select props. */
type StoryProps = Extract<DropdownProps, { multiple?: false }>;

const cities: DropdownOption[] = [
  { value: "delhi", label: "Delhi" },
  { value: "mumbai", label: "Mumbai" },
  { value: "bengaluru", label: "Bengaluru" },
  { value: "chennai", label: "Chennai" },
  { value: "kolkata", label: "Kolkata" },
];

const sectors: DropdownOption[] = [
  { value: "energy", label: "Energy" },
  { value: "water", label: "Water" },
  { value: "waste", label: "Waste" },
  { value: "transport", label: "Transport" },
  { value: "agriculture", label: "Agriculture" },
];

const description = `
A select field that opens a **floating menu** of options. Single select picks one option and shows its name in the field.
Multi select toggles checkboxes and shows a count such as "2 selected". The trigger is an **InputField**, the options are
Menu Items (with **Checkbox** for multi select) and the optional footer uses **Button**.
Figma: Dropdown set \`1426:626\`, Dropdown Menu \`1426:271\`, Menu Item \`1424:283\`.

### Anatomy
1. **Label** (optional): InputField label with mandatory marker and label icon.
2. **Trigger**: InputField, 320 × 38. Shows the placeholder, the selected name, or the count. The chevron flips up when open.
3. **Menu**: floating overlay, 4 px below the trigger, same width, radius/md, shadow/md.
4. **Search field** (optional): an InputField with a search icon, 38 px high.
5. **Option**: 44 px high Menu Item. Single, Multi (Checkbox) or Group heading.

See the **Anatomy** and **Spacing** stories for the annotated, measured versions.

### Spacing and sizing
| Property | Value | Token |
| --- | --- | --- |
| Trigger height | 38 (62 with label) | |
| Trigger padding | 8 vertical × 12 horizontal | \`--ds-spacing-4\` · \`--ds-spacing-5\` |
| Label to field gap | 4 | \`--ds-spacing-2\` |
| Trigger corner radius | 8 | \`--ds-radius-md\` |
| Menu offset from trigger | 4 below, floating | \`--ds-spacing-2\` |
| Menu width | Matches the trigger | |
| Menu padding · item gap | 2 · 2 | \`--ds-spacing-1\` |
| Menu corner radius | 8 | \`--ds-radius-md\` |
| Menu elevation | Shadow medium | \`--ds-shadow-md\` |
| Menu max height | 320, then the option list scrolls | |
| Search field height | 38 (InputField) | |
| Option height | 44 (12 vertical × 8 horizontal padding) | \`--ds-spacing-5\` · \`--ds-spacing-4\` |
| Option corner radius | 4 | \`--ds-radius-sm\` |

### States
Closed, Filled, Open, Error and Disabled for the trigger. Option rows have Default, Hover, Focused (keyboard), Pressed, Selected and Disabled.
The Figma \`menu/*\` colors are not in the code tokens yet, so the menu aliases the closest semantic tokens for now.

### Behaviour
- **Opening**: click or tap the trigger, or press Enter, Space or the down arrow. Focus moves to the search field, or stays on the trigger when there is no search.
- **Placement**: the menu floats 4 px below the trigger and never pushes other content down. When there is not enough room below it opens above.
- **Single select**: choosing an option sets the value, closes the menu and returns focus to the trigger.
- **Multi select**: the menu stays open while options are toggled and the trigger shows the count. With \`showFooter\`, changes are held until **Apply**; **Clear** empties the draft.
- **Search**: filters as you type, ignoring case, matching anywhere in the label. No match shows the empty state.
- **Scrolling**: the menu grows to 320 px, then the option list scrolls. Search and footer stay pinned.
- **Closing**: Escape, pressing outside, Tab, or choosing an option in single select. Closing without a choice keeps the previous value.
- **Validation**: set \`status="error"\` with \`helperText\` that says how to fix it. Clear it once a value is chosen.

### Keyboard
| Key | Action |
| --- | --- |
| Enter · Space (trigger) | Opens the menu |
| Down · Up arrow (closed) | Opens the menu |
| Down · Up arrow (open) | Moves between options, skipping disabled ones |
| Home · End | First or last option |
| Type a character | Filters (with search) or jumps to the matching option (without) |
| Enter · Space (option) | Single picks and closes, multi toggles. Space types in the search field |
| Escape | Closes and returns focus to the trigger |
| Tab | Closes and moves to the next control |

### Accessibility
The trigger is a \`combobox\` (read-only input) with \`aria-haspopup="listbox"\`, \`aria-expanded\` and \`aria-controls\`. The menu is a \`listbox\`
(\`aria-multiselectable\` for multi select) of \`option\`s with \`aria-selected\`. Focus stays on the trigger or the search field and the active option
is exposed with \`aria-activedescendant\`. Errors set \`aria-invalid\` and the helper text is linked with \`aria-describedby\`.

### Content
- **Label**: one to three words, sentence case, no colon.
- **Placeholder**: starts with "Select": "Select an option" (single), "Select options" (multi).
- **Options**: short, parallel, sentence case, no trailing punctuation.
- **Count**: "N selected". Do not list the values in the trigger.
- **Error**: say how to fix it, for example "Please choose an option".

### Use it when
About 5 to 15 known options, tight space, and one answer (single) or a small set that can combine (multi). Turn on search past about 8 options.
Use Radio or Checkbox for 2 to 4 options, an autocomplete input for very long or server-side lists, and Toggle or Checkbox for yes or no.
`;

const meta = {
  title: "molecules/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: description } } },
  args: {
    label: "City",
    options: cities,
    placeholder: "Select an option",
    required: false,
    showLabelIcon: false,
    showLeadingIcon: false,
    showHelperText: true,
    helperText: "",
    status: "default",
    showSearch: true,
    searchPlaceholder: "Search...",
    emptyText: "No results found",
    disabled: false,
  },
  argTypes: {
    label: { control: "text", description: "Figma: Label" },
    placeholder: { control: "text", description: "Figma: Placeholder" },
    required: { control: "boolean", description: "Figma: Is mandatory" },
    showLabelIcon: { control: "boolean", description: "Figma: Show Label Icon" },
    labelIcon: { table: { disable: true } },
    showLeadingIcon: { control: "boolean", description: "Figma: Show Leading Icon" },
    leadingIcon: { table: { disable: true } },
    showHelperText: { control: "boolean", description: "Figma: Show Subtext" },
    helperText: { control: "text", description: "Figma: Subtext" },
    status: { control: "inline-radio", options: ["default", "error"], description: "Figma: State=Error" },
    options: { control: "object" },
    showSearch: { control: "boolean", description: "Figma: Show Search" },
    searchPlaceholder: { control: "text" },
    emptyText: { control: "text", description: "Figma: State=Empty" },
    disabled: { control: "boolean", description: "Figma: State=Disabled" },
    open: { control: "boolean", description: "Figma: State=Open (controlled)" },
    menuPlacement: { control: "inline-radio", options: ["auto", "bottom", "top"], description: "auto flips above when there is no room below" },
    value: { table: { disable: true } },
    defaultValue: { control: "text", description: "Initial selected value (Figma: State=Filled)" },
    onValueChange: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    defaultOpen: { table: { disable: true } },
    multiple: { table: { disable: true } },
    className: { table: { disable: true } },
    id: { table: { disable: true } },
    ref: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320, minHeight: 380 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<StoryProps>;
export default meta;
type Story = StoryObj<typeof meta>;

const caption: CSSProperties = {
  font: "var(--ds-font-weight-medium) var(--ds-font-size-body-small) var(--ds-font-family)",
  color: "var(--ds-color-text-secondary)",
  marginBottom: 8,
};
const sectionTitle: CSSProperties = {
  font: "var(--ds-font-weight-semibold) var(--ds-font-size-body-large) var(--ds-font-family)",
  color: "var(--ds-color-text-primary)",
  margin: "0 0 16px",
};
const grid: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, 320px)", gap: "32px 48px", alignItems: "start" };
const noop = () => {};

function Case({ name, children, tall }: { name: string; children: ReactNode; tall?: boolean }) {
  return (
    <div style={{ width: 320, minHeight: tall ? 372 : undefined }}>
      <div style={caption}>{name}</div>
      {children}
    </div>
  );
}

/** Live controls, including every show/hide toggle from Figma. Click the field or press Enter, Space or the arrow keys. */
export const Default: Story = {};

/** Pick one option. The menu closes and the field shows the option name. */
export const SingleSelect: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [value, setValue] = useState<string | null>("mumbai");
    return (
      <Dropdown
        label="City"
        required
        options={cities}
        value={value}
        onValueChange={setValue}
        helperText={value ? `Selected: ${value}` : "Choose where you are based"}
      />
    );
  },
};

/** Toggle any number of options. The menu stays open and the field shows the count. */
export const MultiSelect: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [value, setValue] = useState<string[]>(["energy", "water"]);
    return <Dropdown multiple label="Sectors" options={sectors} value={value} onValueChange={setValue} />;
  },
};

/** With `showFooter`, changes are held until Apply. Clear empties the draft. Closing without Apply discards it. */
export const MultiSelectWithFooter: Story = {
  name: "Multi Select With Footer",
  parameters: { controls: { disable: true } },
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <Dropdown multiple showFooter label="Sectors" options={sectors} value={value} onValueChange={setValue} />
        <div style={{ ...caption, marginBottom: 0 }}>Applied: {value.length ? value.join(", ") : "none"}</div>
      </div>
    );
  },
};

/** Every Figma state, for single and multi select. Open is forced with the `open` prop. */
export const DropdownStates: Story = {
  name: "States",
  parameters: { controls: { disable: true }, layout: "padded" },
  decorators: [],
  render: () => (
    <div style={{ display: "grid", gap: 48 }}>
      {(
        [
          ["Single select", false, "mumbai", "Mumbai"],
          ["Multi select", true, ["energy", "water"], "2 selected"],
        ] as const
      ).map(([title, multiple, filled]) => {
        const options = multiple ? sectors : cities;
        const base = { label: "Label", options, multiple, onValueChange: noop, menuPlacement: "bottom" } as DropdownProps;
        return (
          <section key={title}>
            <h3 style={sectionTitle}>{title}</h3>
            <div style={grid}>
              <Case name="Closed"><Dropdown {...base} /></Case>
              <Case name="Filled"><Dropdown {...base} defaultValue={filled as never} /></Case>
              <Case name="Error"><Dropdown {...base} status="error" helperText="Please choose an option" /></Case>
              <Case name="Disabled"><Dropdown {...base} disabled /></Case>
              <Case name="Open" tall><Dropdown {...base} open onOpenChange={noop} menuPlacement="bottom" /></Case>
              <Case name="Open · filled" tall><Dropdown {...base} open onOpenChange={noop} menuPlacement="bottom" defaultValue={filled as never} /></Case>
            </div>
          </section>
        );
      })}
    </div>
  ),
};

/** Group headings, option icons and disabled options. */
export const OptionTypes: Story = {
  parameters: { controls: { disable: true }, layout: "padded" },
  decorators: [],
  render: () => {
    const grouped: DropdownOption[] = [
      { type: "group", label: "North" },
      { value: "delhi", label: "Delhi" },
      { value: "chandigarh", label: "Chandigarh" },
      { type: "group", label: "West" },
      { value: "mumbai", label: "Mumbai" },
      { value: "pune", label: "Pune", disabled: true },
    ];
    const withIcons: DropdownOption[] = [
      { value: "profile", label: "Profile", icon: <PersonIcon /> },
      { value: "settings", label: "Settings", icon: <SettingsIcon /> },
      { value: "signout", label: "Sign out", icon: <LogoutIcon />, disabled: true },
    ];
    return (
      <div style={grid}>
        <Case name="Group headings" tall><Dropdown label="City" options={grouped} open onOpenChange={noop} menuPlacement="bottom" showSearch={false} /></Case>
        <Case name="Option icons" tall><Dropdown label="Account" options={withIcons} open onOpenChange={noop} menuPlacement="bottom" showSearch={false} /></Case>
        <Case name="Label and leading icons" tall>
          <Dropdown label="City" required showLabelIcon labelIcon={<InfoIcon />} showLeadingIcon leadingIcon={<PersonIcon />} options={cities} open onOpenChange={noop} menuPlacement="bottom" showSearch={false} />
        </Case>
      </div>
    );
  },
};

/** Type in the field to filter. No match shows the empty state. */
export const SearchAndEmpty: Story = {
  name: "Search And Empty",
  parameters: { controls: { disable: true }, layout: "padded" },
  decorators: [],
  render: () => (
    <div style={grid}>
      <Case name="Try typing" tall><Dropdown label="City" options={cities} open onOpenChange={noop} menuPlacement="bottom" /></Case>
      <Case name="No results" tall>
        <NoResults />
      </Case>
    </div>
  ),
};

function NoResults() {
  // Type into the search field once on mount so the empty state is visible without interaction
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const type = () => {
      const input = ref.current?.querySelector<HTMLInputElement>(".ds-dropdown__search input");
      if (!input) return;
      const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
      set.call(input, "zzz");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    };
    const t = setTimeout(type, 50); // after the dropdown has reset its search on open
    return () => clearTimeout(t);
  }, []);
  return (
    <div ref={ref}>
      <Dropdown label="City" options={cities} open onOpenChange={noop} menuPlacement="bottom" />
    </div>
  );
}

/** More than 320 px of options: the menu stops growing and the option list scrolls. */
export const LongList: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const many = Array.from({ length: 40 }, (_, i) => ({ value: `o${i}`, label: `Option ${i + 1}` }));
    return <Dropdown label="Option" options={many} open onOpenChange={noop} menuPlacement="bottom" />;
  },
  decorators: [(Story) => <div style={{ width: 320, minHeight: 420 }}><Story /></div>],
};

/** The menu is an overlay: it never pushes the content below it. When there is no room below it opens above. */
export const Floating: Story = {
  parameters: { controls: { disable: true } },
  decorators: [],
  render: () => (
    <div style={{ width: 320 }}>
      <Dropdown label="City" options={cities} defaultOpen />
      <div style={{ marginTop: 16, padding: 16, border: "1px dashed var(--ds-color-border-default)", borderRadius: "var(--ds-radius-md)", color: "var(--ds-color-text-secondary)", font: "var(--ds-font-size-body-medium) var(--ds-font-family)" }}>
        This content sits right under the field. The open menu floats over it instead of moving it down.
      </div>
    </div>
  ),
};

// ---------------------------------------------------------------------------------------------
// Measured diagrams. Positions are read from the rendered DOM, so the numbers always match the code.

type Box = { left: number; top: number; width: number; height: number };

function useBoxes(selectors: Record<string, string>) {
  const wrap = useRef<HTMLDivElement>(null);
  const [boxes, setBoxes] = useState<Record<string, Box>>({});
  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => {
      const base = el.getBoundingClientRect();
      const next: Record<string, Box> = {};
      for (const [key, selector] of Object.entries(selectors)) {
        const node = el.querySelector(selector);
        if (!node) continue;
        const r = node.getBoundingClientRect();
        next[key] = { left: r.left - base.left, top: r.top - base.top, width: r.width, height: r.height };
      }
      setBoxes(next);
    };
    measure();
    const t = setTimeout(measure, 60); // fonts and layout settle
    return () => clearTimeout(t);
  }, []);
  return { wrap, boxes };
}

const STAGE_W = 720;
const DD_LEFT = 200;
const stage: CSSProperties = {
  position: "relative",
  width: STAGE_W,
  height: 470,
  background: "var(--ds-color-background-secondary)",
  border: "1px solid var(--ds-color-border-subtle)",
  borderRadius: "var(--ds-radius-xl)",
};
const abs: CSSProperties = { position: "absolute" };
const line = "var(--ds-color-background-inverse)";

function Badge({ n, left, top }: { n: number; left: number; top: number }) {
  return (
    <span
      style={{
        ...abs, left, top, width: 24, height: 24, borderRadius: 12, background: line, color: "var(--ds-color-text-inverse)",
        display: "grid", placeItems: "center", font: "var(--ds-font-weight-semibold) 12px var(--ds-font-family)",
      }}
    >
      {n}
    </span>
  );
}

function Chip({ children, left, top }: { children: ReactNode; left: number; top: number }) {
  return (
    <span
      style={{
        ...abs, left, top, padding: "1px 6px", borderRadius: 4, background: "var(--ds-color-background-brand)", color: "var(--ds-color-text-inverse)",
        font: "var(--ds-font-weight-semibold) 11px var(--ds-font-family)", whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

const parts = [
  { n: 1, name: "Label", detail: "Optional · InputField label with mandatory marker and label icon", key: "label", side: "left" },
  { n: 2, name: "Trigger", detail: "InputField · 320 × 38 · placeholder, selected name or count · chevron flips when open", key: "trigger", side: "left" },
  { n: 3, name: "Menu", detail: "Floating overlay 4 px below the trigger · radius/md · shadow/md · scrolls after 320 px", key: "menu", side: "left" },
  { n: 4, name: "Search field", detail: "Optional · InputField", key: "search", side: "right" },
  { n: 5, name: "Option", detail: "44 px · Menu Item (Single, Multi with Checkbox, or Group heading)", key: "option", side: "right" },
] as const;

/** The five parts of the dropdown. Positions are measured from the rendered component. */
export const Anatomy: Story = {
  parameters: { controls: { disable: true }, layout: "padded" },
  decorators: [],
  render: () => {
    const { wrap, boxes } = useBoxes({
      label: ".ds-input-field__label-row",
      trigger: ".ds-input-field__container",
      menu: ".ds-dropdown__menu",
      search: ".ds-dropdown__search",
      option: ".ds-dropdown__option",
    });
    return (
      <div>
        <div ref={wrap} style={stage}>
          <div style={{ ...abs, left: DD_LEFT, top: 40, width: 320 }}>
            <Dropdown label="Label" options={cities} open onOpenChange={noop} menuPlacement="bottom" />
          </div>
          {parts.map((p) => {
            const b = boxes[p.key];
            if (!b) return null;
            const y = b.top + b.height / 2;
            const left = p.side === "left";
            const edge = left ? b.left : b.left + b.width;
            const badgeX = left ? DD_LEFT - 96 : DD_LEFT + 320 + 72;
            return (
              <div key={p.n}>
                <span style={{ ...abs, left: left ? badgeX + 24 : edge, top: y - 1, width: left ? edge - badgeX - 24 : badgeX - edge, height: 2, background: line }} />
                <Badge n={p.n} left={badgeX} top={y - 12} />
              </div>
            );
          })}
        </div>
        <ol style={{ margin: "24px 0 0", paddingLeft: 20, color: "var(--ds-color-text-secondary)", font: "var(--ds-font-size-body-medium) var(--ds-font-family)", lineHeight: "28px" }}>
          {parts.map((p) => (
            <li key={p.n}>
              <strong style={{ color: "var(--ds-color-text-primary)" }}>{p.name}</strong>. {p.detail}
            </li>
          ))}
        </ol>
      </div>
    );
  },
};

const specRows: [string, string, string][] = [
  ["Trigger height", "38 (62 with label)", ""],
  ["Trigger padding", "8 vertical × 12 horizontal", "spacing-4 · spacing-5"],
  ["Trigger inner gap", "8", "spacing-4"],
  ["Label to field gap", "4", "spacing-2"],
  ["Trigger corner radius", "8", "radius-md"],
  ["Menu offset from trigger", "4 below, floating", "spacing-2"],
  ["Menu width", "Matches the trigger (320 default)", ""],
  ["Menu padding · item gap", "2 · 2", "spacing-1"],
  ["Menu corner radius", "8", "radius-md"],
  ["Menu elevation", "Shadow medium", "shadow-md"],
  ["Menu max height", "320, then the option list scrolls", ""],
  ["Search field height", "38 (InputField)", ""],
  ["Option height", "44 (12 vertical × 8 horizontal padding)", "spacing-5 · spacing-4"],
  ["Option corner radius", "4", "radius-sm"],
];

/** Measurements read from the rendered component, plus the full spec table. */
export const Spacing: Story = {
  parameters: { controls: { disable: true }, layout: "padded" },
  decorators: [],
  render: () => {
    const { wrap, boxes } = useBoxes({
      label: ".ds-input-field__label-row",
      trigger: ".ds-input-field__container",
      menu: ".ds-dropdown__menu",
      search: ".ds-dropdown__search",
      option: ".ds-dropdown__option",
    });
    const n = (v: number) => String(Math.round(v * 10) / 10);
    const { label, trigger, menu, search, option } = boxes;
    const band = "color-mix(in srgb, var(--ds-color-background-brand) 30%, transparent)";
    const ready = label && trigger && menu && search && option;
    const rx = DD_LEFT + 320 + 24;
    return (
      <div style={{ display: "grid", gap: 32 }}>
        <div ref={wrap} style={stage}>
          <div style={{ ...abs, left: DD_LEFT, top: 40, width: 320 }}>
            <Dropdown label="Label" options={cities} open onOpenChange={noop} menuPlacement="bottom" />
          </div>
          {ready ? (
            <>
              {/* gaps as bands */}
              <span style={{ ...abs, left: DD_LEFT, top: label.top + label.height, width: 320, height: trigger.top - (label.top + label.height), background: band }} />
              <Chip left={DD_LEFT - 40} top={label.top + label.height - 6}>{n(trigger.top - (label.top + label.height))}</Chip>
              <span style={{ ...abs, left: DD_LEFT, top: trigger.top + trigger.height, width: 320, height: menu.top - (trigger.top + trigger.height), background: band }} />
              <Chip left={DD_LEFT - 40} top={trigger.top + trigger.height - 6}>{n(menu.top - (trigger.top + trigger.height))}</Chip>
              {/* heights as brackets on the right */}
              {([
                [trigger, "Trigger"],
                [search, "Search"],
                [option, "Option"],
              ] as const).map(([b, name]) => (
                <div key={name}>
                  <span style={{ ...abs, left: rx, top: b.top, width: 2, height: b.height, background: line }} />
                  <Chip left={rx + 10} top={b.top + b.height / 2 - 9}>{`${n(b.height)} · ${name}`}</Chip>
                </div>
              ))}
              {/* width on top */}
              <span style={{ ...abs, left: DD_LEFT, top: 24, width: 320, height: 2, background: line }} />
              <Chip left={DD_LEFT + 140} top={4}>{n(menu.width)}</Chip>
              {/* menu overall height on the left */}
              <span style={{ ...abs, left: DD_LEFT - 16, top: menu.top, width: 2, height: menu.height, background: line }} />
              <Chip left={DD_LEFT - 52} top={menu.top + menu.height / 2 - 9}>{n(menu.height)}</Chip>
            </>
          ) : null}
        </div>

        <table style={{ borderCollapse: "collapse", width: STAGE_W, font: "var(--ds-font-size-body-medium) var(--ds-font-family)", color: "var(--ds-color-text-primary)" }}>
          <thead>
            <tr style={{ textAlign: "left", background: "var(--ds-color-table-header-bg)" }}>
              {["Property", "Value", "Token"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", font: "var(--ds-font-weight-semibold) var(--ds-font-size-body-small) var(--ds-font-family)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specRows.map(([prop, value, token]) => (
              <tr key={prop} style={{ borderTop: "1px solid var(--ds-color-divider-default)" }}>
                <td style={{ padding: "12px 16px", fontWeight: 500 }}>{prop}</td>
                <td style={{ padding: "12px 16px", color: "var(--ds-color-text-secondary)" }}>{value}</td>
                <td style={{ padding: "12px 16px", color: "var(--ds-color-text-secondary)", fontFamily: "monospace", fontSize: 13 }}>{token}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
};
