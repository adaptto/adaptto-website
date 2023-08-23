/**
 * Returns Fetch API cache options that force a reload.
 * @returns Force reload cache options.
 */
export function getFetchCacheOptionsForceReload() {
  return { cache: 'reload' };
}

/**
 * Detects the navigation type of the current page in browser.
 * If the current page was reloaded (e.g. by user), force a cache reload of items
 * fetched via Fetch API as well (e.g. footer, header, Query Index).
 * @returns Options for Fetch API.
 */
export function getFetchCacheOptions() {
  const navigationType = window.performance.getEntriesByType('navigation')[0]?.type;
  if (navigationType === 'reload') {
    return getFetchCacheOptionsForceReload();
  }
  return {};
}
