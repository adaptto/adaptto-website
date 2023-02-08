/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import decorate from '../../../blocks/image-gallery/image-gallery.js';

describe('blocks/image-gallery', () => {
  it('initial', async () => {
    document.body.innerHTML = await readFile({ path: './block.html' });
    decorate(document.querySelector('.image-gallery'));

    const stage = document.body.querySelector('.image-gallery .gallery-stage');
    expect(stage).to.exist;
    expect(stage.querySelector('.gallery-image img').src).to.contain('media_1.jpg');
    expect(stage.querySelector('.gallery-prev').href).to.contain('#image-3');
    expect(stage.querySelector('.gallery-next').href).to.contain('#image-2');
    expect(stage.querySelector('.gallery-fullscreen-btn').href).to.contain('#fullscreen-image-1');

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

    const stage = document.body.querySelector('.image-gallery .gallery-stage');
    expect(stage).to.exist;
    expect(stage.querySelector('.gallery-image img').src).to.contain('media_2.jpg');
    expect(stage.querySelector('.gallery-prev').href).to.contain('#image-1');
    expect(stage.querySelector('.gallery-next').href).to.contain('#image-3');
    expect(stage.querySelector('.gallery-fullscreen-btn').href).to.contain('#fullscreen-image-2');

    expect(document.body.querySelector('#image-gallery-overlay')).to.not.exist;
  });

  it('fullscreen-image-3', async () => {
    window.history.replaceState(null, null, '#fullscreen-image-3');
    document.body.innerHTML = await readFile({ path: './block.html' });
    decorate(document.querySelector('.image-gallery'));

    const stage = document.body.querySelector('.image-gallery .gallery-stage');
    expect(stage).to.exist;
    expect(stage.querySelector('.gallery-image img').src).to.contain('media_3.jpg');
    expect(stage.querySelector('.gallery-prev').href).to.contain('#image-2');
    expect(stage.querySelector('.gallery-next').href).to.contain('#image-1');
    expect(stage.querySelector('.gallery-fullscreen-btn').href).to.contain('#fullscreen-image-3');

    const overlay = document.body.querySelector('#image-gallery-overlay');
    expect(overlay).to.exist;
    expect(overlay.querySelector('.gallery-image img').src).to.contain('media_3.jpg');
    expect(overlay.querySelector('.gallery-prev').href).to.contain('#fullscreen-image-2');
    expect(overlay.querySelector('.gallery-next').href).to.contain('#fullscreen-image-1');
    expect(overlay.querySelector('.lb-close-btn').href).to.contain('#image-3');
  });
});
