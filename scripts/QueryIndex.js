const siteRootRegex = /^\/\d\d\d\d\/$/;

/**
 * Helper class for getting relevant information from helix query index.
 */
export class QueryIndex {
  data;

  /**
   * @param {object[]} data data array from query-index.json
   */
  constructor(data) {
    this.data = data;
  }

  /**
   * @returns {object[]} All web site root pages (for each yearly edition), newest first.
   */
  getAllSiteRoots() {
    return this.data
      .filter((item) => item.path && item.path.match(siteRootRegex))
      .sort((item1, item2) => item1.path && item2.path && item2.path.localeCompare(item1.path));
  }
}

/**
 * @param {string} href Url to query-index.json
 * @return {QueryIndex}
 */
export async function getQueryIndex(href) {
  let data;
  const resp = await fetch(href);
  if (resp.ok) {
    const json = await resp.json();
    data = json.data;
  }
  return new QueryIndex(data || []);
}
