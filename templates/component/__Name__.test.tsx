import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { __Name__ } from "./__Name__";

describe("__Name__", () => {
  it("renders its children", () => {
    render(<__Name__>content</__Name__>);
    expect(screen.getByText("content")).toBeTruthy();
  });
});
