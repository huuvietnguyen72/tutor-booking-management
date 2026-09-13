import { describe, expect, it } from "vitest";

describe("frontend test harness", () => {
  it("runs TypeScript tests in jsdom", () => {
    const element = document.createElement("div");
    element.textContent = "GiaSuPro";
    expect(element).toHaveTextContent("GiaSuPro");
  });
});
