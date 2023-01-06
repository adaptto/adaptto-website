/* global WebImporter */
/* eslint-disable no-console, class-methods-use-this */

const pageRegex = /^\/content\/adaptto(.+)\.helix\.html$/;
const pageFragmentRegex = /^\/content\/adaptto(.+)\.helix-fragment-(.+)\.html$/;
const pageSpecialRegex = /^\/content\/adaptto(.+)\.helix-(.+)\.html$/;
const speakerRegex = /^\/content\/dam\/adaptto\/production\/speaker\/(.+)\.helix(\.(.+))?\.html$/;

export default {

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
  }) => {
    const pathname = new URL(url).pathname;
    let result = pathname

    const pageMatch = pathname.match(pageRegex)
    if (pageMatch) {
      return pageMatch[1]
    }

    const pageFragmentMatch = pathname.match(pageFragmentRegex)
    if (pageFragmentMatch) {
      return `${pageFragmentMatch[1]}/fragments/${pageFragmentMatch[2]}`
    }

    const pageSpecialMatch = pathname.match(pageSpecialRegex)
    if (pageSpecialMatch) {
      return `${pageSpecialMatch[1]}/${pageSpecialMatch[2]}`
    }

    const speakerMatch = pathname.match(speakerRegex)
    if (speakerMatch) {
      const variation = speakerMatch[3]
      if (variation) {
        return `/speakers/${speakerMatch[1]}-${speakerMatch[3]}`
      }
      else {
        return `/speakers/${speakerMatch[1]}`
      }
    }

    return pathname;
  }

};
