import { append } from '../../scripts/utils/dom.js';
import { createOptimizedPicture, getMetadata } from '../../scripts/aem.js';
import { getQueryIndex } from '../../scripts/services/QueryIndex.js';
import { parseCSVArray } from '../../scripts/utils/metadata.js';
import { getSiteRootPath, getSpeakerDetailPath } from '../../scripts/utils/site.js';
import { decorateAnchors } from '../../scripts/services/LinkHandler.js';

/**
 * List talk speakers.
 * @typedef {import('../../scripts/services/QueryIndex').default} QueryIndex
 * @param {Element} parent
 * @param {string} siteRootPath
 * @param {QueryIndex} queryIndex
 */
function buildSpeakers(parent, siteRootPath, queryIndex) {
  const speakers = parseCSVArray(getMetadata('speakers'))
    .map((speaker) => queryIndex.getSpeaker(speaker, siteRootPath))
    .filter((speakerItem) => speakerItem !== undefined);
  if (speakers.length === 0) {
    return;
  }

  append(parent, 'h4').textContent = 'Speakers';
  const ul = append(parent, 'ul', 'speakers');
  speakers.forEach((speakerItem) => {
    const li = append(ul, 'li');
    const speakerUrl = getSpeakerDetailPath(speakerItem, siteRootPath);

    const imageAnchor = append(li, 'a');
    imageAnchor.href = speakerUrl;
    if (speakerItem.image) {
      imageAnchor.append(createOptimizedPicture(
        speakerItem.image,
        speakerItem.title,
        false,
        [{ width: '150' }],
      ));
    } else {
      const img = append(imageAnchor, 'img');
      img.src = '/resources/img/speaker_placeholder.svg';
      img.alt = speakerItem.title;
    }

    const a = append(li, 'a');
    a.href = speakerUrl;
    a.textContent = speakerItem.title;

    if (speakerItem.affiliation) {
      li.append(`, ${speakerItem.affiliation}`);
    }
  });
}

/**
 * Build link item.
 * @param {Element} ul
 * @param {string} className
 * @param {string} href
 * @param {string} title
 */
function buildLinkItem(ul, className, href, title) {
  if (!href) {
    return;
  }
  const li = append(ul, 'li', className);
  const a = append(li, 'a');
  a.href = href;
  a.textContent = title;
}

/**
 * List talk presentation download and other links.
 * @param {Element} parent
 */
function buildLinks(parent) {
  const presentationLink = getMetadata('presentation');
  const sourceCodeLink = getMetadata('source-code');
  const videoLink = getMetadata('video-link');
  if (!presentationLink && !sourceCodeLink && !videoLink) {
    return;
  }

  const ul = append(parent, 'ul', 'talk-links');
  buildLinkItem(ul, 'download', presentationLink, 'Presentation download');
  buildLinkItem(ul, 'code', sourceCodeLink, 'Source code');
  buildLinkItem(ul, 'video', videoLink, 'Video');
  decorateAnchors(parent);
}

/**
 * Talk detail after outline: speakers and links.
 * @param {Element} block
 */
export default async function decorate(block) {
  const siteRootPath = getSiteRootPath(window.location.pathname);
  const queryIndex = await getQueryIndex();

  buildSpeakers(block, siteRootPath, queryIndex);
  buildLinks(block);
}
