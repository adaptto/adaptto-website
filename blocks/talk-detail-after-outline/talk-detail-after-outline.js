import { append } from '../../scripts/utils/dom.js';
import { createOptimizedPicture, getMetadata } from '../../scripts/lib-franklin.js';
import { getQueryIndex } from '../../scripts/services/QueryIndex.js';
import { parseCSVArray } from '../../scripts/utils/metadata.js';
import { getSiteRootPath, getSpeakerOverviewPath } from '../../scripts/utils/site.js';
import { getDocumentName } from '../../scripts/utils/path.js';

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
    const speakerUrl = `${getSpeakerOverviewPath(window.location.pathname)}#${getDocumentName(speakerItem.path)}`;

    if (speakerItem.image) {
      const imageAnchor = append(li, 'a');
      imageAnchor.href = speakerUrl;
      imageAnchor.append(createOptimizedPicture(
        speakerItem.image,
        speakerItem.title,
        false,
        [{ width: '150' }],
      ));
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
