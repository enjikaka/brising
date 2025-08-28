import { colorSchemeSubscribers, themeChangeSubscribers } from "./cache.ts";
import { ColorSchemeChangeEvent, ThemeChangeEvent } from "./events.ts";
import type { ColorScheme } from "./types.d.ts";

let isObservingTheme = false;
let isObservingColorScheme = false;

/**
 * Start observing the color scheme change event.
 */
export function startObserveringColorScheme() {
  if (!isObservingColorScheme) {
    document.addEventListener(ColorSchemeChangeEvent.eventName, (event) => {
      const colorSchemeEvent = event as ColorSchemeChangeEvent;
      for (const callback of colorSchemeSubscribers) {
        callback(colorSchemeEvent.value);
      }
    });
    isObservingColorScheme = true;
  }
}

/**
 * Start observing the theme change event.
 */
export function startObserveringTheme() {
  if (!isObservingTheme) {
    document.addEventListener(ThemeChangeEvent.eventName, (event) => {
      const themeEvent = event as ThemeChangeEvent;
      for (const callback of themeChangeSubscribers) {
        callback(themeEvent.value);
      }
    });
    isObservingTheme = true;
  }
}

/**
 * Watch for color scheme changes and update the element's class list.
 * @param element - The element to update.
 * @param initialScheme - The initial scheme to use.
 * @returns A function to unsubscribe from the color scheme change event.
 */
export function watchColorSchemeChange(
  element: HTMLElement,
  initialScheme: ColorScheme = "default",
): () => void {
  startObserveringColorScheme();

  function updateTheme(scheme: string) {
    element.classList.remove("scheme-default", "scheme-dark", "scheme-light");
    element.classList.add(`scheme-${scheme as ColorScheme}`);
  }

  if (initialScheme) {
    updateTheme(initialScheme);
  }

  colorSchemeSubscribers.add(updateTheme);

  return () => {
    colorSchemeSubscribers.delete(updateTheme);
  };
}

/**
 * Watch for theme changes and update the element's class list.
 * @param element - The element to update.
 * @param themes - The themes used in the project.
 * @param initialTheme - The initial theme to use.
 * @returns A function to unsubscribe from the theme change event.
 */
export function watchThemeChange<T extends string>(
  element: HTMLElement,
  themes: T[],
  initialTheme?: T,
): () => void {
  startObserveringTheme();

  const themeClasses = themes.map((theme) => `theme-${theme}`);

  function updateTheme(theme: string) {
    element.classList.remove(...themeClasses);
    element.classList.add(`theme-${theme}`);
  }

  if (initialTheme) {
    updateTheme(initialTheme);
  }

  themeChangeSubscribers.add(updateTheme);

  return () => {
    themeChangeSubscribers.delete(updateTheme);
  };
}

export { ColorSchemeChangeEvent, ThemeChangeEvent };
