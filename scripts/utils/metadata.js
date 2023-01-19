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
