import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent, ReactNode, Ref } from "react";
import { KeyboardArrowDownIcon, KeyboardArrowUpIcon, SearchIcon, SearchOffIcon } from "../../icons";
import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import { InputField } from "../InputField";
import "./Dropdown.tokens.css";

export interface DropdownOptionItem {
  /** Stable identifier. This is what `value` holds. */
  value: string;
  /** Text shown in the menu and, for single select, in the trigger. */
  label: string;
  /** Not selectable and skipped by the keyboard. Maps to the Figma Menu Item `Disabled` state. */
  disabled?: boolean;
  /** Icon before the label. Decorative (aria-hidden). Maps to Figma `Show Leading Icon`. */
  icon?: ReactNode;
}

/** A non-selectable heading that groups the options after it. Maps to the Figma Menu Item `Group heading` type. */
export interface DropdownGroupItem {
  type: "group";
  label: string;
}

export type DropdownOption = DropdownOptionItem | DropdownGroupItem;

const isGroup = (o: DropdownOption): o is DropdownGroupItem => "type" in o && o.type === "group";

interface DropdownBaseProps {
  /** The field label. Maps to the Figma `Label` property. Without it, pass `aria-label`. */
  label?: string;
  /** Shows the mandatory asterisk and marks the field required. Maps to Figma `Is mandatory`. */
  required?: boolean;
  /** Show or hide the label icon. Maps to Figma `Show Label Icon`. */
  showLabelIcon?: boolean;
  /** Icon after the label (e.g. info). Decorative. */
  labelIcon?: ReactNode;
  /** Show or hide the leading icon in the trigger. Maps to Figma `Show Leading Icon`. */
  showLeadingIcon?: boolean;
  /** Icon inside the trigger before the value. Decorative. */
  leadingIcon?: ReactNode;
  /** Hint shown while nothing is selected. Maps to the Figma `Placeholder` property. */
  placeholder?: string;
  /** Show or hide the helper text. Maps to Figma `Show Subtext`. */
  showHelperText?: boolean;
  /** Text below the trigger. Maps to the Figma `Subtext` property. Colored by `status`. */
  helperText?: string;
  /** Validation state. `error` maps to the Figma Error state and sets aria-invalid. */
  status?: "default" | "error";
  /** The options and group headings, in display order. */
  options: DropdownOption[];
  /** Show the search field at the top of the menu. Maps to the Figma Dropdown Menu `Show Search`. */
  showSearch?: boolean;
  /** Placeholder of the search field. */
  searchPlaceholder?: string;
  /** Text shown when the search matches nothing. Maps to the Figma `Empty` state. */
  emptyText?: string;
  /** Where the menu opens. `auto` opens below and flips above when there is no room. */
  menuPlacement?: "auto" | "bottom" | "top";
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Cannot be opened or focused. Maps to the Figma Disabled state. */
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
  /** Class name for the root element. */
  className?: string;
  /** Ref to the trigger input. */
  ref?: Ref<HTMLInputElement>;
}

export interface DropdownSingleProps extends DropdownBaseProps {
  /** Single select (Figma `Selection=Single`). The default. */
  multiple?: false;
  /** Controlled value: the selected option's `value`, or null for none. */
  value?: string | null;
  /** Initial value when uncontrolled. */
  defaultValue?: string | null;
  /** Called with the chosen `value`. */
  onValueChange?: (value: string | null) => void;
}

export interface DropdownMultiProps extends DropdownBaseProps {
  /** Multi select (Figma `Selection=Multi`). Options show a checkbox and the menu stays open. */
  multiple: true;
  /** Controlled values. */
  value?: string[];
  /** Initial values when uncontrolled. */
  defaultValue?: string[];
  /** Called with all selected values. With `showFooter` it only fires when Apply is pressed. */
  onValueChange?: (value: string[]) => void;
  /** Show the Clear and Apply footer. Changes are held until Apply. Maps to Figma `Show Footer`. */
  showFooter?: boolean;
  /** Builds the trigger text for the current count. Defaults to "2 selected". */
  selectedCountText?: (count: number) => string;
}

