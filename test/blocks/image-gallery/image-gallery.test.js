/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import decorate from '../../../blocks/image-gallery/image-gallery.js';

function assertGalleryImage(parent, index, previousIndex, nextIndex) {
  expect(parent).to.exist;
  expect(parent.querySelector('.gallery-image img').src).to.contain(`media_${index}.jpg`);
  expect(parent.querySelector('.gallery-prev').href).to.contain(`#image-${previousIndex}`);
  expect(parent.querySelector('.gallery-next').href).to.contain(`#image-${nextIndex}`);
  expect(parent.querySelector('.gallery-fullscreen-btn').href).to.contain(`#fullscreen-image-${index}`);
}

function assertOverlayImage(parent, index, previousIndex, nextIndex) {
  expect(parent).to.exist;
  expect(parent.querySelector('.gallery-image img').src).to.contain(`media_${index}.jpg`);
  expect(parent.querySelector('.gallery-prev').href).to.contain(`#fullscreen-image-${previousIndex}`);
  expect(parent.querySelector('.gallery-next').href).to.contain(`#fullscreen-image-${nextIndex}`);
  expect(parent.querySelector('.lb-close-btn').href).to.contain(`#image-${index}`);
}

describe('blocks/image-gallery', () => {
  it('initial', async () => {
    document.body.innerHTML = await readFile({ path: './block.html' });
    decorate(document.querySelector('.image-gallery'));

    assertGalleryImage(document.body.querySelector('.image-gallery .gallery-stage'), 1, 3, 2);
    expect(document.body.querySelector('#image-gallery-overlay')).to.not.exist;

    const thumbnails = Array.from(document.body.querySelectorAll('.image-gallery .gallery-thumb-list li a'));
    expect(thumbnails.length).to.eq(3);
    expect(thumbnails[0].href).to.contain('#image-1');
    expect(thumbnails[1].href).to.contain('#image-2');
    expect(thumbnails[2].href).to.contain('#image-3');
  });

  it('image-2', async () => {
    window.history.replaceState(null, null, '#image-2');
    document.body.innerHTML = await readFile({ path: './block.html' });
    decorate(document.querySelector('.image-gallery'));

    assertGalleryImage(document.body.querySelector('.image-gallery .gallery-stage'), 2, 1, 3);
    expect(document.body.querySelector('#image-gallery-overlay')).to.not.exist;
  });

  it('fullscreen-image-3', async () => {
    window.history.replaceState(null, null, '#fullscreen-image-3');
    document.body.innerHTML = await readFile({ path: './block.html' });
    decorate(document.querySelector('.image-gallery'));

    assertGalleryImage(document.body.querySelector('.image-gallery .gallery-stage'), 3, 2, 1);
    assertOverlayImage(document.body.querySelector('#image-gallery-overlay'), 3, 2, 1);
  });
});
