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

    const teaser = block.querySelector('div > div');
    expect(teaser.querySelector('h1')).to.exist;
    expect(teaser.querySelector('p.image:has(a img)')).to.exist;
    expect(teaser.querySelector('p.text')).to.exist;
    expect(teaser.querySelector('p.link:has(a)')).to.exist;
  });
});
