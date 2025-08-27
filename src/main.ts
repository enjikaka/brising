import {
  colorSchemeSubscribers,
  type Subscriber,
  themeChangeSubscribers,
} from "./cache";
import {
  ColorSchemeChangeEvent,
  type Events,
  ThemeChangeEvent,
} from "./events";
import type { ColorScheme } from "./types";

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

export function watchColorScheme(
  $host: HTMLElement,
  initialScheme: ColorScheme = "default",
) {
  function updateTheme(scheme: string) {
    $host.classList.remove("scheme-default", "scheme-dark", "scheme-light");
    $host.classList.add(`scheme-${scheme as ColorScheme}`);
  }

  if (initialScheme) {
    updateTheme(initialScheme);
  }

  colorSchemeSubscribers.add(updateTheme);

  return () => {
    colorSchemeSubscribers.delete(updateTheme);
  };
}

export function watchThemeChange<T extends string>(
  $host: HTMLElement,
  themes: T[],
  initialTheme?: T,
) {
  const themeClasses = themes.map((theme) => `theme-${theme}`);

  function updateTheme(theme: string) {
    $host.classList.remove(...themeClasses);
    $host.classList.add(`theme-${theme}`);
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
