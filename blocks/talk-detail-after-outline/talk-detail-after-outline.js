import { append } from '../../scripts/utils/dom.js';
import { getMetadata, readBlockConfig } from '../../scripts/lib-franklin.js';
import { getQueryIndex } from '../../scripts/services/QueryIndex.js';
import { parseCSVArray } from '../../scripts/utils/metadata.js';

/**
 * List talk speakers.
 * @typedef {import('../../scripts/services/QueryIndex').default} QueryIndex
 * @param {Element} parent
 * @param {QueryIndex} queryIndex
 */
function buildSpeakers(parent, queryIndex) {
  const speakers = parseCSVArray(getMetadata('speakers'))
    .map((speaker) => queryIndex.getSpeaker(speaker))
    .filter((speakerItem) => speakerItem !== undefined);
  if (speakers.length === 0) {
    return;
  }

  append(parent, 'h4').textContent = 'Speakers';
  const ul = append(parent, 'ul', 'speakers');
  speakers.forEach((speakerItem) => {
    const li = append(ul, 'li');
    li.append(speakerItem.title);
    if (speakerItem.affiliation) {
      li.append(`, ${speakerItem.affiliation}`);
    }
  });
}

/**
 * List talk presentation download and other links.
 * @param {Element} parent
 */
function buildLinks(parent) {
  append(parent, 'div', 'talk-links');
  // TODO: implement
}

/**
 * Talk Detail footer with back to schedule link.
 * @param {Element} block
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  const queryIndex = await getQueryIndex(cfg.queryindexurl || '/query-index.json');

  buildSpeakers(block, queryIndex);
  buildLinks(block);
}
