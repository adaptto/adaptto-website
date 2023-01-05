/**
 * Detects the root of the current site (first hierarchy level below docroot).
 * Examples:
 *   / -> /
 *   /2021/ -> /2021/
 *   /2021/mypage -> /2021/
 */
// eslint-disable-next-line import/prefer-default-export
export function getSiteRoot(pathname) {
  const regex = /^(\/[^/]+\/)(.+)?$/;
  const result = pathname.match(regex);
  if (result) {
    return result[1];
  }
  return '/';
}
