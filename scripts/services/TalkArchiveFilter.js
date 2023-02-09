/**
 * Filter criteria for talk archive.
 */
export default class TalkArchiveFilter {
  /**
   * Filter by tags.
   * @type {string[]}
   */
  tags;

  /**
   * Filter by years.
   * @type {string[]}
   */
  years;

  /**
   * Filter by speaker names.
   * @type {string[]}
   */
  speakers;

  /**
   * Filter by full text search.
   * @type {string}
   */
  fullText;

  /**
   * @typedef {import('./TalkArchiveItem').default} TalkArchiveItem
   * @param {TalkArchiveItem} talk Talk
   * @returns {boolean} true if talk matches
   */
  matches(talk) {
    if (this.tags) {
      if (!this.tags.find((tag) => talk.tags.includes(tag))) {
        return false;
      }
    }
    if (this.years) {
      if (!this.years.includes(talk.year)) {
        return false;
      }
    }
    if (this.speakers) {
      if (!this.speakers.find((speaker) => talk.speakers.includes(speaker))) {
        return false;
      }
    }
    return true;
  }
}