export type DropdownProps = DropdownSingleProps | DropdownMultiProps;

const MENU_MAX_HEIGHT = 320;

const defaultCountText = (n: number) => `${n} selected`;

function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) (ref as { current: T | null }).current = value;
}

/**
 * A select field with a floating menu. The trigger is an InputField, the menu is a listbox of Menu Items
 * (Checkbox rows for multi select). Figma states map to: Closed / Filled (`value`), Open (`open`),
 * Error (`status`), Disabled (`disabled`).
 */
export function Dropdown(props: DropdownProps) {
  const {
    label,
    required = false,
    showLabelIcon = true,
    labelIcon,
    showLeadingIcon = true,
    leadingIcon,
    placeholder,
    showHelperText = true,
    helperText,
    status = "default",
    options,
    showSearch = true,
    searchPlaceholder = "Search...",
    emptyText = "No results found",
    menuPlacement = "auto",
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    disabled = false,
    id,
    className,
    ref,
    "aria-label": ariaLabel,
  } = props;
  const multiple = props.multiple === true;
  const showFooter = props.multiple === true && Boolean(props.showFooter);
  const countText = (props.multiple === true && props.selectedCountText) || defaultCountText;

  const autoId = useId();
  const baseId = id ?? autoId;
  const listId = `${baseId}-listbox`;
  const optionId = (i: number) => `${baseId}-option-${i}`;

  // ---- open state (controlled or not)
  const [openState, setOpenState] = useState(defaultOpen);
  const open = !disabled && (openProp ?? openState);
  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setOpenState(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  // ---- value state (controlled or not), always held as an array
  const toArray = (v: string | string[] | null | undefined): string[] => (v == null ? [] : Array.isArray(v) ? v : [v]);
  const [valueState, setValueState] = useState<string[]>(() => toArray(props.defaultValue));
  const committed = props.value !== undefined ? toArray(props.value) : valueState;
  // Footer mode edits a draft until Apply
  const [draft, setDraft] = useState<string[]>(committed);
  const selected = showFooter && open ? draft : committed;

  const commit = (next: string[]) => {
    if (props.value === undefined) setValueState(next);
    if (props.multiple === true) props.onValueChange?.(next);
    else (props as DropdownSingleProps).onValueChange?.(next[0] ?? null);
  };

  // ---- search + visible options
  const [query, setQuery] = useState("");
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out: { option: DropdownOption; key: string }[] = [];
    options.forEach((option, i) => {
      if (isGroup(option)) {
        out.push({ option, key: `g${i}` });
        return;
      }
      if (!q || option.label.toLowerCase().includes(q)) out.push({ option, key: `o${i}` });
    });
    // Drop group headings with no visible option after them
    return out.filter((item, i) => {
      if (!isGroup(item.option)) return true;
      const next = out[i + 1];
      return Boolean(next) && !isGroup(next!.option);
    });
  }, [options, query]);

  // Navigable options (skip headings and disabled), as indexes into `visible`
  const navigable = useMemo(
    () => visible.flatMap((item, i) => (!isGroup(item.option) && !item.option.disabled ? [i] : [])),
    [visible],
  );
  const [active, setActive] = useState<number | null>(null);
  // The focus ring on the active option only shows while navigating with the keyboard
  const [keyboard, setKeyboard] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLInputElement | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<"bottom" | "top">("bottom");

  // Reset search and position the active option each time the menu opens
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setDraft(committed);
    const firstSelected = visible.findIndex((v) => !isGroup(v.option) && committed.includes(v.option.value));
    setActive(firstSelected >= 0 && navigable.includes(firstSelected) ? firstSelected : (navigable[0] ?? null));
    if (showSearch) searchRef.current?.focus();
  }, [open]);

  // The active option follows the filter
  useEffect(() => {
    setActive((a) => (a !== null && navigable.includes(a) ? a : (navigable[0] ?? null)));
  }, [navigable]);

  // Flip above the trigger when there is no room below. Re-measured on resize and scroll while open.
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      if (menuPlacement !== "auto") {
        setPlacement(menuPlacement);
        return;
      }
      if (!rootRef.current || !menuRef.current) return;
      const anchor = rootRef.current.getBoundingClientRect();
      const menuHeight = menuRef.current.offsetHeight;
      const below = window.innerHeight - anchor.bottom;
      const above = anchor.top;
      setPlacement(below < menuHeight && above > below ? "top" : "bottom");
    };
    place();
    const frame = requestAnimationFrame(place); // layout may still be settling on the first frame
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, visible.length, menuPlacement]);

  // Close on outside pointer down
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, setOpen]);

  // Keep the active option scrolled into view
  useEffect(() => {
    if (!open || active === null) return;
    document.getElementById(optionId(active))?.scrollIntoView?.({ block: "nearest" });
  }, [active, open]);

  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  };

  const toggleValue = (value: string) => {
    if (multiple) {
      const next = selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value];
      if (showFooter) setDraft(next);
      else commit(next);
    } else {
      commit([value]);
      close(true);
    }
  };

  const choose = (index: number) => {
    const item = visible[index]?.option;
    if (item && !isGroup(item) && !item.disabled) toggleValue(item.value);
  };

  const move = (delta: 1 | -1) => {
    if (navigable.length === 0) return;
    const at = active === null ? -1 : navigable.indexOf(active);
    const next = at === -1 ? (delta === 1 ? 0 : navigable.length - 1) : (at + delta + navigable.length) % navigable.length;
    setActive(navigable[next]!);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key.startsWith("Arrow") || e.key === "Home" || e.key === "End") setKeyboard(true);
    const inSearch = e.target === searchRef.current;
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp":
        e.preventDefault();
        if (!open) setOpen(true);
        else move(e.key === "ArrowDown" ? 1 : -1);
        break;
      case "Home":
      case "End":
        if (open) {
          e.preventDefault();
          if (navigable.length) setActive(navigable[e.key === "Home" ? 0 : navigable.length - 1]!);
        }
        break;
      case "Enter":
        e.preventDefault();
        if (!open) setOpen(true);
        else if (active !== null) choose(active);
        break;
      case " ":
        if (!inSearch) {
          e.preventDefault();
          if (!open) setOpen(true);
          else if (active !== null) choose(active);
        }
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          close(true);
        }
        break;
      case "Tab":
        if (open) setOpen(false);
        break;
      default:
        // Type-ahead when there is no search field
        if (open && !showSearch && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const ch = e.key.toLowerCase();
          const start = active === null ? 0 : navigable.indexOf(active) + 1;
          const order = [...navigable.slice(start), ...navigable.slice(0, start)];
          const hit = order.find((i) => {
            const o = visible[i]!.option;
            return !isGroup(o) && o.label.toLowerCase().startsWith(ch);
          });
          if (hit !== undefined) setActive(hit);
        }
    }
  };

  const onTriggerClick = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const target = e.target as HTMLElement;
    // A click on the label is forwarded to the input by the browser; count that one instead.
    if (!target.closest(".ds-input-field__container")) return;
    setOpen(!open);
  };

  const selectedOptions = options.filter((o): o is DropdownOptionItem => !isGroup(o) && selected.includes(o.value));
  const displayValue = selectedOptions.length === 0 ? "" : multiple ? countText(selectedOptions.length) : selectedOptions[0]!.label;
  const resolvedPlaceholder = placeholder ?? (multiple ? "Select options" : "Select an option");

  return (
    <div
      ref={rootRef}
      className={className ? `ds-dropdown ${className}` : "ds-dropdown"}
      data-open={open ? "" : undefined}
      data-keyboard={keyboard ? "" : undefined}
      data-multiple={multiple ? "" : undefined}
      data-placement={open ? placement : undefined}
      data-disabled={disabled ? "" : undefined}
      onKeyDown={onKeyDown}
    >
      {/* The click handler only widens the hit area to the whole field; the input itself is the keyboard target. */}
      <div className="ds-dropdown__trigger" onClick={onTriggerClick}>
        <InputField
          ref={(node) => {
            triggerRef.current = node;
            setRef(ref, node);
          }}
          id={id}
          label={label}
          required={required}
          showLabelIcon={showLabelIcon}
          labelIcon={labelIcon}
          showLeadingIcon={showLeadingIcon}
          leadingIcon={leadingIcon}
          trailingIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          showHelperText={showHelperText}
          helperText={helperText}
          status={status}
          disabled={disabled}
          placeholder={resolvedPlaceholder}
          readOnly
          value={displayValue}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={open && !showSearch && active !== null ? optionId(active) : undefined}
          aria-label={label ? undefined : props["aria-label"]}
          aria-required={required || undefined}
          autoComplete="off"
        />
      </div>

      {open ? (
        <div className="ds-dropdown__menu" ref={menuRef}>
          {showSearch ? (
            <div className="ds-dropdown__search">
              <InputField
                ref={searchRef}
                type="text"
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder.replace(/\.+$/, "") || "Search"}
                aria-controls={listId}
                aria-activedescendant={active !== null ? optionId(active) : undefined}
                autoComplete="off"
                leadingIcon={<SearchIcon />}
                showTrailingIcon={false}
                showHelperText={false}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          ) : null}

          {navigable.length === 0 && visible.length === 0 ? (
            <div className="ds-dropdown__empty" role="status">
              <SearchOffIcon className="ds-dropdown__empty-icon" aria-hidden="true" />
              <span>{emptyText}</span>
            </div>
          ) : (
            <ul
              id={listId}
              className="ds-dropdown__list"
              role="listbox"
              aria-multiselectable={multiple || undefined}
              aria-label={label ?? props["aria-label"]}
              style={{ maxHeight: MENU_MAX_HEIGHT }}
            >
              {visible.map(({ option, key }, i) =>
                isGroup(option) ? (
                  <li key={key} className="ds-dropdown__group" role="presentation">
                    {option.label}
                  </li>
                ) : (
                  <li
                    key={key}
                    id={optionId(i)}
                    className="ds-dropdown__option"
                    role="option"
                    aria-selected={selected.includes(option.value)}
                    aria-disabled={option.disabled || undefined}
                    data-active={active === i ? "" : undefined}
                    data-selected={selected.includes(option.value) ? "" : undefined}
                    data-disabled={option.disabled ? "" : undefined}
                    onMouseEnter={() => {
                      setKeyboard(false);
                      if (!option.disabled) setActive(i);
                    }}
                    onMouseDown={(e) => e.preventDefault() /* keep focus where it is */}
                    onClick={() => choose(i)}
                  >
                    {multiple ? (
                      <Checkbox
                        className="ds-dropdown__checkbox"
                        checked={selected.includes(option.value)}
                        disabled={option.disabled}
                        readOnly
                        tabIndex={-1}
                        aria-hidden="true"
                        onChange={() => {}}
                      />
                    ) : null}
                    {option.icon ? (
                      <span className="ds-dropdown__option-icon" aria-hidden="true">
                        {option.icon}
                      </span>
                    ) : null}
                    <span className="ds-dropdown__option-label">{option.label}</span>
                  </li>
                ),
              )}
            </ul>
          )}

          {showFooter ? (
            <div className="ds-dropdown__footer">
              <Button variant="tertiary" size="small" onClick={() => setDraft([])}>
                Clear
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={() => {
                  commit(draft);
                  close(true);
                }}
              >
                Apply
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
