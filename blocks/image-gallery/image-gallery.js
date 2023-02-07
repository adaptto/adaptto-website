import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { append } from '../../scripts/utils/dom.js';

/**
 * @param {Element} originalPicture
 */
function createGalleryImage(originalPicture, index) {
  const url = originalPicture.querySelector('img')?.src;
  const picture = createOptimizedPicture(url, '', true, [{ width: '980' }]);
  picture.classList.add('gallery-image');
  picture.dataset.index = index;
  return picture;
}

/**
 * @param {Element} block
 */
function getCurrentIndex(block) {
  return parseInt(block.querySelector('.gallery-placeholder .gallery-image')?.dataset.index, 10);
}

/**
 * @param {Element} block
 * @param {Element[]} pictures
 * @param {number} index
 */
function displayImage(block, pictures, index) {
  const picture = createGalleryImage(pictures[index], index);
  block.querySelector('.gallery-placeholder').replaceChildren(picture);
}

/**
 * @param {Element} block
 * @param {Element[]} pictures
 */
function displayNextImage(block, pictures) {
  const index = getCurrentIndex(block);
  let nextIndex = Number.isNaN(index) ? 0 : index + 1;
  if (nextIndex > pictures.length - 1) {
    nextIndex = 0;
  }
  displayImage(block, pictures, nextIndex);
}

/**
 * @param {Element} block
 * @param {Element[]} pictures
 */
function displayPreviousImage(block, pictures) {
  const index = getCurrentIndex(block);
  let nextIndex = Number.isNaN(index) ? 0 : index - 1;
  if (nextIndex < 0) {
    nextIndex = pictures.length - 1;
  }
  displayImage(block, pictures, nextIndex);
}

/**
 * @param {Element} originalPicture
 * @param {number} index
 */
function createThumbnailListItem(block, pictures, index) {
  const originalPicture = pictures[index];
  const url = originalPicture.querySelector('img')?.src;
  const eager = (index <= 7);
  const picture = createOptimizedPicture(url, '', eager, [{ width: '100' }]);

  const li = document.createElement('li');
  const a = append(li, 'a', 'gallery-thumb');
  a.append(picture);
  a.addEventListener('click', (e) => {
    e.preventDefault();
    displayImage(block, pictures, index);
  });
  return li;
}

/**
 * Image Gallery.
 * @param {Element} block
 */
export default function decorate(block) {
  const pictures = Array.from(block.querySelectorAll('picture'));
  if (pictures.length === 0) {
    return;
  }

  block.innerHTML = `<div class="gallery-stage">
      <a class="gallery-prev">Previous</a>
      <div class="gallery-placeholder"></div>
      <a class="gallery-next">Next</a>
      <a class="gallery-fullscreen-btn" href="" title="Fullscreen">Fullscreen</a>
    </div>
    <ul class="gallery-thumb-list"></ul>`;

  block.querySelector('.gallery-prev').addEventListener('click', (e) => {
    e.preventDefault();
    displayPreviousImage(block, pictures);
  });
  block.querySelector('.gallery-next').addEventListener('click', (e) => {
    e.preventDefault();
    displayNextImage(block, pictures);
  });

  displayImage(block, pictures, 0);

  const thumbList = block.querySelector('.gallery-thumb-list');
  for (let index = 0; index < pictures.length; index += 1) {
    thumbList.append(createThumbnailListItem(block, pictures, index));
  }
}
