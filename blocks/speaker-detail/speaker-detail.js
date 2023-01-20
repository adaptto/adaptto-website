import { getMetadata } from '../../scripts/lib-franklin.js';
import { getQueryIndex } from '../../scripts/services/QueryIndex.js';
import { append } from '../../scripts/utils/dom.js';
import { getSiteRootPathAlsoForSpeakerPath, getSpeakerOverviewPath, getYearFromPath } from '../../scripts/utils/site.js';

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
    a.textContent = twitter;
  }

  const affiliation = getMetadata('affiliation');
  if (affiliation) {
    const affiliationDiv = append(div, 'div', 'affiliation');
    affiliationDiv.textContent = affiliation;
  }
}

/**
 * Add a talk link list item.
 * @typedef {import('../../scripts/services/QueryIndexItem').default} QueryIndexItem
 * @param {Element} parent
 * @param {QueryIndexItem} talkItem
 */
function addTalk(parent, talkItem) {
  const li = append(parent, 'li');
  const a = append(li, 'a');
  a.href = talkItem.path;
  a.textContent = talkItem.title;
  li.append(` (${getYearFromPath(talkItem.path)})`);
}

/**
 * Add list of talks.
 * @param {Element} parent
 */
async function addTalkList(parent) {
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

  if (talksThisYear.length > 0) {
    append(div, 'h4').textContent = 'Talks from this year';
    const ul = append(div, 'ul');
    talksThisYear.forEach((item) => addTalk(ul, item));
  }
  if (talksOtherYears.length > 0) {
    append(div, 'h4').textContent = 'Talks from other years';
    const ul = append(div, 'ul');
    talksOtherYears.forEach((item) => addTalk(ul, item));
  }

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
  addTalkList(block);

  // react to stage changes via hash
  window.addEventListener('hashchange', () => {
    window.location.reload();
  });
}
