import {
  colorSchemeSubscribers,
  type Subscriber,
  themeChangeSubscribers,
} from "./cache.ts";
import {
  ColorSchemeChangeEvent,
  type Events,
  ThemeChangeEvent,
} from "./events.ts";
import type { ColorScheme } from "./types.d.ts";

/**
 * Create an observer that listens for events and updates the subscribers.
 * @param asyncIterator - The async iterator to listen for.
 * @param subscribers - The subscribers to update.
 */
async function createObserver(
  asyncIterator: ReturnType<typeof createListener>,
  subscribers: Set<Subscriber>,
) {
  for await (const value of asyncIterator) {
    for (const callback of subscribers) {
      callback(value);
    }
  }
}

/**
 * Create a listener for a specific event.
 * @param eventName - The name of the event to listen for.
 * @returns An async iterator that emits the event value.
 */
function createListener<T extends Events>(eventName: string) {
  return {
    [Symbol.asyncIterator]() {
      return {
        next() {
          return new Promise<{ value: string; done: boolean }>((resolve) => {
            function resolvePromise(e: T) {
              resolve({ value: e.value, done: false });
            }

            document.addEventListener(
              eventName,
              (event) => resolvePromise(event as T),
              {
                once: true,
              },
            );
          });
        },
      };
    },
  };
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

// Start listening globally when the library is imported.
createObserver(
  createListener(ColorSchemeChangeEvent.eventName),
  colorSchemeSubscribers,
);
createObserver(
  createListener(ThemeChangeEvent.eventName),
  themeChangeSubscribers,
);
