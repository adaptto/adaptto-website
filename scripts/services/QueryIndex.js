import { getDocumentName, getPathName, isUrlOrPath } from '../utils/path.js';
import QueryIndexItem from './QueryIndexItem.js';

const siteRootRegex = /^\/\d\d\d\d\/$/;
const speakerPathRegex = /^\/speakers\/.*$/;
let queryIndexInstance;

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
   * Get query index item for speaker.
   * @param {string} pathOrName Speaker name or speaker document name or speaker path
   * @returns {QueryIndexItem} Item or undefined
   */
  getSpeaker(pathOrName) {
    if (isUrlOrPath(pathOrName)) {
      const path = getPathName(pathOrName);
      if (path.match(speakerPathRegex)) {
        return this.getItem(path);
      }
    }
    return this.items
      .filter((item) => item.path.match(speakerPathRegex))
      // check real speaker name or page document name
      .find((item) => (item.title === pathOrName) || (getDocumentName(item.path) === pathOrName));
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
    const items = data.map((item) => Object.assign(new QueryIndexItem(), item));
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
