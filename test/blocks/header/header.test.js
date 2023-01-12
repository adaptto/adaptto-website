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

const headerBlock = buildBlock('header', [['Nav', '/test/blocks/header/nav']]);
document.querySelector('header').append(headerBlock);
decorateBlock(headerBlock);
await loadBlock(headerBlock);
await sleep();

describe('Header block', () => {
  it('Header', async () => {
    const header = document.querySelector('header .nav-header');
    expect(header).to.exist;

    const logo = header.querySelector('a.logo');
    expect(logo).to.exist;
    expect(logo.href).to.eq('http://localhost:2000/');

    const h1 = header.querySelector('h1.title.title-site');
    expect(h1).to.exist;
    expect(h1.textContent).to.eq('adaptTo()');

    const h2 = header.querySelector('h2.title.title-site.caption');
    expect(h2).to.exist;
    expect(h2.textContent).to.eq('Slogan');
  });

  it('Main Navigation', async () => {
    const mainNav = document.querySelector('header .nav-main');
    expect(mainNav).to.exist;

    const mobileNav = mainNav.querySelector('a.menu-opener');
    expect(mobileNav).to.exist;

    const navList = mainNav.querySelector('ul.navlist-main');
    expect(navList).to.exist;

    const a = navList.querySelector('a.navlink-main');
    expect(a).to.exist;
    expect(a.href).to.eq('http://localhost:2000/2021/');
  });
});
