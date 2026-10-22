import "../tokens/index.css";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import * as icons from "./index";
import { Button } from "../components/Button";

afterEach(cleanup);

const entries = Object.entries(icons).filter(([name]) => name.endsWith("Icon"));

describe("icons", () => {
  it("exports the curated set", () => {
    expect(entries.length).toBeGreaterThanOrEqual(45);
    expect(icons.SearchIcon).toBeTruthy();
    expect(icons.InfoFilledIcon).toBeTruthy();
  });

  it("renders every icon as an svg that follows the text color and is 1em by default", () => {
    for (const [name, Icon] of entries) {
      const { container, unmount } = render(
        <span style={{ color: "rgb(1, 2, 3)", fontSize: "20px" }}>
          <Icon />
        </span>,
      );
      const svg = container.querySelector("svg");
      expect(svg, name).toBeTruthy();
      expect(getComputedStyle(svg!).fill, name).toBe("rgb(1, 2, 3)");
      expect(svg!.getBoundingClientRect().width, name).toBe(20);
      unmount();
    }
  });

  it("is sized and colored by the component that holds it", () => {
    const { container } = render(
      <Button size="medium" variant="primary" leadingIcon={<icons.SearchIcon />}>
        Search
      </Button>,
    );
    const svg = container.querySelector(".ds-button__icon svg")!;
    expect(svg.getBoundingClientRect().width).toBe(20); // medium icon size
    expect(getComputedStyle(svg).fill).toBe("rgb(255, 255, 255)"); // icon/inverse on primary
  });
});
