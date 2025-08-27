import { expect, suite, test } from "vitest";
import { watchThemeChange } from "../src/main";

suite("watchThemeChange", () => {
  test("does not add any theme classes to host if no initial theme is provided", () => {
    const host = document.createElement("div");
    watchThemeChange(host, ["default", "pink"]);
    expect(host.classList.contains("theme-default")).toBe(false);
    expect(host.classList.contains("theme-pink")).toBe(false);
  });

  test("should add initial theme class to host if provided", () => {
    const host = document.createElement("div");
    watchThemeChange(host, ["default", "pink"], "pink");
    expect(host.classList.contains("theme-pink")).toBe(true);
  });
});
