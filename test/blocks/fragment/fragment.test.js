/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { sectionLoaded } from '../../scripts/test-utils.js';

describe('blocks/fragment', () => {
  it('Replaces fragment block with fragment content', async () => {
    document.head.innerHTML = `
      <meta name="include-teaser-bar" content="false">
      <meta name="include-aside-bar" content="false">
    `;
    document.body.innerHTML = await readFile({ path: './block.html' });
    await import('../../../scripts/scripts.js');
    const section = document.querySelector('.section.fragment-container');
    await sectionLoaded(section);
    expect(section.textContent.trim()).to.equal('Hello world!');
    expect(section.classList.contains('social-teaser-container')).to.be.true;
    expect(document.querySelectorAll('.fragment').length).to.least(1);
  });
});
