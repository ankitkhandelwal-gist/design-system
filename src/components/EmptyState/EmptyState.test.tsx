import "../../tokens/index.css";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Button } from "../Button";
import { EmptyState } from "./EmptyState";
import meta from "./EmptyState.meta";

afterEach(cleanup);

describe("EmptyState", () => {
  it("shows the title and description", () => {
    render(<EmptyState title="No results found" description="Try again" />);
    expect(screen.getByText("No results found")).toBeTruthy();
    expect(screen.getByText("Try again")).toBeTruthy();
  });

  it("shows the icon by default, hidden from assistive tech, and removes it with icon={null}", () => {
    const { container, rerender } = render(<EmptyState title="T" />);
    expect(container.querySelector(".ds-empty-state__icon")?.getAttribute("aria-hidden")).toBe("true");
    rerender(<EmptyState title="T" icon={null} />);
    expect(container.querySelector(".ds-empty-state__icon")).toBeNull();
  });

  it("omits the description and action when not given", () => {
    const { container } = render(<EmptyState title="T" />);
    expect(container.querySelector(".ds-empty-state__description")).toBeNull();
    expect(container.querySelector(".ds-empty-state__action")).toBeNull();
  });

  it("renders the action", () => {
    render(<EmptyState title="T" action={<Button>Clear</Button>} />);
    expect(screen.getByRole("button", { name: "Clear" })).toBeTruthy();
  });

  it("matches the Figma spec: 32px icon, 12px gap, centered, 32/24 padding, description max 480px", () => {
    const { container } = render(<EmptyState title="T" description="D" />);
    const root = container.firstElementChild as HTMLElement;
    const s = getComputedStyle(root);
    expect(s.gap).toBe("12px");
    expect(s.alignItems).toBe("center");
    expect(s.paddingTop).toBe("32px");
    expect(s.paddingLeft).toBe("24px");
    expect(getComputedStyle(container.querySelector(".ds-empty-state__icon")!).fontSize).toBe("32px");
    expect(getComputedStyle(container.querySelector(".ds-empty-state__text")!).maxWidth).toBe("480px");
  });

  it("has meta with a name and keywords", () => {
    expect(meta.component.name).toBe("EmptyState");
    expect(meta.aiHints.keywords.length).toBeGreaterThan(0);
  });
});
