import { append } from './dom.js';
import { getQueryIndex } from '../services/QueryIndex.js';

const siteRootRegex = /^(\/(\d\d\d\d)\/)(.+)?$/;
const speakerPathRegex = /^\/speakers\/[^/]+$/;
const yearHashRegex = /^#(\d\d\d\d)$/;

/**
 * Detects the root of the current site (first hierarchy level below docroot).
 * Examples:
 *   / -> /
 *   /2021/ -> /2021/
 *   /2021/mypage -> /2021/
 * @param {string} pathName Path name
 * @returns {string} Site root path
 */
export function getSiteRootPath(pathName) {
  const siteRootMatch = pathName.match(siteRootRegex);
  if (siteRootMatch) {
    return siteRootMatch[1];
  }
  return '/';
}

/**
 * Gets year from given path.
 * @param {string} pathName Path name.
 * @returns {number} Year or undefined
 */
export function getYearFromPath(pathName) {
  const siteRootMatch = pathName.match(siteRootRegex);
  if (siteRootMatch) {
    return parseInt(siteRootMatch[2], 10);
  }
  return undefined;
}

/**
 * Detects the root of the current site (first hierarchy level below docroot).
 * This method also works for speaker pages which are outside the yearly site context.
 * It uses hash and speaker talks to detect the matching year.
 * @param {string} pathName Path name
 * @param {string} hash Hash (optional, only required for speaker pages)
 * @returns Site root path
 */
export async function getSiteRootPathAlsoForSpeakerPath(pathName, hash) {
  if (pathName.match(speakerPathRegex)) {
    const yearHashMatch = hash?.match(yearHashRegex);
    let year;
    if (yearHashMatch) {
      [, year] = yearHashMatch;
    } else {
      const queryIndex = await getQueryIndex();
      const speakerItem = queryIndex.getItem(pathName);
      if (speakerItem) {
        const speakerTalks = queryIndex.getTalksForSpeaker(speakerItem);
        const latestTalk = speakerTalks[0];
        if (latestTalk) {
          year = getYearFromPath(latestTalk.path);
        }
      }
    }
    if (year) {
      return `/${year}/`;
    }
  }
  // fallback to normal site root detection
  return getSiteRootPath(pathName);
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
 * @param {string} pathName Path name
 * @param {string} path relative path inside site (without leading slash)
 * @returns {string} Path
 */
function getRelativePage(pathName, path) {
  const siteRoot = getSiteRootPath(pathName);
  return `${siteRoot}${path}`;
}

/**
 * Build path to schedule page in current site.
 * @param {string} pathName Path name
 * @returns {string} Path
 */
export function getSchedulePath(pathName) {
  return getRelativePage(pathName, 'schedule');
}

/**
 * Build path to archive page in current site.
 * @param {string} pathName Path name
 * @returns {string} Path
 */
export function getArchivePath(pathName) {
  return getRelativePage(pathName, 'archive');
}

/**
 * Build path to speaker overview page in current site.
 * @param {string} pathName Path name
 * @returns {string} Path
 */
export function getSpeakerOverviewPath(pathName) {
  return getRelativePage(pathName, 'conference/speaker');
}

/**
 * Get path to speaker detail page (in context of given year).
 * @typedef {import('../services/QueryIndexItem').default} QueryIndexItem
 * @param {QueryIndexItem} speakerItem Speaker item
 * @param {string} pathName Path name
 */
export function getSpeakerDetailPath(speakerItem, pathName) {
  const year = getYearFromPath(pathName);
  return `${speakerItem.path}#${year}`;
}

/**
 * Checks if given path is a speaker detail page.
 * @param {string} pathName Path name
 * @returns true if path points to a speaker detail page
 */
export function isSpeakerDetailPath(pathName) {
  return pathName.match(speakerPathRegex) != null;
}

/**
 * Adds archive links pointing to other yearly edition websites.
 * The links are added to the ul of the last li item.
 * @param {Element} nav Navigation element
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
