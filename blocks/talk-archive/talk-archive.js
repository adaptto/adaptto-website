import { getTalkArchive } from '../../scripts/services/TalkArchive.js';
import { append } from '../../scripts/utils/dom.js';
import { getYearFromPath } from '../../scripts/utils/path.js';

/**
 * Add filter category options.
 * @param {Element} parent
 * @param {string} category
 * @param {string[]} items
 * @param {boolean} collapsible
 */
function addFilterCategory(parent, category, items, collapsible) {
  const div = append(parent, 'div', 'filter-category');
  const span = append(div, 'span', 'category');
  span.textContent = category;
  const ul = append(div, 'ul');

  items.forEach((item) => {
    const li = append(ul, 'li');
    const label = append(li, 'label');
    const input = append(label, 'input');
    input.type = 'checkbox';
    input.value = item;
    label.append(item);
  });

  if (collapsible && items.length > 5) {
    ul.classList.add('collapsible', 'collapsed');

    const liNext = append(ul, 'li', 'collapse-toggle', 'more');
    const aNext = append(liNext, 'a');
    aNext.href = '#';
    aNext.textContent = 'more...';

    const liLess = append(ul, 'li', 'collapse-toggle', 'less');
    const aLess = append(liLess, 'a');
    aLess.href = '#';
    aLess.textContent = 'less...';
  }
}

/**
 * Add filter categories.
 * @typedef {import('../../scripts/services/TalkArchive').default} TalkArchive
 * @param {Element} parent
 * @param {TalkArchive} talkArchive
 */
function addFilterCategories(parent, talkArchive) {
  addFilterCategory(parent, 'Tags', talkArchive.getTagFilterOptions());
  addFilterCategory(parent, 'Year', talkArchive.getYearFilterOptions(), true);
  addFilterCategory(parent, 'Speaker', talkArchive.getSpeakerFilterOptions(), true);
}

/**
 * Enable toggles for collapsible filter lists.
 * @param {Element} parent
 */
function decorateCollapsibleToggles(parent) {
  parent.querySelectorAll('ul.collapsible').forEach((ul) => {
    ul.querySelectorAll(' li.collapse-toggle a').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        ul.classList.toggle('collapsed');
      });
    });
  });
}

/**
 * List talks.
 * @typedef {import('../../scripts/services/TalkArchive').default} TalkArchive
 * @param {Element} tbody
 * @param {TalkArchive} talkArchive
 */
function fillResult(tbody, talkArchive) {
  const talks = talkArchive.getFilteredTalks();
  talks.forEach((talk) => {
    const tr = append(tbody, 'tr');
    append(tr, 'td').textContent = getYearFromPath(talk.path);
    const a = append(append(tr, 'td'), 'a');
    a.href = talk.path;
    a.textContent = talk.title;
    append(tr, 'td').textContent = talk.getSpeakers().join(', ');
  });
}

/**
 * Talk archive.
 * @param {Element} block
 */
export default async function decorate(block) {
  const talkArchive = await getTalkArchive();

  // prepare archive markup
  block.innerHTML = `
      <div class="search">
        <input type="search" placeholder="Search">
      </div>
      <div class="filter">
      </div>
      <div class="result">
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Talk</th>
              <th>Speaker</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>`;

  // filter
  const filter = block.querySelector('.filter');
  addFilterCategories(filter, talkArchive);
  decorateCollapsibleToggles(filter);

  // result table
  const resultTableBody = block.querySelector('.result table tbody');
  fillResult(resultTableBody, talkArchive);
}
