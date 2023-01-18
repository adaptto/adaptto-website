/**
 * Splits a comma-separated value to array (trimming the values).
 * @param {string} value Comma-separated value
 * @return {string[]} Value array
 */
function splitCSV(value) {
  if (value) {
    return value.split(',')
      .map((item) => item.trim())
      .filter((item) => item !== '');
  }
  return [];
}

/**
 * Parses Splits a comma-separated value to array (trimming the values).
 * Falls back to splitCSV if string is not valid JSON.
 * @param {string} value JSON array as string
 * @return {string[]} Value array
 */
function parseJsonArray(value) {
  if (value) {
    try {
      return JSON.parse(value);
    } catch (e) {
      // fallback
      return splitCSV(value);
    }
  }
  return [];
}

/**
 * Describes data returned by query index and adds helper methods.
 */
export default class QueryIndexItem {
  /** @type {string} */
  path;

  /** @type {string} */
  title;

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
   * @return {string[]} Robot values as array
   */
  getRobots() {
    return splitCSV(this.robots);
  }

  /**
   * @return {string[]} Tag value as array
   */
  getTags() {
    return parseJsonArray(this.tags);
  }

  /**
   * @return {string[]} Speaker names as array
   */
  getSpeakers() {
    return splitCSV(this.speakers);
  }
}
