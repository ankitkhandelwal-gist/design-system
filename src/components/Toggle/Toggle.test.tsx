import "../../tokens/index.css";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Toggle } from "./Toggle";
import meta from "./Toggle.meta";

afterEach(cleanup);

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`;
};
const root = () => document.querySelector(".ds-toggle") as HTMLElement;
const track = () => document.querySelector(".ds-toggle__track") as HTMLElement;
const knob = () => document.querySelector(".ds-toggle__knob") as HTMLElement;

describe("Toggle", () => {
  it("is a switch named by its label and described by its subtext", () => {
    render(<Toggle label="Notifications" subtext="Weekly summary" />);
    const sw = screen.getByRole("switch", { name: "Notifications" });
    expect(document.getElementById(sw.getAttribute("aria-describedby")!)?.textContent).toBe("Weekly summary");
  });

  it("flips when clicked (also via its label) and reports the change", () => {
    const onChange = vi.fn();
    render(<Toggle label="Notifications" onChange={onChange} />);
    const sw = screen.getByRole("switch") as HTMLInputElement;
    expect(sw.checked).toBe(false);
    fireEvent.click(sw);
    expect(sw.checked).toBe(true);
    fireEvent.click(screen.getByText("Notifications"));
    expect(sw.checked).toBe(false);
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("supports controlled use", () => {
    const { rerender } = render(<Toggle label="A" checked={false} onChange={() => {}} />);
    expect((screen.getByRole("switch") as HTMLInputElement).checked).toBe(false);
    rerender(<Toggle label="A" checked onChange={() => {}} />);
    expect((screen.getByRole("switch") as HTMLInputElement).checked).toBe(true);
  });

  it("does not flip when disabled", () => {
    render(<Toggle label="A" disabled />);
    const sw = screen.getByRole("switch") as HTMLInputElement;
    fireEvent.click(screen.getByText("A")); // a user can only reach it through the label
    expect(sw.disabled).toBe(true);
    expect(sw.checked).toBe(false);
  });

  it("hides the subtext with showSubtext=false", () => {
    render(<Toggle label="A" subtext="Hidden text" showSubtext={false} />);
    expect(screen.queryByText("Hidden text")).toBeNull();
    expect(screen.getByRole("switch").getAttribute("aria-describedby")).toBeNull();
  });

  it("can be named by aria-label when there is no visible label", () => {
    render(<Toggle aria-label="Enable alerts" />);
    expect(screen.getByRole("switch", { name: "Enable alerts" })).toBeTruthy();
  });

  it("matches the Figma sizes: track 30x16 / 38x20 / 46x24 and toggle height 36 / 40 / 48", () => {
    const expected = { small: [30, 16, 36], medium: [38, 20, 40], large: [46, 24, 48] } as const;
    for (const [size, [w, h, rootH]] of Object.entries(expected)) {
      const { unmount } = render(<Toggle size={size as "small"} label="Label" subtext="Supporting text" />);
      expect(track().getBoundingClientRect().width, size).toBe(w);
      expect(track().getBoundingClientRect().height, size).toBe(h);
      expect(root().getBoundingClientRect().height, size).toBe(rootH);
      unmount();
    }
  });

  it("moves the knob like Figma: 2px from the left when off, 2px from the right when on", () => {
    const { unmount } = render(<Toggle size="small" label="A" />);
    let k = knob().getBoundingClientRect(), t = track().getBoundingClientRect();
    expect(k.left - t.left).toBe(2);
    unmount();
    render(<Toggle size="small" label="A" defaultChecked />);
    k = knob().getBoundingClientRect(); t = track().getBoundingClientRect();
    expect(t.right - k.right).toBe(2);
  });

  it("uses the Figma colors for off, on and disabled", () => {
    const off = render(<Toggle label="A" subtext="B" />);
    expect(getComputedStyle(track()).backgroundColor).toBe(rgb("#e0e0e0")); // Grey/300
    expect(getComputedStyle(knob()).backgroundColor).toBe(rgb("#ffffff"));
    off.unmount();
    const on = render(<Toggle label="A" subtext="B" defaultChecked />);
    expect(getComputedStyle(track()).backgroundColor).toBe(rgb("#173e73")); // Brand Navy Blue/500
    on.unmount();
    render(<Toggle label="A" subtext="B" disabled />);
    expect(getComputedStyle(track()).backgroundColor).toBe(rgb("#e0e0e0")); // toggle/disabled-bg
    expect(getComputedStyle(root()).opacity).toBe("0.6");
    expect(getComputedStyle(document.querySelector(".ds-toggle__label")!).color).toBe(rgb("#bdbdbd")); // text/disabled
  });

  it("forwards ref to the input and className to the root", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Toggle label="A" ref={ref} className="custom" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(root().className).toContain("custom");
  });
});

describe("Toggle.meta", () => {
  it("matches the implemented props and variants", () => {
    expect(meta.props.size?.values).toEqual(meta.variants.axes.size);
    expect(meta.component.figma?.nodeId).toBe("543:998");
  });
});
