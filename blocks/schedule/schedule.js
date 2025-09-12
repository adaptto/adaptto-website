import { append } from '../../scripts/utils/dom.js';
import { getScheduleData } from '../../scripts/services/ScheduleData.js';
import { getSiteRootPath } from '../../scripts/utils/site.js';
import { formatDateFull, formatTime } from '../../scripts/utils/datetime.js';

const dayIdPattern = /^#day-(\d)$/;

/**
 * Gets the active day from current location hash.
 * @returns {number} Active day or undefined.
 */
export function getActiveDayFromHash() {
  const dayIdMatch = window.location.hash.match(dayIdPattern);
  if (dayIdMatch) {
    return parseInt(dayIdMatch[1], 10);
  }
  return undefined;
}

/**
 * Checks if the current date matches with one of the schedule dates and returns
 * that date as active day.
 * @returns Active day or undefined.
 */
export async function getActiveDateFromCurrentDate() {
  // load schedule data
  const siteRoot = getSiteRootPath(document.location.pathname);
  const scheduleData = await getScheduleData(`${siteRoot}schedule-data.json`, false);

  const currentDate = new Date().toDateString();
  return scheduleData.getDays().filter((day) => day.start.toDateString() === currentDate)[0]?.day;
}

/**
 * Displays schedule for given day.
 * @param {Element} block
 * @param {number} day
 */
function displayDay(block, day) {
  block.querySelectorAll('a.active').forEach((a) => a.classList.remove('active'));
  block.querySelector(`a[rel="id-day-${day}"]`)?.classList.add('active');
  block.querySelectorAll('.tab-content.active').forEach((div) => div.classList.remove('active'));
  block.querySelector(`#id-day-${day}`)?.classList.add('active');
}

/**
 * Build tab navigation links.
 * @typedef {import('../../scripts/services/ScheduleDay').default} ScheduleDay
 * @param {Element} element
 * @param {ScheduleDay[]} days
 * @param {number} activeDay
 */
function buildTabNavigation(parent, days, activeDay) {
  const tabNav = append(parent, 'div', 'tab-navigation');
  days.forEach((day) => {
    const link = append(tabNav, 'a');
    link.href = `#day-${day.day}`;
    link.rel = `id-day-${day.day}`;
    link.textContent = `Day ${day.day}`;
    if (day.day === activeDay) {
      link.classList.add('active');
    }

    link.addEventListener('click', (e) => {
      e.preventDefault();
      displayDay(parent, day.day);
      window.history.pushState(null, null, `#day-${day.day}`);
    });
  });
}

/**
 * Build schedule entry cells markup.
 * @typedef {import('../../scripts/services/ScheduleEntry').default} ScheduleEntry
 * @param {Element} tr
 * @param {ScheduleEntry} entry
 * @param {number} colSpan
 * @param {boolean} speakerColumn
 * @param {string} cellTag Cell tag, e.g. 'td'
 */
function buildDayEntryCells(tr, entry, colSpan, speakerColumn, cellTag) {
  // time
  const tdTime = append(tr, cellTag, 'time');
  append(tdTime, 'time').textContent = formatTime(entry.start);
  tdTime.append(' - ');
  append(tdTime, 'time').textContent = formatTime(entry.end);

  // title & link
  const tdTitle = append(tr, cellTag, 'title');
  if (colSpan > 1) {
    tdTitle.setAttribute('colspan', colSpan);
  }
  if (entry.talkPath) {
    const link = append(tdTitle, 'a');
    link.href = entry.talkPath;
    link.textContent = entry.title;
  } else {
    tdTitle.textContent = entry.title;
  }

  // speaker
  if (speakerColumn) {
    append(tr, cellTag, 'speaker').textContent = entry.speakers.join(', ');
  } else {
    append(tdTitle, 'div', 'speaker').textContent = entry.speakers.join(', ');
  }
}

/**
 * Build schedule entry row markup.
 * @typedef {import('../../scripts/services/ScheduleEntry').default} ScheduleEntry
 * @param {Element} tbody
 * @param {ScheduleEntry[]} entries Entries, possible multiple parallel
 * @param {number} trackCount Max. number of parallel tracks this day
 * @param {string} rowTag Row tag, e.g. 'tr'
 * @param {string} cellTag Cell tag, e.g. 'td'
 */
