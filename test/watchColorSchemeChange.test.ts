import { expect, suite, test } from "vitest";
import { ColorSchemeChangeEvent } from "../src/events.ts";
import { watchColorSchemeChange } from "../src/main.ts";
import { waitForClassChange } from "./helpers.ts";

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

  test("updates the scheme class when the event is emitted", async () => {
    const host = document.createElement("div");
    watchColorSchemeChange(host, "dark");

    expect(host.classList.contains("scheme-dark")).toBe(true);

    // Act - emit the event
    document.dispatchEvent(new ColorSchemeChangeEvent("light"));

    await waitForClassChange(host);

    expect(host.classList.contains("scheme-light")).toBe(true);
  });
});
