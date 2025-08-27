export class ColorSchemeChangeEvent extends Event {
  static eventName = "brising-color-scheme-change";

  #colorScheme;

  constructor(colorScheme: string) {
    super(ColorSchemeChangeEvent.eventName, { bubbles: true, composed: true });
    this.#colorScheme = colorScheme;
  }

  get value() {
    return this.#colorScheme;
  }
}

export class ThemeChangeEvent extends Event {
  static eventName = "brising-theme-change";

  #theme;

  constructor(theme: string) {
    super(ThemeChangeEvent.eventName, { bubbles: true, composed: true });
    this.#theme = theme;
  }

  get value() {
    return this.#theme;
  }
}

export type Events = ThemeChangeEvent | ColorSchemeChangeEvent;
