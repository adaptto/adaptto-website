// match e.g. with " - adaptTo() 2023"
// but also with ", adaptTo() 2023" which seems to be generated sometimes due to a bug
const titleSuffixPattern = /^(.+)(\s-|,)\s+adaptTo\(\)\s+\d+\s*$/;

/**
 * Splits a comma-separated value to array (trimming the values).
 * @param {string} value Comma-separated value
 * @returns {string[]} Value array
 */
export function parseCSVArray(value) {
  if (value) {
    return value.split(',')
      .map((item) => item.trim())
      .filter((item) => item !== '');
  }
  return [];
}

/**
 * Parses Splits a comma-separated value to array (trimming the values).
 * Falls back to parseCSVArray if string is not valid JSON.
 * @param {string} value JSON array as string
 * @returns {string[]} Value array
 */
export function parseJsonArray(value) {
  if (value) {
    try {
      return JSON.parse(value);
    } catch (e) {
      // fallback
      return parseCSVArray(value);
    }
  }
  return [];
}

/**
 * Removes " - adaptTo() XXXX" suffix from title, if present.
 * @param {string} title Title
 * @returns {string} title Title without suffix
 */
export function removeTitleSuffix(title) {
  if (title) {
    const matchSuffixPattern = title.match(titleSuffixPattern);
    if (matchSuffixPattern) {
      return matchSuffixPattern[1].trim();
    }
  }
  return title;
}
