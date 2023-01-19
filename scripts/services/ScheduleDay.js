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

  /**
   * @typedef {import('./ScheduleEntry').default} ScheduleEntry
   * @type {ScheduleEntry[]} Schedule entries
   */
  entries;
}
