/**
 * Returns the height of `<header>` when it is actively sticky/fixed on the current
 * viewport (returns `0` on mobile viewports `< 768px` so typing/focus scrolls the
 * search bar to the top of the screen even when the header is sticky at `scrollY === 0`).
 */
export function getStickyHeaderHeight(): number {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return 0;
  }
  if (window.innerWidth < 768) {
    return 0;
  }
  const headerEl = document.querySelector('header');
  if (!headerEl) return 0;

  const position = window.getComputedStyle(headerEl).position;
  return position === 'sticky' || position === 'fixed'
    ? headerEl.getBoundingClientRect().height
    : 0;
}

/**
 * Scrolls the page so `element` sits cleanly at `extraOffsetPx` below any sticky header.
 * Returns `true` if a scroll was needed, `false` if already aligned within `tolerancePx`.
 */
export function scrollElementBelowStickyHeader(
  element: HTMLElement | null,
  extraOffsetPx = 8,
  behavior: ScrollBehavior = 'smooth',
  tolerancePx = 6
): boolean {
  if (!element || typeof window === 'undefined') return false;

  const desiredViewportTop = getStickyHeaderHeight() + extraOffsetPx;
  const currentViewportTop = element.getBoundingClientRect().top;

  if (Math.abs(currentViewportTop - desiredViewportTop) <= tolerancePx) {
    return false;
  }

  const targetTop = Math.max(0, window.scrollY + currentViewportTop - desiredViewportTop);
  window.scrollTo({
    top: targetTop,
    behavior,
  });
  return true;
}
