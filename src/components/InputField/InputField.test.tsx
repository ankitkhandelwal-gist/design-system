import "../../tokens/index.css";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { InputField } from "./InputField";
import meta from "./InputField.meta";

afterEach(cleanup);

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`;
};
const container = () => document.querySelector(".ds-input-field__container") as HTMLElement;
const root = () => document.querySelector(".ds-input-field") as HTMLElement;
const sized = (ui: React.ReactElement) => render(<div style={{ width: 320 }}>{ui}</div>);

describe("InputField", () => {
  it("links the label to the input", () => {
    render(<InputField label="Email" />);
    expect(screen.getByLabelText("Email")).toBeTruthy();
  });

  it("shows the mandatory asterisk and sets required", () => {
    render(<InputField label="Email" required />);
    expect((screen.getByLabelText(/Email/) as HTMLInputElement).required).toBe(true);
    expect(document.querySelector(".ds-input-field__mandatory")?.textContent).toBe("*");
  });

  it("links helper text with aria-describedby and honors showHelperText", () => {
    const { rerender } = render(<InputField label="Email" helperText="We never share it" />);
    const input = screen.getByLabelText("Email");
    expect(document.getElementById(input.getAttribute("aria-describedby")!)?.textContent).toBe("We never share it");
    rerender(<InputField label="Email" helperText="We never share it" showHelperText={false} />);
    expect(screen.getByLabelText("Email").getAttribute("aria-describedby")).toBeNull();
  });

  it("sets aria-invalid for error only", () => {
    const { rerender } = render(<InputField label="A" status="error" />);
    expect(screen.getByLabelText("A").getAttribute("aria-invalid")).toBe("true");
    rerender(<InputField label="A" status="success" />);
    expect(screen.getByLabelText("A").getAttribute("aria-invalid")).toBeNull();
  });

  it("accepts typing and calls onChange", () => {
    const onChange = vi.fn();
    render(<InputField label="A" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("A"), { target: { value: "hi" } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("disables the input", () => {
    render(<InputField label="A" disabled />);
    expect((screen.getByLabelText("A") as HTMLInputElement).disabled).toBe(true);
    expect(root().hasAttribute("data-disabled")).toBe(true);
  });

  it("matches the Figma geometry: 38px input box and 82px field", () => {
    sized(<InputField label="Label" helperText="Helper text" />);
    expect(container().getBoundingClientRect().height).toBe(38);
    expect(root().getBoundingClientRect().height).toBe(82);
  });

  it("uses the Figma border colors per status and disabled background", () => {
    const { rerender } = sized(<InputField label="A" />);
    expect(getComputedStyle(container()).borderColor).toBe(rgb("#c9d1d8")); // Blue Grey/200
    rerender(<div style={{ width: 320 }}><InputField label="A" status="error" /></div>);
    expect(getComputedStyle(container()).borderColor).toBe(rgb("#b92828")); // Red/500
    rerender(<div style={{ width: 320 }}><InputField label="A" status="success" /></div>);
    expect(getComputedStyle(container()).borderColor).toBe(rgb("#16803d")); // Green/500
    rerender(<div style={{ width: 320 }}><InputField label="A" disabled /></div>);
    expect(getComputedStyle(container()).backgroundColor).toBe(rgb("#f5f5f5")); // Grey/100
  });

  it("shows the focus border and ring when forced focused", () => {
    sized(<InputField label="A" />);
    root().setAttribute("data-state", "focused"); // forced look, as used by the stories
    expect(getComputedStyle(container()).borderColor).toBe(rgb("#365d91")); // Brand Navy Blue/400
    expect(getComputedStyle(container()).boxShadow).not.toBe("none");
  });

  it("renders icons as aria-hidden and hides them with the show toggles", () => {
    const { rerender } = render(
      <InputField label="A" leadingIcon={<svg data-testid="lead" />} trailingIcon={<svg data-testid="trail" />} labelIcon={<svg data-testid="lab" />} />,
    );
    expect(screen.getByTestId("lead").parentElement?.getAttribute("aria-hidden")).toBe("true");
    rerender(
      <InputField
        label="A"
        showLeadingIcon={false}
        showTrailingIcon={false}
        showLabelIcon={false}
        leadingIcon={<svg data-testid="lead" />}
        trailingIcon={<svg data-testid="trail" />}
        labelIcon={<svg data-testid="lab" />}
      />,
    );
    expect(screen.queryByTestId("lead")).toBeNull();
    expect(screen.queryByTestId("trail")).toBeNull();
    expect(screen.queryByTestId("lab")).toBeNull();
  });

  it("forwards ref to the input and className to the root", () => {
    const ref = createRef<HTMLInputElement>();
    render(<InputField label="A" ref={ref} className="custom" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(root().className).toContain("custom");
  });
});

describe("InputField.meta", () => {
  it("matches the implemented props and variants", () => {
    expect(meta.props.status?.values).toEqual(meta.variants.axes.status);
    expect(meta.component.figma?.nodeId).toBe("1198:36037");
  });
});
