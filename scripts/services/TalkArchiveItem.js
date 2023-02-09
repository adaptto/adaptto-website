/**
 * Item of talk archive.
 * Subset of properties from QueryIndexItem, but the array properties are already processed.
 */
export default class TalkArchiveItem {
  /** @type {string} */
  path;

  /** @type {string} */
  year;

  /** @type {string} */
  title;

  /** @type {string} */
  description;

  /** @type {string[]} */
  keywords = [];

  /** @type {string[]} */
  tags = [];

  /** @type {string[]} Talk: Speaker assignment (speaker names or speaker path-names) */
  speakers = [];
}
