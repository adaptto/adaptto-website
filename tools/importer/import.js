/* global */
/* eslint-disable no-console, class-methods-use-this */

const targetHostName = 'https://main--adaptto-website--adaptto.hlx.page';

const pageHelixRegex = /^\/content\/adaptto(.+)\/en(.+)?\.helix(-(.+))?\.html$/;
const pageRegex = /^\/content\/adaptto(.+)\/en(.+)?\.html$/;
const speakerRegex = /^\/content\/dam\/adaptto\/production\/speaker\/(.+)\.helix(\.(.+))?\.html$/;
const presentationRegex = /^\/content\/dam\/adaptto\/production\/presentations\/([^/]+)\/(.+)\/_jcr_content\/renditions\/original\..+$/;
const suffixFragmentRegex = /^fragment-(.+)$/;

/**
 * Ensure presentation file name does not contain invalid chars and is used lowercase.
 * @param {string} filename File name
 * @returns Sanitized file name
 */
function sanitizeFilename(filename) {
  const extensionIndex = filename.lastIndexOf('.');
  if (extensionIndex >= 0) {
    let name = filename.substring(0, extensionIndex);
    const extension = filename.substring(extensionIndex + 1);
    // replace dots in filename
    name = name.replaceAll(/(\.)/g, '-');
    return `${name}.${extension}`.toLowerCase();
  }
  return filename;
}

/**
 * Transforms AEM URLs to Helix URLs:
 * - Removes .helix selector and html extension
 * - Detects suffix after helix selector for nav, footer and fragments
 * - Removes "en" from hierarchy
 * - Special treatment for speaker pages and presentations
 */
function transformUrlToPath(url) {
  let pathname = url;
  if (url.includes('://')) {
    pathname = new URL(url).pathname;
  }

  const pageHelixMatch = pathname.match(pageHelixRegex);
  if (pageHelixMatch) {
    const year = pageHelixMatch[1];
    let localPath = pageHelixMatch[2] ?? '/index';
    localPath = localPath.replaceAll('tools/navigation/footermetanav/', 'privacy/');
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
    let localPath = pageMatch[2] ?? '/index';
    localPath = localPath.replaceAll('tools/navigation/footermetanav/', 'privacy/');
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

  const presentationMatch = pathname.match(presentationRegex);
  if (presentationMatch) {
    const year = presentationMatch[1];
    const file = presentationMatch[2];
    return `/${year}/presentations/${sanitizeFilename(file)}`;
  }

  return url;
}

function rewriteLinks(document) {
  const links = document.querySelectorAll('a');
  if (links) {
    links.forEach((anchor) => {
      const originalUrl = anchor.href;
      let url = transformUrlToPath(originalUrl);
      if (url.startsWith('/')) {
        url = `${targetHostName}${url}`;
        if (url.endsWith('/index')) {
          url = url.replace(/\/index$/, '/');
        }
      }
      anchor.href = url;
      if (anchor.textContent === originalUrl) {
        anchor.textContent = url;
      }
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
