const adaptToSiteUrlRegex = /^https?:\/\/([^/.]+--adaptto-website--adaptto.(hlx|aem).(page|live)|adapt.to|localhost:\d+)(\/.+)$/;
const adaptToSiteUrlPathnameGroup = 4;
const downloadUrlRegex = /^.+\.(pdf|zip)$/;
const socialLinkShortcutRegex = /^.*\/linkedin$/;

/**
 * Encapsulates a link URL to inspect it parts.
 */
export default class Link {
  /**
   * @param {string} url URL (with or without host name).
   */
  constructor(url) {
    this.url = url;
    this.adaptToSiteUrlMatch = adaptToSiteUrlRegex.exec(this.url);
    this.socialLinkShortcutMatch = socialLinkShortcutRegex.exec(this.url);
  }

  /**
   * @returns {boolean} true if URL points to adaptTo() site.
   */
  isAdaptToSiteUrl() {
    return this.adaptToSiteUrlMatch != null && this.socialLinkShortcutMatch == null;
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
