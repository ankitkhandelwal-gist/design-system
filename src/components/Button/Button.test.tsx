import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders its children", () => {
    render(<Button>content</Button>);
    expect(screen.getByText("content")).toBeTruthy();
  });
});
