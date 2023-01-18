import { append } from '../../scripts/dom-utils.js';
import { readBlockConfig } from '../../scripts/lib-franklin.js';
import { getScheduleData } from '../../scripts/ScheduleData.js';
import { getSiteRoot } from '../../scripts/site-utils.js';

const dayIdPattern = /^#day-(\d)$/;

/**
 * Gets the active day from current location hash.
 * @returns {number} Active day or undefined.
 */
function getActiveDayFromHash() {
  const dayIdMatch = window.location.hash.match(dayIdPattern);
  if (dayIdMatch) {
    return parseInt(dayIdMatch[1], 10);
  }
  return undefined;
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
 * @typedef {import('../../scripts/ScheduleDay').default} ScheduleDay
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
 * Build schedule entry row markup.
 * @typedef {import('../../scripts/ScheduleEntry').default} ScheduleEntry
 * @param {Element} tbody
 * @param {ScheduleEntry} entry
 */
function buildDayEntryRow(tbody, entry) {
  const tr = append(tbody, 'tr', entry.type);

  // time
  const tdTime = append(tr, 'td');
  const timeOptions = { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' };
  append(tdTime, 'time').textContent = entry.start.toLocaleTimeString('en-GB', timeOptions);
  tdTime.append(' - ');
  append(tdTime, 'time').textContent = entry.start.toLocaleTimeString('en-GB', timeOptions);

  // title & link
  const tdTitle = append(tr, 'td');
  if (entry.talkPath) {
    const link = append(tdTitle, 'a');
    link.href = entry.talkPath;
    link.textContent = entry.title;
  } else {
    tdTitle.textContent = entry.title;
  }

  // speaker
  append(tr, 'td').textContent = entry.speakers.join(', ');
}

/**
 * Build schedule markup for day.
 * @typedef {import('../../scripts/ScheduleDay').default} ScheduleDay
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

  // show date
  const dateOptions = { dateStyle: 'full' };
  const h4 = append(tabContent, 'h4');
  const date = append(h4, 'date');
  date.setAttribute('datetime', day.start.toISOString().substring(0, 10));
  date.textContent = day.start.toLocaleDateString('en-GB', dateOptions);

  // table header
  const table = append(tabContent, 'table');
  const thead = append(table, 'thead');
  const tr = append(thead, 'tr');
  append(tr, 'th').textContent = 'Time';
  append(tr, 'th').textContent = 'Topic';
  append(tr, 'th').textContent = 'Speaker';

  // table content
  const tbody = append(table, 'tbody');
  day.entries.forEach((entry) => buildDayEntryRow(tbody, entry));
}

/**
 * Builds schedule based on schedule-data sheet.
 * @param {Element} block
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // load schedule data
  const siteRoot = getSiteRoot(document.location.pathname);
  const scheduleDataUrl = cfg.scheduledataurl || `${siteRoot}schedule-data.json`;
  const queryIndexUrl = cfg.queryindexurl || '/query-index.json';
  const scheduleData = await getScheduleData(scheduleDataUrl, queryIndexUrl);

  // detect active day
  let activeDay = getActiveDayFromHash();
  if (!activeDay) {
    activeDay = 1;
    window.history.replaceState(null, null, `#day-${activeDay}`);
  }

  // react to stage changes via hash
  window.addEventListener('hashchange', () => {
    const day = getActiveDayFromHash();
    if (day) {
      displayDay(block, day);
    }
  });

  // render schedule
  const days = scheduleData.getDays();
  if (days.length > 0) {
    buildTabNavigation(block, days, activeDay);
    days.forEach((day) => buildDaySchedule(block, day, activeDay));
  }
}
