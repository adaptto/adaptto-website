// eslint-disable-next-line no-unused-vars
import ScheduleEntry from './ScheduleEntry.js';

/**
 * Describes a schedule day.
 */
export default class ScheduleDay {
  /** @type {number} Day number */
  day;

  /** @type {Date} Start time */
  start;

  /** @type {Date} End time */
  end;

  /** @type {ScheduleEntry} Schedule entries */
  entries;
}
