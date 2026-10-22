import "../../tokens/index.css";
import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { Tag } from "./Tag";
import meta from "./Tag.meta";

afterEach(cleanup);

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`;
};
const tag = () => screen.getByText("Label").closest(".ds-tag") as HTMLElement;

describe("Tag", () => {
  it("renders its label as text", () => {
    render(<Tag>Label</Tag>);
    expect(screen.getByText("Label")).toBeTruthy();
  });

  it("defaults to red / subtle", () => {
    render(<Tag>Label</Tag>);
    expect(tag().dataset.color).toBe("red");
    expect(tag().dataset.variant).toBe("subtle");
  });

  it("is 24px tall, as in Figma", () => {
    render(<Tag>Label</Tag>);
    expect(tag().getBoundingClientRect().height).toBe(24);
  });

  it("uses the Figma colors for subtle, outline and filled", () => {
    const { rerender } = render(<Tag color="green" variant="subtle">Label</Tag>);
    expect(getComputedStyle(tag()).backgroundColor).toBe(rgb("#b7d8c3")); // Green/100
    rerender(<Tag color="green" variant="filled">Label</Tag>);
    expect(getComputedStyle(tag()).backgroundColor).toBe(rgb("#16803d")); // Green/500
    rerender(<Tag color="grey" variant="outline">Label</Tag>);
    expect(getComputedStyle(tag()).backgroundColor).toBe(rgb("#ffffff"));
    expect(getComputedStyle(tag()).boxShadow).toContain(rgb("#424242")); // Grey/800 stroke
  });

  it("changes background on hover (forced state)", () => {
    render(<Tag data-state="hover">Label</Tag>);
    expect(getComputedStyle(tag()).backgroundColor).toBe(rgb("#df9c9c")); // Red/200
  });

  it("renders icons as aria-hidden and hides them with the show toggles", () => {
    const { rerender } = render(
      <Tag leadingIcon={<svg data-testid="lead" />} trailingIcon={<svg data-testid="trail" />}>Label</Tag>,
    );
    expect(screen.getByTestId("lead").parentElement?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByTestId("trail")).toBeTruthy();
    rerender(
      <Tag showLeadingIcon={false} showTrailingIcon={false} leadingIcon={<svg data-testid="lead" />} trailingIcon={<svg data-testid="trail" />}>
        Label
      </Tag>,
    );
    expect(screen.queryByTestId("lead")).toBeNull();
    expect(screen.queryByTestId("trail")).toBeNull();
  });

  it("is static by default: a span, not a button, with no hover styling hook", () => {
    render(<Tag>Label</Tag>);
    expect(tag().tagName).toBe("SPAN");
    expect(screen.queryByRole("button")).toBeNull();
    expect(tag().hasAttribute("data-interactive")).toBe(false);
  });

  it("becomes a button when onClick is passed, and calls it", () => {
    const onClick = vi.fn();
    render(<Tag onClick={onClick}>Label</Tag>);
    const el = screen.getByRole("button", { name: "Label" }) as HTMLButtonElement;
    expect(el.type).toBe("button");
    expect(el.hasAttribute("data-interactive")).toBe(true);
    expect(getComputedStyle(el).cursor).toBe("pointer");
    fireEvent.click(el);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("keeps the same size when clickable", () => {
    render(<><Tag>Static</Tag><Tag onClick={() => {}}>Clicks</Tag></>);
    const [a, b] = screen.getAllByText(/Static|Clicks/).map((n) => n.closest(".ds-tag")!.getBoundingClientRect());
    expect(a?.height).toBe(24);
    expect(b?.height).toBe(24);
  });

  it("forwards ref and extra class names", () => {
    const ref = createRef<HTMLElement>();
    render(<Tag ref={ref} className="custom">Label</Tag>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.className).toContain("custom");
  });
});

describe("Tag.meta", () => {
  it("matches the implemented props and variants", () => {
    expect(meta.props.color?.values).toEqual(meta.variants.axes.color);
    expect(meta.props.variant?.values).toEqual(meta.variants.axes.variant);
    expect(meta.component.figma?.nodeId).toBe("283:191");
  });
});
