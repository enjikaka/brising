import { expect, suite, test } from "vitest";
import { watchColorScheme } from "../src/main";

suite("watchColorScheme", () => {
  test("adds default scheme to host if no initial scheme is provided", () => {
    const host = document.createElement("div");
    watchColorScheme(host);
    expect(host.classList.contains("scheme-default")).toBe(true);
  });

  test("should add initial scheme class to host if provided", () => {
    const host = document.createElement("div");
    watchColorScheme(host, "dark");
    expect(host.classList.contains("scheme-dark")).toBe(true);
  });
});
