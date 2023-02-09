import { getDocumentName, getPathName, isUrlOrPath } from '../utils/path.js';
import QueryIndexItem from './QueryIndexItem.js';

const siteRootRegex = /^\/\d\d\d\d\/$/;
const speakerPathRegex = /^\/speakers\/.*$/;
const talkPageRegex = /^\/\d\d\d\d\/schedule\/.+$/;
const defaultMetaImage = '/default-meta-image.png?width=1200&format=pjpg&optimize=medium';
let queryIndexInstance;

/**
 * Gets a distinct sorted list of speaker names from all talks in given year.
 * @param {QueryIndexItem[]} items
 * @param {RegExp} filter
 */
function getFilteredDistinctSortedTalkSpeakers(items, pathFilter) {
  const speakerSet = new Set();
  items.filter((item) => item.path.match(pathFilter))
    .forEach((item) => {
      item.getSpeakers().forEach((speaker) => speakerSet.add(speaker));
    });
  return Array.from(speakerSet).sort();
}

/**
 * Gets the speaker item variant matching to the given year, if multiple ones
 * are matching for the same speaker name.
 * Background: Speaker details and affiliation may change over years. This method
 * always picks the best match for the requested year.
 * @param {QueryIndexItem[]} speakerItems Matching speaker items
 * @param {string} siteRootPath Site root path
 * @return {QueryIndexItem} Best-matching speaker item
 */
function getMatchingSpeakerVariant(speakerItems, siteRootPath) {
  if (speakerItems.length === 0) {
    return undefined;
  }
  if (speakerItems.length === 1) {
    return speakerItems[0];
  }

  const year = parseInt(siteRootPath.substring(1, siteRootPath.length - 1), 10);
  // sort by uptoyear, with entry without uptoyear coming last
  speakerItems.sort((a, b) => {
    if (!a.uptoyear) {
      return 1;
    }
    if (!b.uptoyear) {
      return -1;
    }
    return a.uptoyear - b.uptoyear;
  });
  return speakerItems.find((item) => !item.uptoyear || item.uptoyear >= year);
}

/**
 * Helper for getting information about published pages and metadata.
 */
export default class QueryIndex {
  /** @type {QueryIndexItem[]} */
  items;

  /**
   * @param {QueryIndexItem[]} items data array from query-index.json
   */
  constructor(items) {
    this.items = items;
  }

  /**
   * Get query index item by path.
   * @param {string} path Item path
   * @returns {QueryIndexItem} Item or undefined
   */
  getItem(path) {
    return this.items.find((item) => item.path === path);
  }

  /**
   * Get all web site root pages (for each yearly edition), newest first.
   * @returns {QueryIndexItem[]} Query index items pointing to web site roots.
   */
  getAllSiteRoots() {
    return this.items
      .filter((item) => item.path && item.path.match(siteRootRegex))
      .sort((item1, item2) => item1.path && item2.path && item2.path.localeCompare(item1.path));
  }

  /**
   * Get query index item for speaker for given year.
   * @param {string} pathOrName Speaker name or speaker document name or speaker path
   * @param {string} siteRootPath Site root path of current year
   * @returns {QueryIndexItem} Item or undefined
   */
  getSpeaker(pathOrName, siteRootPath) {
    if (isUrlOrPath(pathOrName)) {
      const path = getPathName(pathOrName);
      if (path.match(speakerPathRegex)) {
        return this.getItem(path);
      }
    }
    const matchingSpeakers = this.items
      .filter((item) => item.path.match(speakerPathRegex))
      // check real speaker name or page document name
      .filter((item) => (item.title === pathOrName) || (getDocumentName(item.path) === pathOrName));
    return getMatchingSpeakerVariant(matchingSpeakers, siteRootPath);
  }

  /**
   * Get a distinct sorted list of all speakers of main talks in given year.
   * @param {string} siteRootPath Site root path
   * @returns {string[]} Speaker names
   */
  getTalkSpeakerNames(siteRootPath) {
    const pathFilter = new RegExp(`^${siteRootPath}schedule/[^/]+$`);
    return getFilteredDistinctSortedTalkSpeakers(this.items, pathFilter);
  }

  /**
   * Get a distinct sorted list of all speakers of lightning talks in given year.
   * Speakers that also are in the list of main talk speakers are not included.
   * @param {string} siteRootPath Site root path
   * @returns {string[]} Speaker names
   */
  getLightningTalkSpeakerNames(siteRootPath) {
    // lightning talks are always stored at sub pages one level deeper than the main talks
    const pathFilter = new RegExp(`^${siteRootPath}schedule/[^/]+/[^/]+$`);
    const lightningTalkSpeakerNames = getFilteredDistinctSortedTalkSpeakers(this.items, pathFilter);

    // subtract main talk speaker names
    const talkSpeakerNames = this.getTalkSpeakerNames(siteRootPath);
    return lightningTalkSpeakerNames.filter((speaker) => !talkSpeakerNames.includes(speaker));
  }

  /**
   * Get all talk items, sorted descending by year, ascending by title.
   */
  getAllTalks() {
    return this.items
      .filter((item) => item.path.match(talkPageRegex))
      .sort((talk1, talk2) => {
        const year1 = talk1.path.substring(0, 6);
        const year2 = talk2.path.substring(0, 6);
        if (year1 === year2) {
          return talk1.path.localeCompare(talk2.path);
        }
        return year2.localeCompare(year1);
      });
  }

  /**
   * Get all talks for given speaker, ordered descending by year, ascending by title.
   * @param {QueryIndexItem} speakerItem Speaker item
   * @returns {QueryIndexItem[]} Talk items
   */
  getTalksForSpeaker(speakerItem) {
    const speakerDocumentName = getDocumentName(speakerItem.path);
    return this.getAllTalks()
      .filter((item) => {
        if (item.speakers) {
          const speakers = item.getSpeakers();
          return speakers.includes(speakerItem.title)
              || speakers.includes(speakerDocumentName);
        }
        return false;
      });
  }
}

/**
 * Get Query Index based on query-index.json.
 */
export async function getQueryIndex() {
  if (!queryIndexInstance) {
    let data;
    const resp = await fetch('/query-index.json');
    if (resp.ok) {
      const json = await resp.json();
      data = json.data;
    }
    data = data || [];
    const items = data.map((item) => {
      const queryIndexItem = Object.assign(new QueryIndexItem(), item);
      // remove invalid default-meta-image.png references
      if (queryIndexItem.image === defaultMetaImage) {
        queryIndexItem.image = undefined;
      }
      return queryIndexItem;
    });
    queryIndexInstance = new QueryIndex(items);
  }
  return queryIndexInstance;
}

/**
 * Clears internal cache of query index responses.
 */
export function clearQueryIndexCache() {
  queryIndexInstance = undefined;
}
