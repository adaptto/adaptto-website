import { convertSheetDateValue } from '../utils/datetime.js';
import { getFetchCacheOptions, getFetchCacheOptionsForceReload } from '../utils/fetch.js';
import { parseCSVArray, removeTitleSuffix } from '../utils/metadata.js';
import { getPathName, isUrlOrPath } from '../utils/path.js';
import { getQueryIndex } from './QueryIndex.js';
import ScheduleDay from './ScheduleDay.js';
import ScheduleEntry from './ScheduleEntry.js';

const validEntryTypes = ['day', 'talk', 'break', 'other'];

/**
 * Calculate scheduling data bases on yearly schedule-data.json and query-index.json.
 */
export default class ScheduleData {
  /** @type {ScheduleDay[]} */
  days;

  /**
   * @param {ScheduleDay[]} days Schedule days
   */
  constructor(days) {
    this.days = days;
  }

  /**
   * @returns {ScheduleDay[]} All days described in schedule
   */
  getDays() {
    return this.days;
  }

  /**
   * @param {string} path Path to talk detail page
   * @returns {ScheduleEntry}
   */
  getTalkEntry(path) {
    return this.days.flatMap((day) => day.entries)
      .find((entry) => entry.talkPath === path);
  }
}

/**
 * Resolve talk detail reference to query index item.
 * @typedef {import('./QueryIndex').default} QueryIndex
 * @typedef {import('./QueryIndexItem').default} QueryIndexItem
 * @param {string} talkDetailRef Title from schedule sheet which should point to a talk detail page.
 *   This may be only a document name
 * @param {number} year Current year
 * @param {QueryIndex} queryIndex
 * @returns {QueryIndexItem} Query index item or undefined
 */
function getTalkQueryIndexItem(talkDetailRef, year, queryIndex) {
  let path;
  if (isUrlOrPath(talkDetailRef)) {
    path = getPathName(talkDetailRef);
  } else {
    path = `/${year}/schedule/${talkDetailRef}`;
  }
  return queryIndex.getItem(path);
}

/**
 * Transforms schedule data item to schedule entry.
 * @typedef {import('./QueryIndex').default} QueryIndex
 * @param {object} item
 * @param {QueryIndex} queryIndex
 * @returns {ScheduleEntry}
 */
function toEntry(item, queryIndex) {
  const day = parseInt(item.Day, 10) || 0;
  const track = parseInt(item.Track, 10) || 0;
  const startTime = parseFloat(item.Start) || 0;
  const endTime = parseFloat(item.End) || 0;
  let title = item.Entry;
  const duration = parseInt(item.Duration, 10) || 0;
  const durationFAQ = parseInt(item.FAQ, 10) || 0;
  const type = item.Type;
  let speakers = parseCSVArray(item.Speakers);

  // validate entry
  if (day === 0 || startTime === 0 || endTime === 0 || !title || duration === 0
    || !validEntryTypes.includes(type)) {
    return undefined;
  }

  // convert dates
  const start = convertSheetDateValue(startTime);
  const end = convertSheetDateValue(endTime);

  // resolve talk path and title, speakers from query index
  let talkPath;
  if (type === 'talk') {
    const indexItem = getTalkQueryIndexItem(title, start.getFullYear(), queryIndex);
    if (!indexItem) {
      return undefined;
    }
    talkPath = indexItem.path;
    title = removeTitleSuffix(indexItem.title);
    if (speakers.length === 0) {
      speakers = indexItem.getSpeakers();
    }
  }

  return Object.assign(new ScheduleEntry(), {
    day,
    track,
    start,
    end,
    title,
    duration,
    durationFAQ,
    type,
    speakers,
    talkPath,
  });
}

/**
 * Transforms schedule data to days and entries.
 * @typedef {import('./QueryIndex').default} QueryIndex
 * @param {object[]} scheduleData
 * @param {QueryIndex} queryIndex
 * @returns {ScheduleDay[]}
 */
function toDays(scheduleData, queryIndex) {
  // transform and collect entries per day (ignore 'day' entries)
  const entriesPerDay = new Map();
  scheduleData.forEach((item) => {
    const entry = toEntry(item, queryIndex);
    if (entry && entry.type !== 'day') {
      let entries = entriesPerDay.get(entry.day);
      if (!entries) {
        entries = [];
        entriesPerDay.set(entry.day, entries);
      }
      entries.push(entry);
    }
  });

  // build day objects
  return Array.from(entriesPerDay.values())
    .map((entries) => Object.assign(new ScheduleDay(), {
      day: entries[0].day,
      start: entries.reduce((min, e) => (e.start < min ? e.start : min), entries[0].start),
      end: entries.reduce((max, e) => (e.end > max ? e.end : max), entries[0].start),
      entries,
    }));
}

/**
 * @param {string} scheduleDataUrl Url to schedule-data.json
 * @param {boolean} forceReload Force reload of data
 */
export async function getScheduleData(scheduleDataUrl, forceReload) {
  let scheduleData;
  const cacheOptions = forceReload ? getFetchCacheOptionsForceReload() : getFetchCacheOptions();
  const resp = await fetch(scheduleDataUrl, cacheOptions);
  if (resp.ok) {
    const json = await resp.json();
    scheduleData = json.data;
  }
  const queryIndex = await getQueryIndex();
  const days = toDays(scheduleData || [], queryIndex);
  return new ScheduleData(days);
}
