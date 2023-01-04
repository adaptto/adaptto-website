/**
 * Detects the root of the current site (first hierarchy level below docroot).
 */
// eslint-disable-next-line import/prefer-default-export
export function getSiteRoot(pathname) {
  const regex = /^(\/[^/]+\/)(.*)?$/;
  const result = pathname.match(regex);
  if (result) {
    return result[1];
  }
  return '/';
}