export function buildDayEntryRow(tbody, entries, trackCount, rowTag = 'tr', cellTag = 'td') {
  const tr = append(tbody, rowTag, entries[0].type);

  entries.forEach((entry) => {
    const colSpan = (trackCount - entries.length) * 2 + 1;
    buildDayEntryCells(tr, entry, colSpan, trackCount === 1, cellTag);
  });
}

/**
 * Build grouped entries for a schedule day.
 * @param {ScheduleEntry[]} entries
 * @returns {ScheduleEntry[][]}
 */
export function buildGroupedEntries(entries) {
  let trackCount = 1;
  const groupedEntries = [];
  entries.forEach((entry) => {
    if (entry.track > 0) {
      if (entry.track === 1) {
        const parallelEntries = [entry,
          ...entries.filter((e) => e.start.getTime() === entry.start.getTime() && e.track > 1)];
        if (parallelEntries.length > trackCount) {
          trackCount = parallelEntries.length;
        }
        groupedEntries.push(parallelEntries);
      }
    } else {
      groupedEntries.push([entry]);
    }
  });
  return groupedEntries;
}

/**
 * Build schedule markup for day.
 * @typedef {import('../../scripts/services/ScheduleDay').default} ScheduleDay
 * @param {Element} parent
 * @param {ScheduleDay} day
 * @param {number} activeDay
 */
function buildDaySchedule(parent, day, activeDay) {
  const tabContent = append(parent, 'div', 'tab-content');
  tabContent.id = `id-day-${day.day}`;
  if (day.day === activeDay) {
    tabContent.classList.add('active');
  }

  // parallelize entries with multiple tracks
  const groupedEntries = buildGroupedEntries(day.entries);
  const trackCount = Math.max(...groupedEntries.map((e) => e.length));

  // show date
  const h4 = append(tabContent, 'h4');
  const date = append(h4, 'date');
  date.setAttribute('datetime', day.start.toISOString().substring(0, 10));
  date.textContent = formatDateFull(day.start);

  // table header
  const table = append(tabContent, 'table');
  const thead = append(table, 'thead');
  const tr = append(thead, 'tr');
  append(tr, 'th', 'time').textContent = 'Time';
  append(tr, 'th', 'title').textContent = 'Topic';
  if (trackCount === 1) {
    append(tr, 'th', 'speaker').textContent = 'Speaker';
  }

  // table content
  const tbody = append(table, 'tbody');
  groupedEntries.forEach((entries) => buildDayEntryRow(tbody, entries, trackCount));
}

/**
 * Render schedule.
 * @param {Element} block Block
 * @param {number} activeDay Active day
 * @param {boolean} forceReload Force data reload
 */
async function renderSchedule(block, activeDay, forceReload) {
  // load schedule data
  const siteRoot = getSiteRootPath(document.location.pathname);
  const scheduleData = await getScheduleData(`${siteRoot}schedule-data.json`, forceReload);

  // render schedule
  block.textContent = '';
  const days = scheduleData.getDays();
  if (days.length > 0) {
    buildTabNavigation(block, days, activeDay);
    days.forEach((day) => buildDaySchedule(block, day, activeDay));
  }
}

/**
 * Detect active day from hash. If no hash is present, derive active day from current date
 * and update hash.
 * @returns {number} Active day
 */
export async function detectActiveDay() {
  let activeDay = getActiveDayFromHash();
  if (!activeDay) {
    activeDay = await getActiveDateFromCurrentDate() ?? 1;
    window.history.replaceState(null, null, `#day-${activeDay}`);
  }
  return activeDay;
}

/**
 * Builds schedule based on schedule-data sheet.
 * @param {Element} block
 */
export default async function decorate(block) {
  // detect active day
  const activeDay = await detectActiveDay();

  // react to stage changes via hash
  window.addEventListener('hashchange', () => {
    const day = getActiveDayFromHash();
    if (day) {
      displayDay(block, day);
    }
  });

  // render schedule
  await renderSchedule(block, activeDay, false);
}
