const adaptToSiteUrlRegex = /^https?:\/\/([^/.]+--adaptto-website--adaptto.hlx.(page|live)|adapt.to|franklin.adaptto.de|localhost:\d+)(\/.+)$/;
const adaptToSiteUrlPathnameGroup = 3;
const downloadUrlRegex = /^.+\.(pdf|zip)$/;

/**
 * Encapsulates a link URL to inspect it parts.
 */
export default class Link {
  /**
   * @param {string} url URL (with or without host name).
   */
  constructor(url) {
    this.url = url;
    this.adaptToSiteUrlMatch = this.url.match(adaptToSiteUrlRegex);
  }

  /**
   * @returns {boolean} true if URL points to adaptTo() site.
   */
  isAdaptToSiteUrl() {
    return this.adaptToSiteUrlMatch != null;
  }

  /**
   * @returns {string} Local path to adaptTo() site without host name.
   */
  getAdaptToSiteUrlPath() {
    return this.adaptToSiteUrlMatch[adaptToSiteUrlPathnameGroup];
  }

  /**
   * @returns {boolean} true if URL points to a download file.
   */
  isDownload() {
    return this.url.match(downloadUrlRegex) != null;
  }
}
