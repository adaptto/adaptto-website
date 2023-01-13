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
// eslint-disable-next-line import/prefer-default-export
export function getSiteRoot(pathname) {
  const result = pathname.match(siteRootRegex);
  if (result) {
    return result[1];
  }
  return '/';
}
