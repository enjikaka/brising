export function waitForClassChange(
  el: HTMLElement,
  timeout = 1000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.attributeName === "class") {
          observer.disconnect();
          resolve();
          return;
        }
      }
    });

    observer.observe(el, { attributes: true, attributeFilter: ["class"] });

    // safety timeout
    setTimeout(() => {
      observer.disconnect();
      reject(new Error("Timed out waiting for class change"));
    }, timeout);
  });
}
