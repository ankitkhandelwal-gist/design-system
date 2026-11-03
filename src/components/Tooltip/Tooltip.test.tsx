import "../../tokens/index.css";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Button } from "../Button";
import { Tooltip } from "./Tooltip";
import meta from "./Tooltip.meta";

afterEach(cleanup);

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`;
};
const setup = (props: Partial<React.ComponentProps<typeof Tooltip>> = {}) =>
  render(<div style={{ padding: 100 }}><Tooltip content="Tip" {...props}><Button>Trigger</Button></Tooltip></div>);

describe("Tooltip", () => {
  it("is hidden until hover", () => {
    setup();
    expect(screen.queryByRole("tooltip")).toBeNull();
    fireEvent.mouseEnter(screen.getByRole("button"));
    expect(screen.getByRole("tooltip").textContent).toBe("Tip");
    fireEvent.mouseLeave(screen.getByRole("button"));
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("shows on keyboard focus, hides on blur, and Escape dismisses it", () => {
    setup();
    const btn = screen.getByRole("button");
    fireEvent.focus(btn);
    expect(screen.getByRole("tooltip")).toBeTruthy();
    fireEvent.keyDown(btn, { key: "Escape" });
    expect(screen.queryByRole("tooltip")).toBeNull();
    fireEvent.blur(btn);
    fireEvent.focus(btn);
    expect(screen.getByRole("tooltip")).toBeTruthy();
    fireEvent.blur(btn);
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("describes the trigger with aria-describedby while open", () => {
    setup();
    const btn = screen.getByRole("button");
    expect(btn.getAttribute("aria-describedby")).toBeNull();
    fireEvent.focus(btn);
    expect(btn.getAttribute("aria-describedby")).toBe(screen.getByRole("tooltip").id);
  });

  it("keeps an existing aria-describedby on the trigger", () => {
    render(<Tooltip content="Tip" open><button aria-describedby="other">B</button></Tooltip>);
    expect(screen.getByRole("button").getAttribute("aria-describedby")?.split(" ")[0]).toBe("other");
  });

  it("open forces it visible without hover", () => {
    setup({ open: true });
    expect(screen.getByRole("tooltip")).toBeTruthy();
  });

  it("defaults to placement top", () => {
    setup({ open: true });
    expect(screen.getByRole("tooltip").dataset.placement).toBe("top");
  });

  it("matches the Figma spec: navy-black body, white text, 8/12 padding, 8px radius, 9x5 arrow", () => {
    setup({ open: true });
    const tip = screen.getByRole("tooltip");
    const s = getComputedStyle(tip);
    expect(s.backgroundColor).toBe(rgb("#212121")); // tooltip/bg: Grey/900
    expect(s.color).toBe(rgb("#ffffff"));
    expect(s.paddingTop).toBe("8px");
    expect(s.paddingLeft).toBe("12px");
    expect(s.borderTopLeftRadius).toBe("8px");
    expect(s.fontSize).toBe("12px");
    expect(s.boxShadow).not.toBe("none");
    const arrow = getComputedStyle(tip.querySelector(".ds-tooltip__arrow")!);
    expect(arrow.width).toBe("9px");
    expect(arrow.height).toBe("5px");
    expect(tip.getBoundingClientRect().height).toBe(32);
  });

  it("places the tooltip on the requested side of the trigger", () => {
    const rect = (el: Element) => el.getBoundingClientRect();
    const sides = { top: "bottom", bottom: "top", left: "right", right: "left" } as const;
    for (const [placement, edge] of Object.entries(sides)) {
      const { unmount } = setup({ open: true, placement: placement as keyof typeof sides });
      const t = rect(screen.getByRole("tooltip"));
      const b = rect(screen.getByRole("button"));
      if (placement === "top") expect(t.bottom).toBeLessThan(b.top);
      if (placement === "bottom") expect(t.top).toBeGreaterThan(b.bottom);
      if (placement === "left") expect(t.right).toBeLessThan(b.left);
      if (placement === "right") expect(t.left).toBeGreaterThan(b.right);
      expect(edge).toBeTruthy();
      unmount();
    }
  });

  const edge = (style: React.CSSProperties, placement: React.ComponentProps<typeof Tooltip>["placement"]) =>
    render(<div style={{ position: "fixed", ...style }}><Tooltip content="A fairly long tooltip text" placement={placement} open><Button>T</Button></Tooltip></div>);

  it("flips below the trigger when there is no room above", () => {
    edge({ top: 0, left: 300 }, "top");
    expect(screen.getByRole("tooltip").dataset.placement).toBe("bottom");
    expect(screen.getByRole("tooltip").getBoundingClientRect().top).toBeGreaterThan(screen.getByRole("button").getBoundingClientRect().bottom);
  });

  it("flips above the trigger when there is no room below", () => {
    edge({ bottom: 0, left: 300 }, "bottom");
    expect(screen.getByRole("tooltip").dataset.placement).toBe("top");
  });

  it("flips to the right of the trigger at the left edge, and to the left at the right edge", () => {
    edge({ top: 200, left: 0 }, "left");
    expect(screen.getByRole("tooltip").dataset.placement).toBe("right");
    cleanup();
    edge({ top: 200, right: 0 }, "right");
    expect(screen.getByRole("tooltip").dataset.placement).toBe("left");
  });

  it("shifts its alignment so a centered tooltip stays inside the viewport", () => {
    edge({ top: 200, left: 0 }, "top");
    const tip = screen.getByRole("tooltip");
    expect(tip.dataset.placement).toBe("top-start");
    expect(tip.getBoundingClientRect().left).toBeGreaterThanOrEqual(0);
    cleanup();
    edge({ top: 200, right: 0 }, "top");
    const tip2 = screen.getByRole("tooltip");
    expect(tip2.dataset.placement).toBe("top-end");
    expect(tip2.getBoundingClientRect().right).toBeLessThanOrEqual(window.innerWidth);
  });

  it("is not clipped by an overflow:hidden parent", () => {
    render(<div style={{ overflow: "hidden", width: 80, height: 40 }}><Tooltip content="A fairly long tooltip text" open><Button>T</Button></Tooltip></div>);
    const tip = screen.getByRole("tooltip");
    expect(getComputedStyle(tip).position).toBe("fixed");
    expect(tip.getBoundingClientRect().width).toBeGreaterThan(80);
  });

  it("has meta with an entry for every placement", () => {
    expect(meta.component.name).toBe("Tooltip");
    expect(Object.keys(meta.variants.purpose).length).toBe(8);
  });
});
