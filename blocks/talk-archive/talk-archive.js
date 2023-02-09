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
 * @param {boolean} applyFilter Re-apply filters from hash.
 */
function displayFilteredTalks(block, talkArchive, applyFilter) {
  if (applyFilter) {
    talkArchive.applyFilter(getFilterFromHash(window.location.hash));
  }

  // full text
  const fullText = block.querySelector('.search input').value.trim();

  // result table
  const tbody = block.querySelector('.result table tbody');
  tbody.innerHTML = '';
  const talks = fullText !== ''
    ? talkArchive.getFilteredTalksFullTextSearch(fullText)
    : talkArchive.getFilteredTalks();

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
    const tr = append(tbody, 'tr', 'no-result');
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
 * @returns {Element} Filter category element
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
    ul.classList.add('collapsible');
    if (!selectedItems || selectedItems.length === 0) {
      // collapse by default, unless there is any item selected from this filter option
      ul.classList.add('collapsed');
    }

    const liNext = append(ul, 'li', 'collapse-toggle', 'more');
    const aNext = append(liNext, 'a');
    aNext.href = '#';
    aNext.textContent = 'more...';

    const liLess = append(ul, 'li', 'collapse-toggle', 'less');
    const aLess = append(liLess, 'a');
    aLess.href = '#';
    aLess.textContent = 'less...';
  }

  return div;
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
    const categoryDiv = addFilterCategory(
      filterDiv,
      filterCategory.label,
      talkArchive[filterCategory.archiveMethod](),
      talkArchive.filter[filterCategory.category],
      filterCategory.collapsible,
    );

    // enable filter state changes
    categoryDiv.querySelectorAll('input[type=checkbox]').forEach((input) => {
      input.addEventListener('change', () => {
        let currentlySelectedItems = Array.from(categoryDiv.querySelectorAll('input[type=checkbox]'))
          .filter((item) => item.checked)
          .map((item) => item.value);
        if (currentlySelectedItems.length === 0) {
          currentlySelectedItems = undefined;
        }
        const filter = getFilterFromHash(window.location.hash);
        filter[filterCategory.category] = currentlySelectedItems;
        window.history.replaceState(null, null, filter.buildHash());
        displayFilteredTalks(block, talkArchive, true);
      });
    });
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

  // fire full text search when entering text (with 0.5sec delay)
  let typingTimer;
  block.querySelector('.search input').addEventListener('input', () => {
    clearInterval(typingTimer);
    typingTimer = setTimeout(() => displayFilteredTalks(block, talkArchive, false), 500);
  });

  // react to stage changes via hash
  window.addEventListener('hashchange', () => displayFilteredTalks(block, talkArchive, true));
  displayFilteredTalks(block, talkArchive, true);

  // filter
  addFilterCategories(block, talkArchive);
}
