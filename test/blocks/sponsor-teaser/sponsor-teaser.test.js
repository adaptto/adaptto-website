/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import decorate from '../../../blocks/sponsor-teaser/sponsor-teaser.js';

describe('blocks/sponsor-teaser', () => {
  it('block', async () => {
    document.body.innerHTML = await readFile({ path: './block.html' });
    const block = document.querySelector('.sponsor-teaser');
    decorate(block);

    // 1st teaser already has anchor around image
    const teaser1 = block.querySelector('div > div:nth-child(1)');
    expect(teaser1.querySelector('p:has(a img)')).to.exist;
    expect(teaser1.querySelectorAll('p').length).to.eq(1);

    // 2nd teaser has not anchor around image, ensure block has added it
    const teaser2 = block.querySelector('div > div:nth-child(2)');
    expect(teaser2.querySelector('p:has(a img)')).to.exist;
    expect(teaser2.querySelectorAll('p').length).to.eq(1);
  });
});
