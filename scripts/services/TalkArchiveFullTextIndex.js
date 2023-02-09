import Index from '../3rdparty/flexsearch/index.js';
import lang from '../3rdparty/flexsearch/lang/en.js';
import charset from '../3rdparty/flexsearch/lang/latin/advanced.js';

/**
 * Converts talk to indexable string.
 * @typedef {import('./TalkArchiveItem').default} TalkArchiveItem
 * @param {TalkArchiveItem} talk
 */
function talkToText(talk) {
  return [
    talk.title,
    talk.description,
    talk.keywords.join(', '),
    talk.tags.join(', '),
    talk.speakers.join(', '),
  ].join('\n');
}

/**
 * Full text index for talk archive.
 */
export default class TalkArchiveFullTextIndex {
  /**
   * @typedef {import('./TalkArchiveItem').default} TalkArchiveItem
   * @type {TalkArchiveItem[]}
   */
  talks;

  /**
   * @type {Index}
   */
  index;

  /**
   * @typedef {import('./TalkArchiveItem').default} TalkArchiveItem
   * @param {TalkArchiveItem[]} talks Talks
   */
  constructor(talks) {
    this.talks = talks;
    this.index = new Index({
      charset,
      lang,
    });
    talks.forEach((talk, talkIndex) => this.index.add(talkIndex, talkToText(talk)));
  }

  /**
   * Execute full text search.
   * @typedef {import('./TalkArchiveItem').default} TalkArchiveItem
   * @param {string} text Search text
   * @returns {TalkArchiveItem[]} Search result
   */
  search(text) {
    return this.index.search(text)
      .map((index) => this.talks[index]);
  }
}
