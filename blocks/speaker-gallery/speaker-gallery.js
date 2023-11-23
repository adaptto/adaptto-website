import { createOptimizedPicture, readBlockConfig } from '../../scripts/aem.js';
import { getQueryIndex } from '../../scripts/services/QueryIndex.js';
import { append } from '../../scripts/utils/dom.js';
import { parseCSVArray } from '../../scripts/utils/metadata.js';
import { getSiteRootPath, getSpeakerDetailPath } from '../../scripts/utils/site.js';

/**
 * Create speaker image (or fallback image);
 * @typedef {import('../../scripts/services/QueryIndexItem').default} QueryIndexItem
 * @param {QueryIndexItem} speakerItem Speaker item
 * @param {boolean} eager Use eager loading for image
 */
function createSpeakerImage(speakerItem, eager) {
  if (speakerItem.image) {
    return createOptimizedPicture(
      speakerItem.image,
      speakerItem.title,
      eager,
      [{ width: '500' }],
    );
  }

  // fallback image
  const img = document.createElement('img');
  img.src = '/resources/img/speaker_placeholder.svg';
  img.alt = speakerItem.title;
  return img;
}

/**
 * Add markup for speaker
 * @typedef {import('../../scripts/services/QueryIndex').default} QueryIndex
 * @param {Element} parent Parent element
 * @param {string} speaker Speaker name or reference
 * @param {number} speakerIndex Index of speaker in list
 * @param {string} siteRootPath Site root path
 * @param {QueryIndex} queryIndex Query index
 */
function addSpeaker(parent, speaker, speakerIndex, siteRootPath, queryIndex) {
  const speakerItem = queryIndex.getSpeaker(speaker, siteRootPath);
  if (!speakerItem) {
    return;
  }

  const speakerUrl = getSpeakerDetailPath(speakerItem, siteRootPath);

  const div = append(parent, 'div', 'speaker');

  const imageAnchor = append(div, 'a');
  imageAnchor.href = speakerUrl;
  const eagerImage = (speakerIndex <= 3); // use eager loading for first 4 speaker images
  imageAnchor.append(createSpeakerImage(speakerItem, eagerImage));

  const nameDiv = append(div, 'div', 'name');
  const a = append(nameDiv, 'a');
  a.href = speakerUrl;
  a.textContent = speakerItem.title;

  if (speakerItem.twitter) {
    const twitterDiv = append(div, 'div', 'twitter');
    const twitterAnchor = append(twitterDiv, 'a');
    twitterAnchor.textContent = speakerItem.twitter;
    twitterAnchor.href = `https://twitter.com/${speakerItem.twitter}`;
  }

  if (speakerItem.affiliation) {
    const affiliationDiv = append(div, 'div', 'affiliation');
    affiliationDiv.textContent = speakerItem.affiliation;
  }
}

/**
 * List speakers.
 * @typedef {import('../../scripts/services/QueryIndex').default} QueryIndex
 * @param {Element} parent Parent element
 * @param {string[]} speakers Speaker names or references
 * @param {string} siteRootPath Site root path
 * @param {QueryIndex} queryIndex Query index
 */
function addSpeakers(parent, speakers, siteRootPath, queryIndex) {
  if (speakers.length === 0) {
    return;
  }

  const div = append(parent, 'div', 'speakers');
  speakers.forEach((speaker, speakerIndex) => addSpeaker(
    div,
    speaker,
    speakerIndex,
    siteRootPath,
    queryIndex,
  ));
}

/**
 * List lightning talk speakers.
 * @param {Element} parent Parent element
 * @param {string[]} speakers Speaker names or references
 * @param {string} siteRootPath Site root path
 * @param {QueryIndex} queryIndex Query index
 */
function addLightningTalkSpeakers(parent, speakers, siteRootPath, queryIndex) {
  if (speakers.length === 0) {
    return;
  }
  const h4 = append(parent, 'h4');
  h4.textContent = 'Additional speakers (Lightning Talks)';

  const div = append(parent, 'div', 'speakers', 'lightning-talk');
  speakers.forEach((speaker, speakerIndex) => addSpeaker(
    div,
    speaker,
    speakerIndex,
    siteRootPath,
    queryIndex,
  ));
}

/**
 * Speaker Gallery.
 * @param {Element} block
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  const siteRoot = getSiteRootPath(document.location.pathname);
  const queryIndex = await getQueryIndex();

  // check for list of speakers from block config
  const speakers = parseCSVArray(cfg.speakers);
  if (speakers.length > 0) {
    addSpeakers(block, speakers, siteRoot, queryIndex);

  // otherwise render gallery with all speakers in the schedule
  } else {
    // get all speakers from schedule
    addSpeakers(block, queryIndex.getTalkSpeakerNames(siteRoot), siteRoot, queryIndex);
    addLightningTalkSpeakers(
      block,
      queryIndex.getLightningTalkSpeakerNames(siteRoot),
      siteRoot,
      queryIndex,
    );
  }
}
