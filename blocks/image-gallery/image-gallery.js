import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { append } from '../../scripts/utils/dom.js';
import html from '../../scripts/utils/htmlTemplateTag.js';

const hashPattern = /^#(fullscreen-)?image-(\d{1,4})$/;

/**
 * Current display state.
 */
class State {
  /**
   * @returns {number} Current image index
   */
  index;

  /**
   * @returns {number} Fullscreen display
   */
  fullscreen;
}

/**
 * Gets current image display state from hash (defaults to first image).
 * @param {string[]} imageUrls  Image URLs
 * @returns {State} State
 */
function getStateFromHash(imageUrls) {
  const state = new State();
  const hashMatch = window.location.hash.match(hashPattern);
  if (hashMatch) {
    state.index = parseInt(hashMatch[2], 10) - 1;
    state.fullscreen = hashMatch[1] !== undefined;
  } else {
    state.index = 0;
    state.fullscreen = false;
  }
  if (state.index < 0 || state.index > imageUrls.length - 1) {
    state.index = 0;
  }
  return state;
}

/**
 * Builds location has to address image.
 * @param {number} index Image index
 * @param {boolean} fullscreen Full screen mode
 * @returns {string} Hash
 */
function buildHash(index, fullscreen) {
  const fullscreenSuffix = fullscreen ? 'fullscreen-' : '';
  return `#${fullscreenSuffix}image-${index + 1}`;
}

/**
 * Display selected image in given container (page or fullscreen).
 * @param {Element} parent Parent element
 * @param {string[]} imageUrls Image URLs
 * @param {number} index Image index
 * @param {boolean} fullscreen Fullscreen mode
 */
function displayImage(parent, imageUrls, index, fullscreen) {
  // display image
  const breakpoints = fullscreen
    ? [{ media: '(min-width: 500px)', width: 2048 }, { width: 1024 }]
    : [{ media: '(min-width: 500px)', width: 980 }, { width: 490 }];
  const picture = createOptimizedPicture(imageUrls[index], '', true, breakpoints);
  picture.classList.add('gallery-image');
  parent.querySelector('.gallery-placeholder').replaceChildren(picture);

  // navigation links
  let previousIndex = index - 1;
  if (previousIndex < 0) {
    previousIndex = imageUrls.length - 1;
  }
  let nextIndex = index + 1;
  if (nextIndex > imageUrls.length - 1) {
    nextIndex = 0;
  }
  parent.querySelector('.gallery-prev').href = buildHash(previousIndex, fullscreen);
  parent.querySelector('.gallery-next').href = buildHash(nextIndex, fullscreen);

  // full screen mode open/close buttons
  const fullscreenButton = parent.querySelector('.gallery-fullscreen-btn');
  if (fullscreenButton) {
    fullscreenButton.href = buildHash(index, true);
  }
  const fullscreenCloseButton = parent.querySelector('.lb-close-btn');
  if (fullscreenCloseButton) {
    fullscreenCloseButton.href = buildHash(index, false);
  }
}

/**
 * Creates overlay markup to display image in fullscreen mode.
 * @returns {Element} Overlay element added to body.
 */
function createOverlay() {
  let overlay = document.body.querySelector(':scope > #image-gallery-overlay');
  if (!overlay) {
    overlay = append(document.body, 'div', 'image-gallery');
    overlay.id = 'image-gallery-overlay';
    overlay.innerHTML = html`<a class="lb-close-btn">Close</a>
      <div class="lb-content">
        <div class="lb-gallery">
          <div class="gallery-stage">
            <a class="gallery-prev">Previous</a>
            <div class="gallery-placeholder"></div>
            <a class="gallery-next">Next</a>
          </div>
        </div>
      </div>`;
  }
  return overlay;
}

/**
 * Removes overlay markup.
 */
function removeOverlay() {
  const overlay = document.body.querySelector(':scope > #image-gallery-overlay');
  if (overlay) {
    document.body.removeChild(overlay);
  }
}

/**
 * Displays image as addressed via current hash.
 * @param {Element} block Block element
 * @param {string[]} imageUrls  Image URLs
 */
function displayCurrentStateImage(block, imageUrls) {
  const state = getStateFromHash(imageUrls);
  displayImage(block, imageUrls, state.index, false);
  if (state.fullscreen) {
    const overlay = createOverlay();
    displayImage(overlay, imageUrls, state.index, true);
  } else {
    removeOverlay();
  }
}

/**
 * Image Gallery.
 * @param {Element} block
 */
export default function decorate(block) {
  // collect list of all image gallery URLs
  const imageUrls = Array.from(block.querySelectorAll('picture'))
    .map((picture) => picture.querySelector('img')?.src)
    .filter((url) => url !== undefined);
  if (imageUrls.length === 0) {
    return;
  }

  // build gallery markup
  block.innerHTML = html`<div class="gallery-stage">
      <a class="gallery-prev">Previous</a>
      <div class="gallery-placeholder"></div>
      <a class="gallery-next">Next</a>
      <a class="gallery-fullscreen-btn" title="Fullscreen">Fullscreen</a>
    </div>
    <ul class="gallery-thumb-list"></ul>`;

  // list of image thumbnails
  const thumbList = block.querySelector('.gallery-thumb-list');
  imageUrls.forEach((imageUrl, index) => {
    const li = append(thumbList, 'li');
    const a = append(li, 'a', 'gallery-thumb');
    a.href = buildHash(index, false);
    const eager = (index <= 7);
    a.append(createOptimizedPicture(imageUrl, '', eager, [{ width: '100' }]));
  });

  // react to stage changes via hash
  window.addEventListener('hashchange', () => displayCurrentStateImage(block, imageUrls));
  displayCurrentStateImage(block, imageUrls);
}
