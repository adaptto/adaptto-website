/* global */
/* eslint-disable no-console, class-methods-use-this */

const targetHostName = 'https://main--adaptto-website--adaptto.hlx.page';

const pageHelixRegex = /^\/content\/adaptto(.+)\/en(.+)?\.helix(-(.+))?\.html$/;
const pageRegex = /^\/content\/adaptto(.+)\/en(.+)?\.html$/;
const speakerRegex = /^\/content\/dam\/adaptto\/production\/speaker\/(.+)\.helix(\.(.+))?\.html$/;
const presentationRegex = /^\/content\/dam\/adaptto\/production\/presentations\/([^/]+)\/(.+?)(\/_jcr_content\/renditions\/original\..+)?$/;
const suffixFragmentRegex = /^fragment-(.+)$/;

/**
 * Sanitizes the given string by :
 * - convert to lower case
 * - normalize all unicode characters
 * - replace all non-alphanumeric characters with a dash
 * - remove all consecutive dashes
 * - remove all leading and trailing dashes
 * (taken over from https://github.com/adobe/helix-onedrive-support/blob/8af8195badcd9ce2bfe90d01108c5d84685a54e3/src/utils.js)
 *
 * @param {string} name
 * @returns {string} sanitized name
 */
function sanitizeName(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Sanitizes the file path by:
 * - convert to lower case
 * - normalize all unicode characters
 * - replace all non-alphanumeric characters with a dash
 * - remove all consecutive dashes
 * - remove all leading and trailing dashes
 *
 * Note that only the basename of the file path is sanitized. i.e. The ancestor path and the
 * extension is not affected.
 * (taken over from https://github.com/adobe/helix-onedrive-support/blob/8af8195badcd9ce2bfe90d01108c5d84685a54e3/src/utils.js)
 *
 * @param {string} filepath the file path
 * @param {object} opts Options
 * @param {boolean} [opts.ignoreExtension] if {@code true} ignores the extension
 * @returns {string} sanitized file path
 */
function sanitizePath(filepath, opts = {}) {
  const idx = filepath.lastIndexOf('/') + 1;
  const extIdx = opts.ignoreExtension ? -1 : filepath.lastIndexOf('.');
  const pfx = filepath.substring(0, idx);
  const basename = extIdx < idx ? filepath.substring(idx) : filepath.substring(idx, extIdx);
  const ext = extIdx < idx ? '' : filepath.substring(extIdx);
  const name = sanitizeName(basename);
  return `${pfx}${name}${ext}`;
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
  pathname = decodeURI(pathname);

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
    return sanitizePath(`${year}${localPath}`);
  }

  const pageMatch = pathname.match(pageRegex);
  if (pageMatch) {
    const year = pageMatch[1];
    let localPath = pageMatch[2] ?? '/index';
    localPath = localPath.replaceAll('tools/navigation/footermetanav/', 'privacy/');
    return sanitizePath(`${year}${localPath}`);
  }

  const speakerMatch = pathname.match(speakerRegex);
  if (speakerMatch) {
    const speaker = speakerMatch[1];
    const variation = speakerMatch[3];
    if (variation) {
      return sanitizePath(`/speakers/${speaker}-${variation}`);
    }
    return sanitizePath(`/speakers/${speaker}`);
  }

  const presentationMatch = pathname.match(presentationRegex);
  if (presentationMatch) {
    const year = presentationMatch[1];
    const file = presentationMatch[2];
    return sanitizePath(`/${year}/presentations/${file}`);
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
   * @returns {string} The path
   */
  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => transformUrlToPath(url),

};
