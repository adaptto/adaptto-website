/**
 * Converts talk to indexable string.
 * @typedef {import('./TalkArchiveItem').default} TalkArchiveItem
 * @param {TalkArchiveItem} talk
 */
function talkToText(talk) {
  return [
    talk.title ?? '',
    talk.description ?? '',
    talk.keywords.join(', '),
    talk.tags.join(', '),
    talk.speakers.join(', '),
  ].join('\n');
}

/**
 * Full text index for talk archive.
 * This implements a very simplistic approach by just checking for appearance of
 * search string in talk properties.
 */
export default class TalkArchiveFullTextIndex {
  /**
   * @type {object[]}
   */
  index;

  /**
   * @typedef {import('./TalkArchiveItem').default} TalkArchiveItem
   * @param {TalkArchiveItem[]} talks Talks
   */
  constructor(talks) {
    this.index = talks.map((talk) => ({ talk, text: talkToText(talk).toLocaleLowerCase() }));
  }

  /**
   * Execute full text search.
   * @typedef {import('./TalkArchiveItem').default} TalkArchiveItem
   * @param {string} text Search text
   * @returns {TalkArchiveItem[]} Search result
   */
  search(text) {
    const searchText = text.toLocaleLowerCase();
    return this.index
      .filter((item) => item.text.includes(searchText))
      .map((item) => item.talk);
  }
}
