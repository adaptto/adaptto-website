import { getMetadata } from '../../scripts/aem.js';
import { getQueryIndex } from '../../scripts/services/QueryIndex.js';
import { append } from '../../scripts/utils/dom.js';
import { removeTitleSuffix } from '../../scripts/utils/metadata.js';
import { getYearFromPath } from '../../scripts/utils/path.js';
import { getSiteRootPathAlsoForSpeakerPath, getSpeakerOverviewPath } from '../../scripts/utils/site.js';

/**
 * Add speaker metadata.
 * @param {Element} parent
 */
function addSpeakerMetadata(parent) {
  const h1 = parent.querySelector('h1');
  if (!h1) {
    return;
  }

  const div = document.createElement('div');
  div.classList.add('speaker-data');
  h1.insertAdjacentElement('afterend', div);

  const twitter = getMetadata('twitter');
  if (twitter) {
    const twitterDiv = append(div, 'div', 'twitter');
    const a = append(twitterDiv, 'a');
    a.href = `https://twitter.com/${twitter}`;
    a.target = '_blank';
    a.textContent = twitter;
  }

  const affiliation = getMetadata('affiliation');
  if (affiliation) {
    const affiliationDiv = append(div, 'div', 'affiliation');
    affiliationDiv.textContent = affiliation;
  }
}

/**
 * Add a single list of talks.
 * @typedef {import('../../scripts/services/QueryIndexItem').default} QueryIndexItem
 * @param {Element} parent Parent element
 * @param {QueryIndexItem[]} talkItems Talk items
 * @param {string} title Headline title
 */
function addTalkList(parent, talkItems, title) {
  if (talkItems.length === 0) {
    return;
  }
  append(parent, 'h4').textContent = title;
  const ul = append(parent, 'ul');
  talkItems.forEach((item) => {
    const li = append(ul, 'li');
    const a = append(li, 'a');
    a.href = item.path;
    a.textContent = removeTitleSuffix(item.title);
    li.append(` (${getYearFromPath(item.path)})`);
  });
}

/**
 * Add talk overview.
 * @param {Element} parent
 */
async function addTalkOverview(parent) {
  const queryIndex = await getQueryIndex();
  const speakerItem = queryIndex.getItem(window.location.pathname);
  if (!speakerItem) {
    return;
  }
  const talks = queryIndex.getTalksForSpeaker(speakerItem);
  if (talks.length === 0) {
    return;
  }
  const siteRoot = await getSiteRootPathAlsoForSpeakerPath(
    window.location.pathname,
    window.location.hash,
  );

  const talksThisYear = talks.filter((item) => item.path.indexOf(siteRoot) === 0);
  const talksOtherYears = talks.filter((item) => item.path.indexOf(siteRoot) !== 0);

  const div = append(parent, 'div', 'talk-list');
  addTalkList(div, talksThisYear, 'Talks from this year');
  addTalkList(div, talksOtherYears, 'Talks from other years');

  // back to speaker overview link
  const p = append(parent, 'p');
  const backLink = append(p, 'a');
  backLink.href = getSpeakerOverviewPath(siteRoot);
  backLink.textContent = 'Back to speaker overview';
}

/**
 * Speaker Detail.
 * @param {Element} block
 */
export default async function decorate(block) {
  addSpeakerMetadata(block);
  addTalkOverview(block);

  // react to stage changes via hash
  window.addEventListener('hashchange', () => {
    window.location.reload();
  });
}
