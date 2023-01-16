/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import decorate from '../../../blocks/stage-header/stage-header.js';

describe('Stage Header Block', () => {
  it('block', async () => {
    document.body.innerHTML = await readFile({ path: './block.html' });
    decorate(document.querySelector('.stage-header'));

    const stage = document.body.querySelector('.stage-large');
    expect(stage).to.exist;
    expect(stage.querySelector(':scope > picture')).to.exist;

    const title = stage.querySelector('.stage-overlay .stage-title');
    expect(title).to.exist;
    expect(title.querySelector('h2')).to.exist;
    expect(title.querySelector('p')).to.exist;

    const ctaBox = stage.querySelector('.stage-cta-box');
    expect(ctaBox).to.exist;
    expect(ctaBox.querySelector('p a.stage-cta')).to.exist;
  });

  it('empty', async () => {
    document.body.innerHTML = '<div class="stage-header"></div>';
    decorate(document.querySelector('.stage-header'));

    const stage = document.body.querySelector('.stage-large');
    expect(stage).to.exist;
  });
});
