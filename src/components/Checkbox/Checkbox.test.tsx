import "../../tokens/index.css";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Checkbox } from "./Checkbox";
import meta from "./Checkbox.meta";

afterEach(cleanup);

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`;
};
const root = () => document.querySelector(".ds-checkbox") as HTMLElement;
const box = () => document.querySelector(".ds-checkbox__box") as HTMLElement;
const visibleIcons = () =>
  [...document.querySelectorAll(".ds-checkbox__icon")]
    .filter((i) => getComputedStyle(i).display !== "none")
    .map((i) => [...i.classList].find((c) => c.startsWith("ds-checkbox__icon--"))!.replace("ds-checkbox__icon--", ""));

describe("Checkbox", () => {
  it("is a checkbox named by its label and described by its subtext", () => {
    render(<Checkbox label="Updates" subtext="Weekly only" />);
    const cb = screen.getByRole("checkbox", { name: "Updates" });
    expect(document.getElementById(cb.getAttribute("aria-describedby")!)?.textContent).toBe("Weekly only");
  });

  it("flips when clicked (also via its label) and reports the change", () => {
    const onChange = vi.fn();
    render(<Checkbox label="Updates" onChange={onChange} />);
    const cb = screen.getByRole("checkbox") as HTMLInputElement;
    fireEvent.click(cb);
    expect(cb.checked).toBe(true);
    fireEvent.click(screen.getByText("Updates"));
    expect(cb.checked).toBe(false);
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("supports controlled use", () => {
    const { rerender } = render(<Checkbox label="A" checked={false} onChange={() => {}} />);
    expect((screen.getByRole("checkbox") as HTMLInputElement).checked).toBe(false);
    rerender(<Checkbox label="A" checked onChange={() => {}} />);
    expect((screen.getByRole("checkbox") as HTMLInputElement).checked).toBe(true);
  });

  it("sets the indeterminate DOM property", () => {
    const { rerender } = render(<Checkbox label="A" indeterminate />);
    expect((screen.getByRole("checkbox") as HTMLInputElement).indeterminate).toBe(true);
    rerender(<Checkbox label="A" indeterminate={false} />);
    expect((screen.getByRole("checkbox") as HTMLInputElement).indeterminate).toBe(false);
  });

  it("shows the matching icon for unchecked, checked and indeterminate", () => {
    const a = render(<Checkbox label="A" />);
    expect(visibleIcons()).toEqual(["unchecked"]);
    a.unmount();
    const b = render(<Checkbox label="A" defaultChecked />);
    expect(visibleIcons()).toEqual(["checked"]);
    b.unmount();
    render(<Checkbox label="A" defaultChecked indeterminate />);
    expect(visibleIcons()).toEqual(["indeterminate"]); // indeterminate wins over checked
  });

  it("does not flip when disabled", () => {
    render(<Checkbox label="A" disabled />);
    const cb = screen.getByRole("checkbox") as HTMLInputElement;
    fireEvent.click(screen.getByText("A"));
    expect(cb.disabled).toBe(true);
    expect(cb.checked).toBe(false);
  });

  it("hides the subtext with showSubtext=false", () => {
    render(<Checkbox label="A" subtext="Hidden text" showSubtext={false} />);
    expect(screen.queryByText("Hidden text")).toBeNull();
    expect(screen.getByRole("checkbox").getAttribute("aria-describedby")).toBeNull();
  });

  it("can be named by aria-label when there is no visible label", () => {
    render(<Checkbox aria-label="Select row" />);
    expect(screen.getByRole("checkbox", { name: "Select row" })).toBeTruthy();
  });

  it("matches the Figma sizes: box 16 / 20 / 24 and height 36 / 40 / 48 with label and subtext", () => {
    const expected = { small: [16, 36], medium: [20, 40], large: [24, 48] } as const;
    for (const [size, [boxSize, h]] of Object.entries(expected)) {
      const { unmount } = render(<Checkbox size={size as "small"} label="Label" subtext="Supporting text" />);
      expect(box().getBoundingClientRect().width, size).toBe(boxSize);
      expect(box().getBoundingClientRect().height, size).toBe(boxSize);
      expect(root().getBoundingClientRect().height, size).toBe(h);
      unmount();
    }
  });

  it("uses the Figma colors for unchecked, checked and disabled", () => {
    const off = render(<Checkbox label="A" />);
    expect(getComputedStyle(box()).color).toBe(rgb("#7c8b99")); // Blue Grey/400
    off.unmount();
    const on = render(<Checkbox label="A" defaultChecked />);
    expect(getComputedStyle(box()).color).toBe(rgb("#173e73")); // Brand Navy Blue/500
    on.unmount();
    render(<Checkbox label="A" disabled />);
    expect(getComputedStyle(box()).color).toBe(rgb("#f5f5f5")); // Grey/100
    expect(getComputedStyle(root()).opacity).toBe("0.6");
  });

  it("uses the Figma label weight: medium at small, regular at medium and large", () => {
    const weights = { small: "500", medium: "400", large: "400" } as const;
    for (const [size, weight] of Object.entries(weights)) {
      const { unmount } = render(<Checkbox size={size as "small"} label="Label" />);
      expect(getComputedStyle(document.querySelector(".ds-checkbox__label")!).fontWeight, size).toBe(weight);
      unmount();
    }
  });

  it("forwards ref to the input and className to the root", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox label="A" ref={ref} className="custom" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(root().className).toContain("custom");
  });
});

describe("Checkbox.meta", () => {
  it("matches the implemented props and variants", () => {
    expect(meta.props.size?.values).toEqual(meta.variants.axes.size);
    expect(meta.component.figma?.nodeId).toBe("543:631");
  });
});
