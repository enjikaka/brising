# brising

A small library to handle color scheme and theme changes in you UI-applications.

## API

### ```watchColorSchemeChange(element: HTMLElement, initialScheme: ColorScheme = "default")```

This function will apply either the `scheme-default`, `scheme-light` or `scheme-dark` class to the provided HTMLElement as a response to the `ColorSchemeChangeEvent` being emitted.

### ```watchThemeChange<T extends string>(element: HTMLElement, themes: T[], initialTheme?: T)```

This function will apply either the theme  class to the provided HTMLElement as a response to the `ThemeChangeEvent` being emitted.

## Example usage