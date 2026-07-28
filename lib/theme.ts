/* The theme lives in one place — data-theme on <html> — with localStorage as
 * its memory. Nothing holds it in React state, so there is no hydration
 * mismatch and no render cost: the label for the current theme is picked by
 * CSS, the same way every other themed value on the site is. */
export function toggleTheme() {
  const root = document.documentElement;
  const isDark =
    root.dataset.theme === 'dark' ||
    (!root.dataset.theme &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const next = isDark ? 'light' : 'dark';
  root.dataset.theme = next;

  try {
    localStorage.setItem('theme', next);
  } catch {
    // Private browsing with storage blocked — the theme still applies, it
    // just won't be remembered.
  }
}
