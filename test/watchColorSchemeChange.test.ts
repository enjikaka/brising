import { expect, suite, test } from "vitest";
import { watchColorSchemeChange } from "../src/main";

suite("watchColorSchemeChange", () => {
  test("adds default scheme to host if no initial scheme is provided", () => {
    const host = document.createElement("div");
    watchColorSchemeChange(host);
    expect(host.classList.contains("scheme-default")).toBe(true);
  });

  test("should add initial scheme class to host if provided", () => {
    const host = document.createElement("div");
    watchColorSchemeChange(host, "dark");
    expect(host.classList.contains("scheme-dark")).toBe(true);
  });
});
