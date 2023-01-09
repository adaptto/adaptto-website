/* global */
/* eslint-disable no-console, class-methods-use-this */

const targetHostName = 'https://main--adaptto-website--adaptto.hlx.page';

const pageHelixRegex = /^\/content\/adaptto(.+)\/en(.+)?\.helix(-(.+))?\.html$/;
const pageRegex = /^\/content\/adaptto(.+)\/en(.+)?\.html$/;
const speakerRegex = /^\/content\/dam\/adaptto\/production\/speaker\/(.+)\.helix(\.(.+))?\.html$/;
const suffixFragmentRegex = /^fragment-(.+)$/;

/**
 * Transforms AEM URLs to Helix URLs:
 * - Removes .helix selector and html extensions
 * - Detects suffix after helix selector for nav, footer and fragments
 * - Removes "en" from hierarchy
 * - Special treatment for speaker pages
 */
function transformUrlToPath(url) {
  let pathname = url;
  if (url.includes('://')) {
    pathname = new URL(url).pathname;
  }

  const pageHelixMatch = pathname.match(pageHelixRegex);
  if (pageHelixMatch) {
    const year = pageHelixMatch[1];
    const localPath = pageHelixMatch[2] ?? '/index';
    const suffix = pageHelixMatch[4];
    if (suffix) {
      const suffixFragmentMatch = suffix.match(suffixFragmentRegex);
      if (suffixFragmentMatch) {
        return `${year}/fragments/${suffixFragmentMatch[1]}`;
      }
      return `${year}/${suffix}`;
    }
    return `${year}${localPath}`;
  }

  const pageMatch = pathname.match(pageRegex);
  if (pageMatch) {
    const year = pageMatch[1];
    const localPath = pageMatch[2] ?? '/index';
    return `${year}${localPath}`;
  }

  const speakerMatch = pathname.match(speakerRegex);
  if (speakerMatch) {
    const speaker = speakerMatch[1];
    const variation = speakerMatch[3];
    if (variation) {
      return `/speakers/${speaker}-${variation}`;
    }
    return `/speakers/${speaker}`;
  }

  return url;
}

function rewriteLinks(document) {
  const links = document.querySelectorAll('a');
  if (links) {
    links.forEach((anchor) => {
      let url = transformUrlToPath(anchor.href);
      if (url.startsWith('/')) {
        url = `${targetHostName}${url}`;
        if (url.endsWith('/index')) {
          url = url.replace(/\/index$/, '/');
        }
      }
      anchor.href = url;
    });
  }
}

export default {

  /**
   * Apply DOM operations to the provided document and return
   * the root element to be then transformed to Markdown.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @returns {HTMLElement} The root element to be transformed
   */
  transformDOM: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    rewriteLinks(document);
    return document.body;
  },

  /**
   * Return a path that describes the document being transformed (file name, nesting...).
   * The path is then used to create the corresponding Word document.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @return {string} The path
   */
  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => transformUrlToPath(url),

};
