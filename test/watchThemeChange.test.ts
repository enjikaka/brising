import { expect, suite, test } from "vitest";
import { ThemeChangeEvent } from "../src/events.ts";
import { watchThemeChange } from "../src/main.ts";
import { waitForClassChange } from "./helpers.ts";

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

  test("updates the scheme class when the event is emitted", async () => {
    const host = document.createElement("div");
    watchThemeChange(host, ["default", "pink"], "default");

    expect(host.classList.contains("theme-default")).toBe(true);

    // Act - emit the event
    document.dispatchEvent(new ThemeChangeEvent("pink"));

    await waitForClassChange(host);

    expect(host.classList.contains("theme-pink")).toBe(true);
  });
});
