const validFilterCategory = ['tags', 'years', 'speakers'];

/**
 * Builds list of filter options with URI encoding.
 * @param {string[]} items
 * @returns {string} Encoded comma-separated options
 */
function buildHashFilterOptions(items) {
  return items.map((item) => encodeURIComponent(item)).join(',');
}

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

  /**
   * Builds a hash string reflecting the current filter options.
   * @returns {string} Hash string
   */
  buildHash() {
    const filters = [];
    if (this.tags) {
      filters.push(`tags=${buildHashFilterOptions(this.tags)}`);
    }
    if (this.years) {
      filters.push(`years=${buildHashFilterOptions(this.years)}`);
    }
    if (this.speakers) {
      filters.push(`speakers=${buildHashFilterOptions(this.speakers)}`);
    }
    return `#${filters.join('/')}`;
  }
}

/**
 * Build filter options from hash.
 * @param {string} hash Window location hash
 * @returns {TalkArchiveFilter} filter
 */
export function getFilterFromHash(hash) {
  const filter = new TalkArchiveFilter();
  const filterStrings = hash.substring(1).split('/');
  filterStrings.forEach((filterString) => {
    const filterParts = filterString.split('=');
    if (filterParts.length === 2) {
      const filterName = filterParts[0];
      const filterOptions = filterParts[1].split(',').map((item) => decodeURIComponent(item));
      if (validFilterCategory.includes(filterName) && filterOptions.length > 0) {
        filter[filterName] = filterOptions;
      }
    }
  });
  return filter;
}
