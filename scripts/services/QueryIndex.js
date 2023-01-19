import QueryIndexItem from './QueryIndexItem.js';

const siteRootRegex = /^\/\d\d\d\d\/$/;
const queryIndexCache = new Set();

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
   * @param {string} path Item path
   * @returns {QueryIndexItem?} Item
   */
  getItem(path) {
    return this.items.find((item) => item.path === path);
  }

  /**
   * @returns {QueryIndexItem[]} All web site root pages (for each yearly edition), newest first.
   */
  getAllSiteRoots() {
    return this.items
      .filter((item) => item.path && item.path.match(siteRootRegex))
      .sort((item1, item2) => item1.path && item2.path && item2.path.localeCompare(item1.path));
  }
}

/**
 * @param {string} url Url to query-index.json
 */
export async function getQueryIndex(url) {
  let queryIndexInstance = queryIndexCache[url];
  if (!queryIndexInstance) {
    let data;
    const resp = await fetch(url);
    if (resp.ok) {
      const json = await resp.json();
      data = json.data;
    }
    data = data || [];
    const items = data.map((item) => Object.assign(new QueryIndexItem(), item));
    queryIndexInstance = new QueryIndex(items);
    queryIndexCache[url] = queryIndexInstance;
  }
  return queryIndexInstance;
}
