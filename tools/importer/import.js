/* global */
/* eslint-disable no-console, class-methods-use-this */

const pageRegex = /^\/content\/adaptto(.+)\/en(.+)?\.helix(-(.+))?\.html$/;
const speakerRegex = /^\/content\/dam\/adaptto\/production\/speaker\/(.+)\.helix(\.(.+))?\.html$/;
const suffixFragmentRegex = /^fragment-(.+)$/;

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
    const { pathname } = new URL(url);

    const pageMatch = pathname.match(pageRegex);
    if (pageMatch) {
      const year = pageMatch[1];
      const localPath = pageMatch[2] ?? '/index';
      const suffix = pageMatch[4];
      if (suffix) {
        const suffixFragmentMatch = suffix.match(suffixFragmentRegex);
        if (suffixFragmentMatch) {
          return `${year}/fragments/${suffixFragmentMatch[1]}`;
        }
        return `${year}/${suffix}`;
      }
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

    return pathname;
  },

};
