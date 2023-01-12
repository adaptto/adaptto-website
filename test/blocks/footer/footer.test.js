/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: '../../scripts/dummy.html' });

const { buildBlock, decorateBlock, loadBlock } = await import('../../../scripts/lib-franklin.js');

document.body.innerHTML = await readFile({ path: '../../scripts/body.html' });

const sleep = async (time = 1000) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true);
  }, time);
});

const footerBlock = buildBlock('footer', [['Footer', '/test/blocks/footer/footer']]);
document.querySelector('footer').append(footerBlock);
decorateBlock(footerBlock);
await loadBlock(footerBlock);
await sleep();

describe('Footer block', () => {
  it('Footer Nav', async () => {
    const h2 = document.querySelector('footer section h2.title-footer');
    expect(h2).to.exist;
    expect(h2.textContent).to.eq('Conference');

    const navlist = document.querySelector('footer section ul.navlist-footer');
    expect(navlist).to.exist;

    const a = navlist.querySelector('a.navlink-footer');
    expect(a).to.exist;
    expect(a.href).to.equal('http://localhost:2000/2021/conference');
  });

  it('Footer Text', async () => {
    const p = document.querySelector('footer p.footer-text');
    expect(p).to.exist;

    const a = p.querySelector('a.navlink');
    expect(a).to.exist;
    expect(a.href).to.equal('http://localhost:2000/2021/imprint');
  });
});
