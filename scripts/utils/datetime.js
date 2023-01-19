const locale = 'en-GB';
const timeOptions = { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' };
const dateFullOptions = { dateStyle: 'full' };

/**
 * Format date in full format.
 * Example: Monday, 27 September 2021
 * @param {Date} date Date value
 * @returns {string} Formatted date
 */
export function formatDateFull(date) {
  return date.toLocaleDateString(locale, dateFullOptions);
}

/**
 * Format time.
 * Example: 10:30.
 * @param {Date} date Date/time value
 * @returns {string} Formatted time
 */
export function formatTime(date) {
  return date.toLocaleTimeString(locale, timeOptions);
}

/**
 * Converts a number counting days since 1/1/1900 as used in Excel/Google Sheets to a date value.
 * @param {float} value Float date value from Excel/Google Sheets
 * @returns {Date} Date value
 */
export function convertSheetDateValue(value) {
  const date = new Date(0);
  date.setUTCMilliseconds(Math.round((value - 25569) * 86400 * 1000));
  return date;
}
