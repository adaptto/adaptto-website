import { getTalkArchive } from '../../scripts/services/TalkArchive.js';
import { getFilterFromHash } from '../../scripts/services/TalkArchiveFilter.js';
import { append } from '../../scripts/utils/dom.js';
import { getYearFromPath } from '../../scripts/utils/path.js';

const filterCategories = [
  {
    category: 'tags',
    label: 'Tags',
    archiveMethod: 'getTagFilterOptions',
    collapsible: false,
  },
  {
    category: 'years',
    label: 'Year',
    archiveMethod: 'getYearFilterOptions',
    collapsible: true,
  },
  {
    category: 'speakers',
    label: 'Speaker',
    archiveMethod: 'getSpeakerFilterOptions',
    collapsible: true,
  },
];

/**
 * Renders talk archive filter options and result depending on current filter hash.
 * @typedef {import('../../scripts/services/TalkArchive').default} TalkArchive
 * @param {Element} block
 * @param {TalkArchive} talkArchive
 */
function displayFilteredTalks(block, talkArchive) {
  talkArchive.applyFilter(getFilterFromHash(window.location.hash));

  // result table
  const tbody = block.querySelector('.result table tbody');
  tbody.innerHTML = '';
  const talks = talkArchive.getFilteredTalks();

  if (talks.length > 0) {
    talks.forEach((talk) => {
      const tr = append(tbody, 'tr');
      append(tr, 'td').textContent = getYearFromPath(talk.path);
      const a = append(append(tr, 'td'), 'a');
      a.href = talk.path;
      a.textContent = talk.title;
      append(tr, 'td').textContent = talk.speakers.join(', ');
    });
  } else {
    const tr = append(tbody, 'tr');
    const td = append(tr, 'td');
    td.setAttribute('colspan', 3);
    td.textContent = 'No matching talk found.';
  }
}

/**
 * Add filter category options.
 * @param {Element} parent Parent element
 * @param {string} categoryLabel Category label
 * @param {string[]} items All items
 * @param {string[]} selectedItems Selected items
 * @param {boolean} collapsible Options list is collapsible
 */
function addFilterCategory(parent, categoryLabel, items, selectedItems, collapsible) {
  const div = append(parent, 'div', 'filter-category');
  const span = append(div, 'span', 'category');
  span.textContent = categoryLabel;
  const ul = append(div, 'ul');

  items.forEach((item) => {
    const li = append(ul, 'li');
    const label = append(li, 'label');
    const input = append(label, 'input');
    input.type = 'checkbox';
    input.value = item;
    if (selectedItems && selectedItems.includes(item)) {
      input.checked = true;
    }
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
 * @param {Element} block
 * @param {TalkArchive} talkArchive
 */
function addFilterCategories(block, talkArchive) {
  const filterDiv = block.querySelector('.filter');

  filterCategories.forEach((filterCategory) => {
    addFilterCategory(
      filterDiv,
      filterCategory.label,
      talkArchive[filterCategory.archiveMethod](),
      talkArchive.filter[filterCategory.category],
      filterCategory.collapsible,
    );
  });

  // enable toggles for collapsible filter lists
  filterDiv.querySelectorAll('ul.collapsible').forEach((ul) => {
    ul.querySelectorAll(' li.collapse-toggle a').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        ul.classList.toggle('collapsed');
      });
    });
  });

  // enable filter state changes
  filterDiv.querySelectorAll('.filter-category').forEach((categoryDiv) => {
    const categoryLabel = categoryDiv.querySelector('.category').textContent;
    const filterCategory = filterCategories.find((item) => item.label === categoryLabel);
    if (filterCategory) {
      categoryDiv.querySelectorAll('label').forEach((label) => {
        label.addEventListener('click', () => {
          let currentlySelectedItems = Array.from(categoryDiv.querySelectorAll('input[type=checkbox]'))
            .filter((input) => input.checked)
            .map((input) => input.value);
          if (currentlySelectedItems.length === 0) {
            currentlySelectedItems = undefined;
          }
          const filter = getFilterFromHash(window.location.hash);
          filter[filterCategory.category] = currentlySelectedItems;
          window.history.replaceState(null, null, filter.buildHash());
          displayFilteredTalks(block, talkArchive);
        });
      });
    }
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

  // react to stage changes via hash
  window.addEventListener('hashchange', () => displayFilteredTalks(block, talkArchive));
  displayFilteredTalks(block, talkArchive);

  // filter
  addFilterCategories(block, talkArchive);
}
