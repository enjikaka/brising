# brising

A small library to handle color scheme and theme changes in you UI-applications.

## API

### Methods

#### watchColorSchemeChange

```ts
watchColorSchemeChange(element: HTMLElement, initialScheme: ColorScheme = "default")
```

This function will apply either the `scheme-default`, `scheme-light` or `scheme-dark` class to the provided HTMLElement as a response to the `ColorSchemeChangeEvent` being emitted.

#### watchThemeChange

```ts
watchThemeChange<T extends string>(element: HTMLElement, themes: T[], initialTheme?: T)
```

This function will apply either the theme  class to the provided HTMLElement as a response to the `ThemeChangeEvent` being emitted.

### Events

#### ColorSchemeChangeEvent

When dispatching this events the listeners for the theme are invoked and the baked-in `watchColorSchemeChange` method runs.

> [!NOTE]  
> Emitting this event is your concern - for example when you hydrate your application settings on load or when a new option is selected in a  HTMLSelectElement. Check below for usage examples.

#### ThemeChangeEvent

When dispatching this events the listeners for the theme are invoked and the baked-in `watchThemeChange` method runs.

> [!NOTE]  
> Emitting this event is your concern - for example when you hydrate your application settings on load or when a new option is selected in a  HTMLSelectElement. Check below for usage examples.

## Example usage

### Hooking a HTMLSelectElement up

Here's an example hooking the `ColorSchemeChangeEvent` up in the UI with a HTMLSelectElement, using the [webact](https://github.com/enjikaka/webact) library for UI rendering.

```js
import { registerFunctionComponent } from "webact";

import {
  ColorSchemeChangeEvent,
  watchColorScheme,
} from "brising";
// Storage-shim to support localStorage, sessionStorage, cookies etc in case one of them are unavailable due to school/business restricted Chromium installs...
import Storage from "../../helpers/storage.js";

const preference = (colorScheme) =>
  window.matchMedia(`(prefers-color-scheme: ${colorScheme})`);

// Event target for when the OS-scheme changes.
const darkPreference = preference("dark");

async function applySchemeFromStorage() {
  const scheme = await Storage.getItem("colorScheme");

  switch (scheme) {
    case "scheme-light":
    case "scheme-dark":
      document.dispatchEvent(new ColorSchemeChangeEvent(scheme));
      break;
    default: {
      const mode = darkPreference.matches ? "scheme-dark" : "scheme-light";
      document.dispatchEvent(new ColorSchemeChangeEvent(mode));
      break;
    }
  }

  return scheme;
}

async function SchemeSelect() {
  const { html, useCSS, postRender, $ } = this;

  await useCSS("/js/components/theme-select/theme-select.css");
  
  html`
    <select title="Select scheme">
        <option value="scheme-default" selected>Let computer decide</option>
        <option value="scheme-dark">Always dark</option>
        <option value="scheme-light">Always light</option>
    </select>
  `;

  postRender(async () => {
    const $host = $(":host");
    const $select = $("select");

    watchColorScheme($host);

    const storedScheme = await Storage.getItem("colorScheme");

    $select.value = storedScheme || "scheme-default";

    await applySchemeFromStorage();

    $select.addEventListener("change", async (event) => {
      const scheme = event.target.value;

      await Storage.setItem("colorScheme", scheme);

      applySchemeFromStorage();
    });

    // If the color scheme preference changes in the OS, emit the ColorSchemeChangeEvent
    darkPreference.addEventListener("change", applySchemeFromStorage);

    document.addEventListener(ColorSchemeChangeEvent.eventName, (event) => {
      if (event instanceof ColorSchemeChangeEvent) {
        const $html = document.documentElement;

        $html.classList.remove("scheme-default", "scheme-dark", "scheme-light");
        $html.classList.add(event.colorScheme);
      }
    });
  });
}

export default registerFunctionComponent(SchemeSelect, {
  name: "scheme-select",
  metaUrl: import.meta.url,
});
```

## Etymology

The name **Brising** is inspired by Brisingamen, the fabled necklace of the Norse goddess Freyja. As Brisingamen decorated the goddess with beauty and power, this library helps you decorate your application with style and clarity.
