import {
  decorateBlock,
  getMetadata,
  loadBlocks,
  readBlockConfig,
} from '../../scripts/lib-franklin.js';
import { getScheduleData } from '../../scripts/services/ScheduleData.js';
import { formatDateFull, formatTime } from '../../scripts/utils/datetime.js';
import { append } from '../../scripts/utils/dom.js';
import { parseCSVArray } from '../../scripts/utils/metadata.js';
import { getArchivePage, getSiteRoot } from '../../scripts/utils/site.js';

/**
 * Build talk tags (with link to talk archive).
 * @param {Element} parent
 * @param {string} siteRoot
 */
function buildTalkTags(parent, siteRoot) {
  const tags = parseCSVArray(getMetadata('article:tag'));
  if (tags.length === 0) {
    return;
  }

  const ul = append(parent, 'ul', 'talk-tags');
  tags.forEach((tag) => {
    const li = append(ul, 'li');
    const a = append(li, 'a');
    a.href = `${getArchivePage(document.location.pathname)}#${siteRoot.substring(1)}${tag}`;
    a.textContent = tag;
  });
}

/**
 * Build talk schedule time info.
 * @typedef {import('../../scripts/services/scheduleEntry').default} scheduleEntry
 * @param {Element} parent
 * @param {scheduleEntry} entry
 */
function buildTimeInfo(parent, entry) {
  const p = append(parent, 'p');
  p.append(`${formatDateFull(entry.start)} ${formatTime(entry.start)} - ${formatTime(entry.end)}`);
  p.append(` (${entry.duration} min`);
  if (entry.durationFAQ > 0) {
    p.append(` + ${entry.durationFAQ} min FAQ`);
  }
  p.append(')');
}

/**
 * Build talk video (via embed block).
 * @param {Element} parent
 */
function buildVideo(parent) {
  const video = getMetadata('video');
  if (!video) {
    return;
  }

  const block = append(parent, 'div', 'embed');
  const a = append(block, 'a');
  a.href = video;
  a.textContent = video;
  decorateBlock(block);
  loadBlocks(parent);
}

/**
 * Talk detail before outline: Tags, time info and video.
 * @param {Element} block
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // get schedule entry for talk
  const siteRoot = getSiteRoot(document.location.pathname);
  const scheduleDataUrl = cfg.scheduledataurl || `${siteRoot}schedule-data.json`;
  const queryIndexUrl = cfg.queryindexurl || '/query-index.json';
  const scheduleData = await getScheduleData(scheduleDataUrl, queryIndexUrl);
  const scheduleEntry = scheduleData.getTalkEntry(cfg.talkpath || document.location.pathname);

  buildTalkTags(block, siteRoot);
  if (scheduleEntry) {
    buildTimeInfo(block, scheduleEntry);
  }
  buildVideo(block);
  append(block, 'h4').textContent = 'Outline';
}
