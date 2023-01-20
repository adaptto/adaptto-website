import { append } from './dom.js';
import { getQueryIndex } from '../services/QueryIndex.js';

const siteRootRegex = /^(\/[^/]+\/)(.+)?$/;

/**
 * Detects the root of the current site (first hierarchy level below docroot).
 * Examples:
 *   / -> /
 *   /2021/ -> /2021/
 *   /2021/mypage -> /2021/
 * @param {string} pathName Path name
 * @returns Site root path
 */
export function getSiteRootPath(pathName) {
  const result = pathName.match(siteRootRegex);
  if (result) {
    return result[1];
  }
  return '/';
}

/**
 * Gets parent path. Topmost parent path is the site root.
 * @param {string} pathName Path name
 * @returns {string} Parent path or undefined if the path is already site root or invalid.
 */
export function getParentPath(pathName) {
  const siteRoot = getSiteRootPath(pathName);
  if (pathName !== siteRoot && siteRoot !== '/') {
    const lastSlash = pathName.lastIndexOf('/');
    if (lastSlash === siteRoot.length - 1) {
      return siteRoot;
    }
    return pathName.substring(0, lastSlash);
  }
  return undefined;
}

/**
 * Build page path in current site.
 * @param {string} pathName location.pathName
 * @param {string} path relative path inside site (without leading slash)
 * @returns {string} Path
 */
function getRelativePage(pathName, path) {
  const siteRoot = getSiteRootPath(pathName);
  return `${siteRoot}${path}`;
}

/**
 * Build path to schedule page in current site.
 * @param {string} pathName location.pathName
 * @returns {string} Path
 */
export function getSchedulePath(pathName) {
  return getRelativePage(pathName, 'schedule');
}

/**
 * Build path to archive page in current site.
 * @param {string} pathName location.pathName
 * @returns {string} Path
 */
export function getArchivePath(pathName) {
  return getRelativePage(pathName, 'archive');
}

/**
 * Build path to speaker overview page in current site.
 * @param {string} pathName location.pathName
 * @returns {string} Path
 */
export function getSpeakerOverviewPath(pathName) {
  return getRelativePage(pathName, 'conference/speaker');
}

/**
 * Adds archive links pointing to other yearly edition websites.
 * The links are added to the ul of the last li item.
 * @param {Element} nav Navigation element
 * @param {string} queryIndexUrl URL pointing to query-index json
 */
export async function addArchiveLinks(nav) {
  const navItems = nav.querySelectorAll(':scope > ul > li');
  const lastNavItem = navItems[navItems.length - 1];
  if (lastNavItem) {
    const ul = lastNavItem.querySelector(':scope > ul');
    if (ul) {
      const queryIndex = await getQueryIndex();
      queryIndex.getAllSiteRoots().forEach((siteRoot) => {
        const listItem = append(ul, 'li');
        const link = append(listItem, 'a');
        link.href = siteRoot.path;
        link.textContent = siteRoot.title;
      });
    }
  }
}
