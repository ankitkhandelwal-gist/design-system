import "../../tokens/index.css";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Radio } from "./Radio";
import meta from "./Radio.meta";

afterEach(cleanup);

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`;
};
const root = () => document.querySelector(".ds-radio") as HTMLElement;
const control = () => document.querySelector(".ds-radio__control") as HTMLElement;
const dot = () => document.querySelector(".ds-radio__dot") as HTMLElement;

describe("Radio", () => {
  it("is a radio named by its label and described by its subtext", () => {
    render(<Radio name="g" label="Standard" subtext="3 to 5 days" />);
    const r = screen.getByRole("radio", { name: "Standard" });
    expect(document.getElementById(r.getAttribute("aria-describedby")!)?.textContent).toBe("3 to 5 days");
  });

  it("selects when clicked (also via its label) and reports the change", () => {
    const onChange = vi.fn();
    render(<Radio name="g" label="Standard" onChange={onChange} />);
    const r = screen.getByRole("radio") as HTMLInputElement;
    fireEvent.click(screen.getByText("Standard"));
    expect(r.checked).toBe(true);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("allows only one selection per group name", () => {
    render(
      <>
        <Radio name="plan" value="a" label="A" defaultChecked />
        <Radio name="plan" value="b" label="B" />
      </>,
    );
    fireEvent.click(screen.getByText("B"));
    expect((screen.getByRole("radio", { name: "A" }) as HTMLInputElement).checked).toBe(false);
    expect((screen.getByRole("radio", { name: "B" }) as HTMLInputElement).checked).toBe(true);
  });

  it("supports controlled use", () => {
    const { rerender } = render(<Radio name="g" label="A" checked={false} onChange={() => {}} />);
    expect((screen.getByRole("radio") as HTMLInputElement).checked).toBe(false);
    rerender(<Radio name="g" label="A" checked onChange={() => {}} />);
    expect((screen.getByRole("radio") as HTMLInputElement).checked).toBe(true);
  });

  it("does not select when disabled", () => {
    render(<Radio name="g" label="A" disabled />);
    const r = screen.getByRole("radio") as HTMLInputElement;
    fireEvent.click(screen.getByText("A"));
    expect(r.disabled).toBe(true);
    expect(r.checked).toBe(false);
  });

  it("hides the subtext with showSubtext=false", () => {
    render(<Radio name="g" label="A" subtext="Hidden text" showSubtext={false} />);
    expect(screen.queryByText("Hidden text")).toBeNull();
    expect(screen.getByRole("radio").getAttribute("aria-describedby")).toBeNull();
  });

  it("can be named by aria-label when there is no visible label", () => {
    render(<Radio name="g" aria-label="Option A" />);
    expect(screen.getByRole("radio", { name: "Option A" })).toBeTruthy();
  });

  it("matches the Figma sizes: circle 16 / 20 / 24, dot half the size, height 36 / 40 / 48", () => {
    const expected = { small: [16, 8, 36], medium: [20, 10, 40], large: [24, 12, 48] } as const;
    for (const [size, [c, d, h]] of Object.entries(expected)) {
      const { unmount } = render(<Radio size={size as "small"} name="g" label="Label" subtext="Supporting text" defaultChecked />);
      expect(control().getBoundingClientRect().width, size).toBe(c);
      expect(dot().getBoundingClientRect().width, size).toBe(d);
      expect(root().getBoundingClientRect().height, size).toBe(h);
      unmount();
    }
  });

  it("uses the Figma border widths: 1.5px at small and medium, 2px at large", () => {
    // The browser snaps the painted border to whole device pixels at 1x, so check the CSS value that drives it.
    const widths = { small: "1.5px", medium: "1.5px", large: "2px" } as const;
    for (const [size, w] of Object.entries(widths)) {
      const { unmount } = render(<Radio size={size as "small"} name="g" label="A" />);
      expect(getComputedStyle(root()).getPropertyValue("--ds-radio-border-width").trim(), size).toBe(w);
      unmount();
    }
  });

  it("uses the Figma colors for unselected, selected and disabled", () => {
    const off = render(<Radio name="g" label="A" />);
    expect(getComputedStyle(control()).borderTopColor).toBe(rgb("#bdbdbd")); // Grey/400
    expect(getComputedStyle(dot()).display).toBe("none");
    off.unmount();
    const on = render(<Radio name="g" label="A" defaultChecked />);
    expect(getComputedStyle(control()).borderTopColor).toBe(rgb("#173e73")); // Brand Navy Blue/500
    expect(getComputedStyle(dot()).backgroundColor).toBe(rgb("#173e73"));
    on.unmount();
    render(<Radio name="g" label="A" disabled />);
    expect(getComputedStyle(control()).backgroundColor).toBe(rgb("#f5f5f5")); // Grey/100
    expect(getComputedStyle(root()).opacity).toBe("0.6");
  });

  it("forwards ref to the input and className to the root", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Radio name="g" label="A" ref={ref} className="custom" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(root().className).toContain("custom");
  });
});

describe("Radio.meta", () => {
  it("matches the implemented props and variants", () => {
    expect(meta.props.size?.values).toEqual(meta.variants.axes.size);
    expect(meta.component.figma?.nodeId).toBe("543:807");
  });
});
