/**
 * Detects the root of the current site (first hierarchy level below docroot).
 */
export function getSiteRoot(pathname) {
  const regex = new RegExp('^(/[^/]+/)(.*)?$')
  const result = pathname.match(regex)
  if (result) {
    return result[1]
  }
  else {
    return '/'
  }
}
