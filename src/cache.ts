export type Subscriber = (value: string) => void;

export const themeChangeSubscribers = new Set<Subscriber>();
export const colorSchemeSubscribers = new Set<Subscriber>();
