const locale = 'en-GB';
const timeOptions = { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' };
const dateFullOptions = { dateStyle: 'full' };
const datePatternWithoutComma = /^(\w+) (\d+ \w+ \d+)$/;

/**
 * Format date in full format.
 * Example: Monday, 27 September 2021
 * @param {Date} date Date value
 * @returns {string} Formatted date
 */
export function formatDateFull(date) {
  const formattedDate = date.toLocaleDateString(locale, dateFullOptions);
  // insert comma after day name if not already present
  const match = datePatternWithoutComma.exec(formattedDate);
  if (match) {
    return `${match[1]}, ${match[2]}`;
  }
  return formattedDate;
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
