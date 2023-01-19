import { append } from './dom-utils.js';
import { getQueryIndex } from './services/QueryIndex.js';

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
 * Adds archive links pointing to other yearly edition websites.
 * The links are added to the ul of the last li item.
 * @param {Element} nav Navigation element
 * @param {string} queryIndexUrl URL pointing to query-index json
 */
export async function addArchiveLinks(nav, queryIndexUrl) {
  const navItems = nav.querySelectorAll(':scope > ul > li');
  const lastNavItem = navItems[navItems.length - 1];
  if (lastNavItem) {
    const ul = lastNavItem.querySelector(':scope > ul');
    if (ul) {
      const queryIndex = await getQueryIndex(queryIndexUrl);
      queryIndex.getAllSiteRoots().forEach((siteRoot) => {
        const listItem = append(ul, 'li');
        const link = append(listItem, 'a');
        link.href = siteRoot.path;
        link.textContent = siteRoot.title;
      });
    }
  }
}
