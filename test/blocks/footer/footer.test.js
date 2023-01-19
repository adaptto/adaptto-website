/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const { buildBlock, decorateBlock, loadBlock } = await import('../../../scripts/lib-franklin.js');

document.body.innerHTML = await readFile({ path: '../../scripts/body.html' });

const sleep = async (time = 1000) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true);
  }, time);
});

const footerBlock = buildBlock('footer', [['footer', '/test/blocks/footer/footer'],
  ['queryindexurl', '/test/test-data/query-index-sample.json']]);
document.querySelector('footer').append(footerBlock);
decorateBlock(footerBlock);
await loadBlock(footerBlock);
await sleep();

describe('blocks/footer', () => {
  it('Footer Nav', async () => {
    const footerNavItems = document.querySelectorAll('.footer .section-footernav > ul > li');
    expect(footerNavItems.length).to.eq(2);

    const conferenceLinks = footerNavItems[0].querySelectorAll(':scope > ul > li > a');
    expect(conferenceLinks.length, 'conferenceLinks').to.eq(2);
    expect(conferenceLinks[0].href).to.equal('http://localhost:2000/2021/conference');
    expect(conferenceLinks[1].href).to.equal('http://localhost:2000/2021/schedule');

    // archive links dynamically added
    const archiveLinks = footerNavItems[1].querySelectorAll(':scope > ul > li > a');
    expect(archiveLinks.length, 'archiveLinks').to.eq(3);
    expect(archiveLinks[0].href).to.equal('http://localhost:2000/2021/archive');
    expect(archiveLinks[1].href).to.equal('http://localhost:2000/2021/');
    expect(archiveLinks[1].textContent).to.equal('adaptTo() 2021');
    expect(archiveLinks[2].href).to.equal('http://localhost:2000/2020/');
    expect(archiveLinks[2].textContent).to.equal('adaptTo() 2020');
  });

  it('Footer Text', async () => {
    const p = document.querySelector('.footer .section-footertext p');
    expect(p, 'p').to.exist;
    expect(p.textContent).to.eq(`Copyright ${new Date().getFullYear()} Imprint`);

    const a = p.querySelector('.footer .section-footertext a');
    expect(a, 'a').to.exist;
    expect(a.href).to.equal('http://localhost:2000/2021/imprint');
  });
});
