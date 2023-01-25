import Link from './Link.js';

/**
 * Processes an URL with link handler: Removes host name if link points to adaptTo() website.
 * This ensures a publish website never links to a preview website and vice versa.
 * @param {string} url URL
 * @returns {string} Processed URL
 */
export function rewriteUrl(url) {
  if (url) {
    const link = new Link(url);
    if (link.isAdaptToSiteUrl()) {
      return link.getAdaptToSiteUrlPath();
    }
  }
  return url;
}

/**
 * Decorates anchor and Link URL:
 * - Rewrites Link url using rewriteUrl
 * - Sets target='_blank' for external links
 * - Applies download attribute for download links
 * @param {Element} a Anchor to decorate
 * @returns {Element} Anchor element
 */
export function decorateAnchor(a) {
  const url = a.href;
  if (url) {
    const link = new Link(url);
    if (link.isAdaptToSiteUrl()) {
      a.href = link.getAdaptToSiteUrlPath();
      if (link.isDownload()) {
        a.setAttribute('download', '');
      }
    } else {
      a.target = '_blank';
    }
  }
  return a;
}

/**
 * Decorates all anchors in given container.
 * @param {Element} container The container element
 */
export function decorateAnchors(container) {
  container.querySelectorAll('a').forEach((a) => decorateAnchor(a));
}
