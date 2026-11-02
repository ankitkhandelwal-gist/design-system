import "../../tokens/index.css";
import { createRef, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { Dropdown, type DropdownOption } from "./Dropdown";
import meta from "./Dropdown.meta";

afterEach(cleanup);

const cities: DropdownOption[] = [
  { value: "delhi", label: "Delhi" },
  { value: "mumbai", label: "Mumbai" },
  { value: "pune", label: "Pune", disabled: true },
  { value: "chennai", label: "Chennai" },
];
const trigger = () => screen.getByRole("combobox") as HTMLInputElement;
const root = () => document.querySelector(".ds-dropdown") as HTMLElement;
const menu = () => document.querySelector(".ds-dropdown__menu") as HTMLElement;
const open = () => fireEvent.click(trigger());
const optionNamed = (name: string) => screen.getByRole("option", { name });

describe("Dropdown", () => {
  it("is a collapsed combobox named by its label", () => {
    render(<Dropdown label="City" options={cities} />);
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
    expect(trigger().getAttribute("aria-haspopup")).toBe("listbox");
    expect(screen.getByLabelText("City")).toBe(trigger());
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("opens a listbox when the trigger is clicked and wires aria-controls", () => {
    render(<Dropdown label="City" options={cities} />);
    open();
    const list = screen.getByRole("listbox");
    expect(trigger().getAttribute("aria-expanded")).toBe("true");
    expect(trigger().getAttribute("aria-controls")).toBe(list.id);
    expect(screen.getAllByRole("option")).toHaveLength(4);
  });

  it("opens when the label or the chevron area is used, without double toggling", () => {
    render(<Dropdown label="City" options={cities} />);
    fireEvent.click(screen.getByText("City"));
    // A label click is forwarded by the browser to the input, which opens it once
    expect(trigger().getAttribute("aria-expanded")).toBe("true");
  });

  it("single select: choosing an option fills the trigger, closes and reports the value", () => {
    const onValueChange = vi.fn();
    render(<Dropdown label="City" options={cities} onValueChange={onValueChange} />);
    open();
    fireEvent.click(optionNamed("Mumbai"));
    expect(onValueChange).toHaveBeenCalledWith("mumbai");
    expect(trigger().value).toBe("Mumbai");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it("shows the placeholder until something is selected", () => {
    const { rerender } = render(<Dropdown label="City" options={cities} />);
    expect(trigger().placeholder).toBe("Select an option");
    rerender(<Dropdown label="City" options={cities} multiple />);
    expect(trigger().placeholder).toBe("Select options");
  });

  it("marks the selected option and shows the selected name when filled", () => {
    render(<Dropdown label="City" options={cities} defaultValue="delhi" />);
    expect(trigger().value).toBe("Delhi");
    open();
    expect(optionNamed("Delhi").getAttribute("aria-selected")).toBe("true");
    expect(optionNamed("Mumbai").getAttribute("aria-selected")).toBe("false");
  });

  it("multi select: stays open, shows the count and reports every value", () => {
    const onValueChange = vi.fn();
    render(<Dropdown label="City" options={cities} multiple onValueChange={onValueChange} />);
    open();
    expect(screen.getByRole("listbox").getAttribute("aria-multiselectable")).toBe("true");
    fireEvent.click(optionNamed("Delhi"));
    fireEvent.click(optionNamed("Mumbai"));
    expect(onValueChange).toHaveBeenLastCalledWith(["delhi", "mumbai"]);
    expect(trigger().value).toBe("2 selected");
    expect(screen.getByRole("listbox")).toBeTruthy();
    fireEvent.click(optionNamed("Delhi"));
    expect(trigger().value).toBe("1 selected");
  });

  it("multi select options draw a checkbox that follows the selection", () => {
    render(<Dropdown label="City" options={cities} multiple defaultValue={["delhi"]} />);
    open();
    const boxes = [...document.querySelectorAll<HTMLInputElement>(".ds-dropdown__option input[type=checkbox]")];
    expect(boxes.map((b) => b.checked)).toEqual([true, false, false, false]);
  });

  it("supports a custom count text", () => {
    render(<Dropdown label="City" options={cities} multiple defaultValue={["delhi", "mumbai"]} selectedCountText={(n) => `${n} cities`} />);
    expect(trigger().value).toBe("2 cities");
  });

  it("multi select with a footer holds changes until Apply", () => {
    const onValueChange = vi.fn();
    render(<Dropdown label="City" options={cities} multiple showFooter onValueChange={onValueChange} />);
    open();
    fireEvent.click(optionNamed("Delhi"));
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Apply" }));
    expect(onValueChange).toHaveBeenCalledWith(["delhi"]);
    expect(trigger().value).toBe("1 selected");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("footer Clear empties the draft, and closing without Apply discards changes", () => {
    const onValueChange = vi.fn();
    render(<Dropdown label="City" options={cities} multiple showFooter defaultValue={["delhi"]} onValueChange={onValueChange} />);
    open();
    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.getAllByRole("option").every((o) => o.getAttribute("aria-selected") === "false")).toBe(true);
    fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    expect(onValueChange).not.toHaveBeenCalled();
    expect(trigger().value).toBe("1 selected");
  });

  it("works controlled", () => {
    function Controlled() {
      const [v, setV] = useState<string | null>("pune");
      return <Dropdown label="City" options={cities} value={v} onValueChange={setV} />;
    }
    render(<Controlled />);
    expect(trigger().value).toBe("Pune");
    open();
    fireEvent.click(optionNamed("Chennai"));
    expect(trigger().value).toBe("Chennai");
  });

  it("filters with the search field and shows the empty state when nothing matches", () => {
    render(<Dropdown label="City" options={cities} />);
    open();
    const search = screen.getByRole("textbox", { name: "Search" });
    expect(document.activeElement).toBe(search);
    fireEvent.change(search, { target: { value: "ch" } });
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Chennai"]);
    fireEvent.change(search, { target: { value: "zzz" } });
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(screen.getByText("No results found")).toBeTruthy();
  });

  it("hides the search field with showSearch={false}", () => {
    render(<Dropdown label="City" options={cities} showSearch={false} />);
    open();
    expect(screen.queryByRole("textbox")).toBeNull();
  });

  it("renders group headings and drops a heading whose options are filtered out", () => {
    const grouped: DropdownOption[] = [
      { type: "group", label: "North" },
      { value: "delhi", label: "Delhi" },
      { type: "group", label: "West" },
      { value: "mumbai", label: "Mumbai" },
    ];
    render(<Dropdown label="City" options={grouped} />);
    open();
    expect(screen.getByText("North")).toBeTruthy();
    expect(screen.getByText("West")).toBeTruthy();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "mum" } });
    expect(screen.queryByText("North")).toBeNull();
    expect(screen.getByText("West")).toBeTruthy();
  });

  it("does not select disabled options", () => {
    const onValueChange = vi.fn();
    render(<Dropdown label="City" options={cities} onValueChange={onValueChange} />);
    open();
    const pune = optionNamed("Pune");
    expect(pune.getAttribute("aria-disabled")).toBe("true");
    fireEvent.click(pune);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("listbox")).toBeTruthy();
  });

  describe("keyboard", () => {
    const active = () => document.querySelector(".ds-dropdown__option[data-active]")?.textContent;

    it("opens with Enter, Space and the arrow keys", () => {
      render(<Dropdown label="City" options={cities} />);
      for (const key of ["Enter", " ", "ArrowDown", "ArrowUp"]) {
        fireEvent.keyDown(trigger(), { key });
        expect(trigger().getAttribute("aria-expanded")).toBe("true");
        fireEvent.keyDown(document.activeElement!, { key: "Escape" });
        expect(trigger().getAttribute("aria-expanded")).toBe("false");
      }
    });

    it("moves between options with arrows, skips disabled ones, wraps and jumps with Home and End", () => {
      render(<Dropdown label="City" options={cities} />);
      fireEvent.keyDown(trigger(), { key: "ArrowDown" });
      const focus = document.activeElement!;
      expect(active()).toBe("Delhi");
      fireEvent.keyDown(focus, { key: "ArrowDown" });
      expect(active()).toBe("Mumbai");
      fireEvent.keyDown(focus, { key: "ArrowDown" });
      expect(active()).toBe("Chennai"); // Pune is disabled
      fireEvent.keyDown(focus, { key: "ArrowDown" });
      expect(active()).toBe("Delhi"); // wraps
      fireEvent.keyDown(focus, { key: "End" });
      expect(active()).toBe("Chennai");
      fireEvent.keyDown(focus, { key: "Home" });
      expect(active()).toBe("Delhi");
    });

    it("announces the active option with aria-activedescendant", () => {
      render(<Dropdown label="City" options={cities} showSearch={false} />);
      fireEvent.keyDown(trigger(), { key: "ArrowDown" });
      fireEvent.keyDown(trigger(), { key: "ArrowDown" });
      const id = trigger().getAttribute("aria-activedescendant")!;
      expect(document.getElementById(id)?.textContent).toBe("Mumbai");
    });

    it("selects the active option with Enter and returns focus to the trigger", () => {
      const onValueChange = vi.fn();
      render(<Dropdown label="City" options={cities} onValueChange={onValueChange} />);
      fireEvent.keyDown(trigger(), { key: "ArrowDown" });
      fireEvent.keyDown(document.activeElement!, { key: "ArrowDown" });
      fireEvent.keyDown(document.activeElement!, { key: "Enter" });
      expect(onValueChange).toHaveBeenCalledWith("mumbai");
      expect(document.activeElement).toBe(trigger());
    });

    it("closes with Escape (focus back on the trigger) and with Tab", () => {
      render(<Dropdown label="City" options={cities} />);
      open();
      fireEvent.keyDown(document.activeElement!, { key: "Escape" });
      expect(screen.queryByRole("listbox")).toBeNull();
      expect(document.activeElement).toBe(trigger());
      open();
      fireEvent.keyDown(document.activeElement!, { key: "Tab" });
      expect(screen.queryByRole("listbox")).toBeNull();
    });

    it("types ahead to an option when there is no search field", () => {
      render(<Dropdown label="City" options={cities} showSearch={false} />);
      fireEvent.keyDown(trigger(), { key: "ArrowDown" });
      fireEvent.keyDown(trigger(), { key: "m" });
      expect(active()).toBe("Mumbai");
    });

    it("lets Space type in the search field instead of selecting", () => {
      const onValueChange = vi.fn();
      render(<Dropdown label="City" options={cities} onValueChange={onValueChange} />);
      open();
      fireEvent.keyDown(screen.getByRole("textbox"), { key: " " });
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  it("closes when pressing outside", () => {
    render(
      <div>
        <Dropdown label="City" options={cities} />
        <button>outside</button>
      </div>,
    );
    open();
    fireEvent.pointerDown(screen.getByText("outside"));
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("supports a controlled open state", () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(<Dropdown label="City" options={cities} open={false} onOpenChange={onOpenChange} />);
    open();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("listbox")).toBeNull();
    rerender(<Dropdown label="City" options={cities} open onOpenChange={onOpenChange} />);
    expect(screen.getByRole("listbox")).toBeTruthy();
  });

  it("floats: the open menu is absolutely positioned and adds no height to the field", () => {
    render(<Dropdown label="City" options={cities} />);
    const closedHeight = root().offsetHeight;
    open();
    expect(getComputedStyle(menu()).position).toBe("absolute");
    expect(root().offsetHeight).toBe(closedHeight);
    // 4px (spacing-2) below the field, same width
    const field = root().getBoundingClientRect();
    const m = menu().getBoundingClientRect();
    expect(Math.round(m.top - field.bottom)).toBe(4);
    expect(Math.round(m.width)).toBe(Math.round(field.width));
  });

  it("caps the option list at 320px and scrolls", () => {
    const many = Array.from({ length: 30 }, (_, i) => ({ value: `o${i}`, label: `Option ${i}` }));
    render(<Dropdown label="City" options={many} />);
    open();
    const list = screen.getByRole("listbox");
    expect(list.getBoundingClientRect().height).toBeLessThanOrEqual(320);
    expect(list.scrollHeight).toBeGreaterThan(list.clientHeight);
  });

  it("uses the 44px option height and 8px radius menu from the spec", () => {
    render(<Dropdown label="City" options={cities} />);
    open();
    expect(Math.round(optionNamed("Delhi").getBoundingClientRect().height)).toBe(44);
    expect(getComputedStyle(menu()).borderRadius).toBe("8px");
  });

  it("flips above the field when there is no room below", () => {
    render(
      <div style={{ height: "100vh", display: "flex", alignItems: "flex-end" }}>
        <Dropdown label="City" options={cities} />
      </div>,
    );
    open();
    expect(root().getAttribute("data-placement")).toBe("top");
    expect(menu().getBoundingClientRect().bottom).toBeLessThanOrEqual(root().getBoundingClientRect().top);
  });

  it("honours a fixed menuPlacement", () => {
    const { rerender } = render(<Dropdown label="City" options={cities} menuPlacement="top" defaultOpen />);
    expect(root().getAttribute("data-placement")).toBe("top");
    rerender(<Dropdown label="City" options={cities} menuPlacement="bottom" defaultOpen />);
    expect(root().getAttribute("data-placement")).toBe("bottom");
  });

  it("shows the keyboard focus ring only while navigating with the keyboard", () => {
    render(<Dropdown label="City" options={cities} />);
    open();
    expect(root().hasAttribute("data-keyboard")).toBe(false);
    fireEvent.keyDown(document.activeElement!, { key: "ArrowDown" });
    expect(root().hasAttribute("data-keyboard")).toBe(true);
    fireEvent.mouseEnter(optionNamed("Mumbai"));
    expect(root().hasAttribute("data-keyboard")).toBe(false);
  });

  it("sets aria-invalid and shows the helper text in the error status", () => {
    render(<Dropdown label="City" options={cities} status="error" helperText="Please choose an option" />);
    expect(trigger().getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByText("Please choose an option")).toBeTruthy();
  });

  it("marks a required field", () => {
    render(<Dropdown label="City" options={cities} required />);
    expect(trigger().getAttribute("aria-required")).toBe("true");
  });

  it("cannot be opened when disabled", () => {
    render(<Dropdown label="City" options={cities} disabled />);
    expect(trigger().disabled).toBe(true);
    fireEvent.click(trigger());
    fireEvent.keyDown(trigger(), { key: "ArrowDown" });
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("renders option icons as decorative", () => {
    render(<Dropdown label="City" options={[{ value: "a", label: "A", icon: <svg data-testid="ic" /> }]} />);
    open();
    expect(screen.getByTestId("ic").closest("[aria-hidden]")).toBeTruthy();
  });

  it("forwards ref to the trigger input and className to the root", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Dropdown label="City" options={cities} ref={ref} className="custom" />);
    expect(ref.current).toBe(trigger());
    expect(root().className).toContain("custom");
  });

  it("names the listbox after the label", () => {
    render(<Dropdown label="City" options={cities} />);
    open();
    expect(within(document.body).getByRole("listbox", { name: "City" })).toBeTruthy();
  });
});

describe("Dropdown.meta", () => {
  it("matches the implemented props and variants", () => {
    expect(meta.variants.axes.selection).toEqual(["single", "multi"]);
    expect(meta.variants.axes.state).toEqual(["closed", "filled", "open", "error", "disabled"]);
    expect(meta.component.figma?.nodeId).toBe("1426:626");
    for (const p of ["options", "multiple", "value", "onValueChange", "showSearch", "showFooter", "status"]) {
      expect(Object.keys(meta.props)).toContain(p);
    }
  });
});
