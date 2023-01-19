/**
 * Describes a schedule entry.
 */
export default class ScheduleEntry {
  /** @type {number} Day number */
  day;

  /** @type {number} Track number */
  track;

  /** @type {Date} Start time */
  start;

  /** @type {Date} End time */
  end;

  /** @type {string} Talk/Entry title */
  title;

  /** @type {number} Duration of talk (without FAQ) in minutes */
  duration;

  /** @type {number} Duration of FAQ in minutes */
  durationFAQ;

  /** @type {string} Entry type: talk, break, other */
  type;

  /** @type {string[]} Speaker names */
  speakers;

  /** @type {string} Path to talk detail page */
  talkPath;
}
