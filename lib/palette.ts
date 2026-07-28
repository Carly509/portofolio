export const PALETTE_OPEN_EVENT = 'palette:open';

export function openPalette() {
  window.dispatchEvent(new CustomEvent(PALETTE_OPEN_EVENT));
}
