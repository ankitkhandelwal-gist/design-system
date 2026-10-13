import "../../tokens/index.css";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Button, ButtonSkeleton } from "./Button";
import meta from "./Button.meta";

afterEach(cleanup);

describe("Button", () => {
  it("renders its label as an accessible button", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeTruthy();
  });

  it("defaults to primary / small and type=button", () => {
    render(<Button>Save</Button>);
    const el = screen.getByRole("button") as HTMLButtonElement;
    expect(el.dataset.variant).toBe("primary");
    expect(el.dataset.size).toBe("small");
    expect(el.type).toBe("button");
  });

  it("reflects variant and size", () => {
    render(<Button variant="destructive" size="large">Delete</Button>);
    const el = screen.getByRole("button");
    expect(el.getAttribute("data-variant")).toBe("destructive");
    expect(el.getAttribute("data-size")).toBe("large");
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Go</Button>);
    const el = screen.getByRole("button") as HTMLButtonElement;
    fireEvent.click(el);
    expect(el.disabled).toBe(true);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders leading and trailing icons as aria-hidden and keeps the accessible name", () => {
    render(
      <Button leadingIcon={<svg data-testid="lead" />} trailingIcon={<svg data-testid="trail" />}>
        Next
      </Button>,
    );
    expect(screen.getByTestId("lead").parentElement?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByTestId("trail").parentElement?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByRole("button", { name: "Next" })).toBeTruthy();
  });

  it("hides icons when showLeadingIcon / showTrailingIcon are false", () => {
    render(
      <Button showLeadingIcon={false} showTrailingIcon={false} leadingIcon={<svg data-testid="lead" />} trailingIcon={<svg data-testid="trail" />}>
        Next
      </Button>,
    );
    expect(screen.queryByTestId("lead")).toBeNull();
    expect(screen.queryByTestId("trail")).toBeNull();
  });

  it("supports icon-only buttons via aria-label", () => {
    render(<Button aria-label="Add" leadingIcon={<svg />} />);
    const el = screen.getByRole("button", { name: "Add" });
    expect(el.hasAttribute("data-icon-only")).toBe(true);
    expect(el.querySelector(".ds-button__label")).toBeNull();
  });

  it("keeps the labelled height and padding for icon-only buttons", () => {
    render(
      <>
        <Button size="medium" aria-label="Icon" leadingIcon={<svg />} />
        <Button size="medium">Label</Button>
      </>,
    );
    const [iconOnly, labelled] = screen.getAllByRole("button").map((b) => b.getBoundingClientRect());
    expect(iconOnly?.height).toBe(labelled?.height);
    // medium: 16px padding on each side + 20px icon
    expect(iconOnly?.width).toBe(52);
  });

  it("forwards ref and extra class names", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref} className="custom">Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.className).toContain("ds-button");
    expect(ref.current?.className).toContain("custom");
  });
});

describe("ButtonSkeleton", () => {
  it("is hidden from assistive tech and matches the button height", () => {
    const { container } = render(
      <>
        <ButtonSkeleton size="large" />
        <Button size="large">Label</Button>
      </>,
    );
    const skeleton = container.querySelector(".ds-button-skeleton") as HTMLElement;
    expect(skeleton.getAttribute("aria-hidden")).toBe("true");
    expect(skeleton.getBoundingClientRect().height).toBe(screen.getByRole("button").getBoundingClientRect().height);
  });
});

describe("Button.meta", () => {
  it("matches the implemented props and variants", () => {
    expect(meta.props.variant?.values).toEqual(meta.variants.axes.variant);
    expect(meta.props.size?.values).toEqual(meta.variants.axes.size);
    expect(meta.component.figma?.nodeId).toBe("263:829");
  });
});
