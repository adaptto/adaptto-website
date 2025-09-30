import { append } from '../../scripts/utils/dom.js';
import { getScheduleData } from '../../scripts/services/ScheduleData.js';
import { getSiteRootPath } from '../../scripts/utils/site.js';
import { formatDateFull } from '../../scripts/utils/datetime.js';
import {
  buildDayEntryRow,
  buildGroupedEntries,
  detectActiveDay,
  getActiveDayFromHash,
} from '../schedule/schedule.js';

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
 * Gets a timestamp for the given day without date information.
 * @param {Date} date Date
 * @returns {number} Timestamp in seconds from start of the day
 */
function getDayTime(date) {
  const time = date.getHours() * 3600
    + (date.getMinutes() + date.getTimezoneOffset()) * 60
    + date.getSeconds();
  return time;
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

  // detect entries that are active right now (only checking hour, not the day)
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() - (currentDate.getTimezoneOffset() / 60));
  const currentTime = getDayTime(currentDate);
  const currentEntries = day.entries
    .filter((e) => getDayTime(e.start) <= currentTime && getDayTime(e.end) > currentTime);
  const futureEntries = day.entries
    .filter((e) => getDayTime(e.start) > currentTime);

  // parallelize entries with multiple tracks
  let groupedEntries = buildGroupedEntries(day.entries);
  const trackCount = Math.max(...groupedEntries.map((e) => e.length));

  // detect current grouped entries slot and keep only it and the next one
  let currentSlot = groupedEntries
    .findIndex((entries) => currentEntries.some((ce) => entries.includes(ce)));
  if (currentSlot < 0 && futureEntries.length > 0) {
    currentSlot = 0;
  }
  groupedEntries = groupedEntries.slice(currentSlot, currentSlot + 2);

  // show date
  const h4 = append(tabContent, 'h4');
  const date = append(h4, 'date');
  date.setAttribute('datetime', day.start.toISOString().substring(0, 10));
  date.textContent = formatDateFull(day.start);

  // current entry
  if (groupedEntries[0]) {
    const divCurrent = append(tabContent, 'div', 'current-entry');
    append(divCurrent, 'h3').textContent = 'Current running';
    buildDayEntryRow(divCurrent, groupedEntries[0], trackCount, 'div', 'div');
  }

  // next entry
  if (groupedEntries[1]) {
    const divNext = append(tabContent, 'div', 'next-entry');
    append(divNext, 'h3').textContent = 'Next up';
    buildDayEntryRow(divNext, groupedEntries[1], trackCount, 'div', 'div');
  }
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
    days.forEach((day) => buildDaySchedule(block, day, activeDay));
  }
}

/**
 * Enabled an auto-refresh of the schedule data twice each minute.
 * @param {Element} block
 */
function enableAutoRefresh(block) {
  window.setInterval(() => {
    const activeDay = getActiveDayFromHash() ?? 1;
    renderSchedule(block, activeDay, true);
  }, 30000);
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

  enableAutoRefresh(block);
}
