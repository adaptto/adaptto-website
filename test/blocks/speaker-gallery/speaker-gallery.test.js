/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import { buildBlock } from '../../../scripts/aem.js';
import decorate from '../../../blocks/speaker-gallery/speaker-gallery.js';
import { setWindowLocationHref, stubFetchUrlMap } from '../../scripts/test-utils.js';

setWindowLocationHref('/2021/conference/speaker');
stubFetchUrlMap({
  '/2021/schedule-data.json': '/test/test-data/schedule-data-2021.json',
  '/query-index.json': '/test/test-data/query-index-schedule-2021.json',
});

async function buildSpeakerGalleryBlock(blockConfig = []) {
  const block = buildBlock('speaker-gallery', blockConfig);
  await decorate(block);
  return block;
}

describe('blocks/speaker-gallery', () => {
  it('block', async () => {
    const block = await buildSpeakerGalleryBlock();

    const speakers = block.querySelectorAll('.speaker');
    expect(speakers.length).to.eq(29);
  });

  it('block-with-speaker-list', async () => {
    const block = await buildSpeakerGalleryBlock([
      ['speakers', 'Carsten Ziegeler, Robert Munteanu'],
    ]);

    const speakers = block.querySelectorAll('.speaker');
    expect(speakers.length).to.eq(2);
  });
});
