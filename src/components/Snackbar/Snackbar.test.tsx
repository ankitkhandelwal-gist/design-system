import "../../tokens/index.css";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Snackbar } from "./Snackbar";
import meta from "./Snackbar.meta";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`;
};

describe("Snackbar", () => {
  it("shows the heading and description", () => {
    render(<Snackbar heading="Saved" description="Your changes were saved." />);
    expect(screen.getByText("Saved")).toBeTruthy();
    expect(screen.getByText("Your changes were saved.")).toBeTruthy();
  });

  it("hides the heading when none is given", () => {
    const { container } = render(<Snackbar description="Done" />);
    expect(container.querySelector(".ds-snackbar__heading")).toBeNull();
  });

  it("defaults to the info type", () => {
    render(<Snackbar description="x" />);
    expect(screen.getByRole("status").dataset.type).toBe("info");
  });

  it("announces info and success politely, danger and warning urgently", () => {
    const { rerender } = render(<Snackbar type="info" description="x" />);
    expect(screen.getByRole("status")).toBeTruthy();
    rerender(<Snackbar type="success" description="x" />);
    expect(screen.getByRole("status")).toBeTruthy();
    rerender(<Snackbar type="danger" description="x" />);
    expect(screen.getByRole("alert")).toBeTruthy();
    rerender(<Snackbar type="warning" description="x" />);
    expect(screen.getByRole("alert")).toBeTruthy();
  });

  it("shows a different default icon for each type, hidden from assistive tech", () => {
    const markup = (type: "info" | "success" | "danger" | "warning") => {
      const { container, unmount } = render(<Snackbar type={type} description="x" />);
      const icon = container.querySelector(".ds-snackbar__icon")!;
      expect(icon.getAttribute("aria-hidden")).toBe("true");
      const html = icon.innerHTML;
      unmount();
      return html;
    };
    const all = (["info", "success", "danger", "warning"] as const).map(markup);
    expect(new Set(all).size).toBe(4);
  });

  it("hides the icon with showIcon={false} and swaps it with icon", () => {
    const { container, rerender } = render(<Snackbar description="x" showIcon={false} />);
    expect(container.querySelector(".ds-snackbar__icon")).toBeNull();
    rerender(<Snackbar description="x" icon={<svg data-testid="custom" />} />);
    expect(screen.getByTestId("custom")).toBeTruthy();
  });

  it("shows Dismiss and Action only when their handlers are given, with custom labels", () => {
    const { rerender } = render(<Snackbar description="x" />);
    expect(screen.queryAllByRole("button").length).toBe(0);
    rerender(<Snackbar description="x" onDismiss={() => {}} />);
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Action" })).toBeNull();
    rerender(<Snackbar description="x" onAction={() => {}} actionLabel="Undo" />);
    expect(screen.getByRole("button", { name: "Undo" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Dismiss" })).toBeNull();
  });

  it("hides the Dismiss button with showDismiss={false} but still auto-dismisses", () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Snackbar description="x" onDismiss={onDismiss} showDismiss={false} duration={500} />);
    expect(screen.queryByRole("button", { name: "Dismiss" })).toBeNull();
    act(() => { vi.advanceTimersByTime(600); });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("calls the handlers", () => {
    const onDismiss = vi.fn();
    const onAction = vi.fn();
    render(<Snackbar description="x" onDismiss={onDismiss} onAction={onAction} />);
    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    fireEvent.click(screen.getByRole("button", { name: "Action" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("dismisses itself after duration", () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Snackbar description="x" duration={1000} onDismiss={onDismiss} />);
    act(() => { vi.advanceTimersByTime(900); });
    expect(onDismiss).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(200); });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("does not dismiss itself without duration", () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Snackbar description="x" onDismiss={onDismiss} />);
    act(() => { vi.advanceTimersByTime(60000); });
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("pauses the timer while hovered and resumes after", () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Snackbar description="x" duration={1000} onDismiss={onDismiss} />);
    const el = screen.getByRole("status");
    act(() => { vi.advanceTimersByTime(500); });
    fireEvent.mouseEnter(el);
    act(() => { vi.advanceTimersByTime(5000); });
    expect(onDismiss).not.toHaveBeenCalled();
    fireEvent.mouseLeave(el);
    act(() => { vi.advanceTimersByTime(700); });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("matches the Figma spec: dark background, white text, 16px padding, 12px gap, 8px radius, 6px type bar", () => {
    render(<div style={{ width: 600 }}><Snackbar type="danger" heading="H" description="D" onDismiss={() => {}} onAction={() => {}} /></div>);
    const el = screen.getByRole("alert");
    const s = getComputedStyle(el);
    expect(s.backgroundColor).toBe(rgb("#212121")); // snackbar/bg: Grey/900
    expect(s.color).toBe(rgb("#ffffff"));
    expect(s.paddingTop).toBe("16px");
    expect(s.paddingLeft).toBe("16px");
    expect(s.gap).toBe("12px");
    expect(s.borderTopLeftRadius).toBe("8px");
    expect(el.getBoundingClientRect().width).toBe(420);
    const bar = getComputedStyle(el, "::before");
    expect(bar.width).toBe("6px");
    expect(bar.backgroundColor).toBe(rgb("#b92828")); // snackbar/error-bg: Red/500
    const action = getComputedStyle(screen.getByRole("button", { name: "Action" }));
    expect(action.backgroundColor).toBe(rgb("#424242")); // snackbar/action-button-bg: Grey/800
    expect(action.paddingTop).toBe("6px");
    expect(action.paddingLeft).toBe("12px");
    expect(screen.getByRole("button", { name: "Action" }).getBoundingClientRect().height).toBe(32);
  });

  it("slides in with an animation and plays an exit animation when data-exiting is set", () => {
    const { rerender } = render(<Snackbar description="x" />);
    expect(getComputedStyle(screen.getByRole("status")).animationName).toBe("ds-snackbar-in");
    rerender(<Snackbar description="x" data-exiting="" />);
    expect(getComputedStyle(screen.getByRole("status")).animationName).toBe("ds-snackbar-out");
  });

  it("has meta with an entry for every type", () => {
    expect(meta.component.name).toBe("Snackbar");
    expect(Object.keys(meta.variants.purpose).length).toBe(4);
  });
});
