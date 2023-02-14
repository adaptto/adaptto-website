import { removeTitleSuffix } from '../utils/metadata.js';
import { getYearFromPath } from '../utils/path.js';
import { getQueryIndex } from './QueryIndex.js';
import TalkArchiveFullTextIndex from './TalkArchiveFullTextIndex.js';
import TalkArchiveItem from './TalkArchiveItem.js';

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
   * @typedef {import('./TalkArchiveFilter').default} TalkArchiveFilter
   * @type {TalkArchiveFilter}
   */
  filter;

  /**
   * @type {TalkArchiveItem[]}
   */
  talks;

  /**
   * @type {TalkArchiveItem[]}
   */
  filteredTalks;

  /**
   * @typedef {import('./TalkArchiveFullTextIndex').default} TalkArchiveFullTextIndex
   * @type {TalkArchiveFullTextIndex}
   */
  index;

  /**
   * @typedef {import('./QueryIndex').default} QueryIndex
   * @param {QueryIndex} queryIndex Query index
   */
  constructor(queryIndex) {
    this.talks = queryIndex.getAllTalks()
      .map((item) => {
        const talk = new TalkArchiveItem();
        talk.path = item.path;
        talk.year = getYearFromPath(item.path)?.toString();
        talk.title = removeTitleSuffix(item.title);
        talk.description = item.description;
        talk.keywords = item.getKeywords();
        talk.tags = item.getTags();
        talk.speakers = item.getSpeakers();
        return talk;
      })
      .filter((talk) => talk.speakers.length > 0);
    this.filteredTalks = this.talks;
  }

  /**
   * @typedef {import('./TalkArchiveFilter').default} TalkArchiveFilter
   * @param {TalkArchiveFilter} filter
   */
  applyFilter(filter) {
    this.filter = filter;
    if (filter) {
      this.filteredTalks = this.talks.filter((talk) => filter.matches(talk));
    } else {
      this.filteredTalks = this.talks;
    }
    this.index = undefined;
  }

  /**
   * Get all talks matching the current filter criteria.
   * @returns {TalkArchiveItem[]} Talk items
   */
  getFilteredTalks() {
    return this.filteredTalks;
  }

  /**
   * Get all talks matching the current filter criteria and the given fill text expression.
   * @param {string} fullText Full text expression
   * @returns {TalkArchiveItem[]} Talk items
   */
  getFilteredTalksFullTextSearch(fullText) {
    if (!this.index) {
      this.index = new TalkArchiveFullTextIndex(this.filteredTalks);
    }
    return this.index.search(fullText);
  }

  /**
   * Get all tag filter options, sorted ascending.
   * @returns {string[]} Tag names
   */
  getTagFilterOptions() {
    return getDistinctSortedList(this.talks
      .flatMap((talk) => talk.tags));
  }

  /**
   * Get all year filter options, sorted descending.
   * @returns {string[]} Years
   */
  getYearFilterOptions() {
    return getDistinctSortedList(this.talks
      .map((talk) => talk.year))
      .reverse();
  }

  /**
   * Get all speaker filter options, sorted ascending.
   * @returns {string[]} Speaker names
   */
  getSpeakerFilterOptions() {
    return getDistinctSortedList(this.talks
      .flatMap((talk) => talk.speakers));
  }
}

/**
 * Get Query Index based on query-index.json.
 */
export async function getTalkArchive() {
  const queryIndex = await getQueryIndex();
  return new TalkArchive(queryIndex);
}
