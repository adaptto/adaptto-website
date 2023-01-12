const siteRootRegex = /^(\/[^/]+\/)(.+)?$/;

/**
 * Detects the root of the current site (first hierarchy level below docroot).
 * Examples:
 *   / -> /
 *   /2021/ -> /2021/
 *   /2021/mypage -> /2021/
 * @param {string} pathname Path name
 * @returns Site root path
 */
export function getSiteRoot(pathname) {
  const result = pathname.match(siteRootRegex);
  if (result) {
    return result[1];
  }
  return '/';
}

/**
 * Detached the given element from its parent.
 * If the parent then is an empty p element, this is also removed.
 * @param {Element?} element
 */
export function detachElement(element) {
  if (element) {
    const parent = element.parentElement;
    if (parent) {
      parent.removeChild(element);
      // also remove empty parent element
      if (parent.tagName === 'P' && parent.children.length === 0) {
        detachElement(parent);
      }
    }
  }
  return element;
}
