/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { blockLoaded } from '../../scripts/test-utils.js';

document.head.innerHTML = await readFile({ path: './head.html' });
document.body.innerHTML = await readFile({ path: './body.html' });

await import('../../../scripts/scripts.js');

describe('blocks/talk-detail-*', () => {
  it('decorateTalkDetailPage', async () => {
    const main = document.body.querySelector('main');

    const firstSection = main.querySelector([
      'div',
      'section',
      'talk-detail-before-outline-container',
      'talk-detail-after-outline-container',
    ].join('.'));
    expect(firstSection, 'first section').to.exist;
    expect(firstSection.children.length, 'first section children').to.eq(4);

    const [child1, child2, child3, child4] = Array.from(firstSection.children);
    expect(child1.querySelector('h1')).to.exist;
    expect(child2.querySelector('.talk-detail-before-outline')).to.exist;
    expect(child3.querySelector('p')).to.exist;
    expect(child4.querySelector('.talk-detail-after-outline')).to.exist;

    const secondSection = firstSection.nextElementSibling;
    expect(secondSection, 'second section').to.exist;
    expect(secondSection.querySelector('p')).to.exist;

    const thirdSection = secondSection.nextElementSibling;
    expect(thirdSection, 'third section').to.exist;
    expect(thirdSection.querySelector('.talk-detail-footer')).to.exist;
  });

  it('talk-detail-before-outline', async () => {
    const block = document.body.querySelector('.talk-detail-before-outline');
    expect(block).to.exist;
    await blockLoaded(block);

    // talk tags
    expect(Array.from(block.querySelectorAll('ul.talk-tags a')).map((a) => a.textContent))
      .to.eql(['Tag1', 'Tag2']);
    expect(Array.from(block.querySelectorAll('ul.talk-tags a')).map((a) => a.href))
      .to.eql(['http://localhost:2000/archive#Tag1', 'http://localhost:2000/archive#Tag2']);
  });

  it('talk-detail-after-outline', async () => {
    const block = document.body.querySelector('.talk-detail-after-outline');
    expect(block).to.exist;
  });

  it('talk-detail-footer', async () => {
    const block = document.body.querySelector('.talk-detail-footer');
    expect(block).to.exist;
  });
});
