import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { append } from '../../scripts/utils/dom.js';

/**
 * @param {Element} originalPicture
 */
function createGalleryImage(originalPicture) {
  const url = originalPicture.querySelector('img')?.src;
  const picture = createOptimizedPicture(url, '', true);
  picture.classList.add('gallery-image');
  return picture;
}

/**
 * @param {Element} originalPicture
 */
function createThumbnailListItem(originalPicture) {
  const url = originalPicture.querySelector('img')?.src;
  const picture = createOptimizedPicture(url, '', true);

  const li = document.createElement('li');
  const a = append(li, 'a', 'gallery-thumb');
  a.append(picture);
  return li;
}

/**
 * Image Gallery.
 * @param {Element} block
 */
export default function decorate(block) {
  const pictures = Array.from(block.querySelectorAll('picture'));
  const firstPicture = pictures[0];

  block.innerHTML = `<div class="gallery-stage">
      <a class="gallery-prev">Previous</a>
      <div class="gallery-placeholder"></div>
      <a class="gallery-next">Next</a>
      <a class="gallery-fullscreen-btn" href="" title="Fullscreen">Fullscreen</a>
    </div>
    <ul class="gallery-thumb-list"></ul>`;

  if (firstPicture) {
    block.querySelector('.gallery-placeholder').append(createGalleryImage(firstPicture));
  }

  const thumbList = block.querySelector('.gallery-thumb-list');
  pictures.forEach((picture) => thumbList.append(createThumbnailListItem(picture)));
}
