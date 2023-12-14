/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import decorate from '../../../blocks/teaser-bar/teaser-bar.js';

describe('blocks/teaser-bar', () => {
  it('block', async () => {
    document.body.innerHTML = await readFile({ path: './block.html' });
    const block = document.querySelector('.teaser-bar');
    decorate(block);

    // 1st teaser already has anchor around image
    const teaser1 = block.querySelector('div > div:nth-child(1)');
    expect(teaser1.querySelector('h1')).to.exist;
    expect(teaser1.querySelector('p.image:has(a img)')).to.exist;
    expect(teaser1.querySelector('p.text')).to.exist;
    expect(teaser1.querySelector('p.link:has(a)')).to.exist;

    // 2nd teaser has not anchor around image, ensure block has added it
    const teaser2 = block.querySelector('div > div:nth-child(2)');
    expect(teaser2.querySelector('h1')).to.exist;
    expect(teaser2.querySelector('p.image:has(a img)')).to.exist;
    expect(teaser2.querySelector('p.text')).to.exist;
    expect(teaser2.querySelector('p.link:has(a)')).to.exist;
  });
});
