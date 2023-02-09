import { getYearFromPath } from '../utils/path.js';
import { getQueryIndex } from './QueryIndex.js';

/**
 * Gets a sorted and distinct list of items. Empty items are removed.
 * @param {string[]} items Raw list
 * @returns {string[]} Compiled list
 */
function getDistinctSortedList(items) {
  const distinctItems = [...new Set(items)]
    .filter((item) => item !== undefined);
  return distinctItems.sort();
}

/**
 * Fetch and filter talks for talk archive.
 */
export default class TalkArchive {
  /**
   * @typedef {import('./QueryIndexItem').default} QueryIndexItem
   * @type {QueryIndexItem[]}
   */
  talks;

  /**
   * @param {QueryIndexItem[]} items data array from query-index.json
   */
  constructor(talks) {
    this.talks = talks;
  }

  /**
   * Get all tag filter options.
   * @returns {string[]} Tag names
   */
  getTagFilterOptions() {
    return getDistinctSortedList(this.talks.flatMap((talk) => talk.getTags()));
  }

  /**
   * Get all tag filter options.
   * @returns {string[]} Tag names
   */
  getYearFilterOptions() {
    return getDistinctSortedList(this.talks.map((talk) => getYearFromPath(talk.path)))
      .reverse();
  }

  /**
   * Get all tag filter options.
   * @returns {string[]} Tag names
   */
  getSpeakerFilterOptions() {
    return getDistinctSortedList(this.talks.flatMap((talk) => talk.getSpeakers()));
  }

  getFilteredTalks() {
    // TODO: implement filtering
    return this.talks;
  }
}

/**
 * Get Query Index based on query-index.json.
 */
export async function getTalkArchive() {
  const queryIndex = await getQueryIndex();
  return new TalkArchive(queryIndex.getAllTalks());
}
