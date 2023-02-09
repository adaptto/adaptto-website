import { parseCSVArray, parseJsonArray } from '../utils/metadata.js';

/**
 * Describes data returned by query index and adds helper methods.
 */
export default class QueryIndexItem {
  /** @type {string} */
  path;

  /** @type {string} */
  title;

  /** @type {string} */
  description;

  /** @type {string} */
  keywords;

  /** @type {string} */
  robots;

  /** @type {string} */
  image;

  /** @type {string} */
  tags;

  /** @type {string} Speaker: Affiliation/Company */
  affiliation;

  /** @type {string} Speaker: Twitter name e.g. "@twitteruser" */
  twitter;

  /** @type {string} Speaker: This speaker is an alias to given speaker path-name */
  ['speaker-alias'];

  /** @type {string} Speaker: This speaker metadata is valid upt to the given year */
  uptoyear;

  /** @type {string} Talk: Speaker assignment (speaker names or speaker path-names) */
  speakers;

  /**
   * @returns {string[]} Robot values as array
   */
  getKeywords() {
    return parseCSVArray(this.keywords);
  }

  /**
   * @returns {string[]} Robot values as array
   */
  getRobots() {
    return parseCSVArray(this.robots);
  }

  /**
   * @returns {string[]} Tag value as array
   */
  getTags() {
    return parseJsonArray(this.tags);
  }

  /**
   * @returns {string[]} Speaker names as array
   */
  getSpeakers() {
    return parseCSVArray(this.speakers);
  }
}
