/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setWindowLocationHref, sleep, stubFetchUrlMap } from '../../scripts/test-utils.js';

// simulate current talk and redirect some fetch calls to mock data
setWindowLocationHref('/2021/');
stubFetchUrlMap({
  '/2021/nav.plain.html': '/test/blocks/header/nav.plain.html',
  '/query-index.json': '/test/test-data/query-index-sample.json',
});

document.body.innerHTML = await readFile({ path: '../../scripts/body.html' });

await import('../../../scripts/scripts.js');
await sleep();

describe('blocks/header', () => {
  it('Header', async () => {
    const header = document.querySelector('header');
    expect(header).to.exist;

    const logo = header.querySelector('a.logo');
    expect(logo).to.exist;
    expect(logo.href).to.eq('http://localhost:2000/2021/');

    const h1 = header.querySelector('h1');
    expect(h1).to.exist;
    expect(h1.textContent).to.eq('adaptTo()');

    const h2 = header.querySelector('h2');
    expect(h2).to.exist;
    expect(h2.textContent).to.eq('Slogan');
  });

  it('Main Navigation', async () => {
    const mainNav = document.querySelector('header nav');
    expect(mainNav).to.exist;

    const mobileNav = mainNav.querySelector('h1.mobile-nav a');
    expect(mobileNav).to.exist;

    const navItems = mainNav.querySelectorAll(':scope > ul > li');
    expect(navItems.length).to.eq(4);

    const homeLink = navItems[0].querySelector(':scope > a');
    expect(homeLink).to.exist;
    expect(homeLink.href).to.eq('http://localhost:2000/2021/');

    // archive links dynamically added
    const archiveLinks = navItems[3].querySelectorAll(':scope > ul > li > a');
    expect(archiveLinks.length, 'archiveLinks').to.eq(7);
    expect(archiveLinks[0].href).to.equal('http://localhost:2000/2021/archive');
    expect(archiveLinks[1].href).to.equal('http://localhost:2000/2021/');
    expect(archiveLinks[1].textContent).to.equal('adaptTo() 2021');
    expect(archiveLinks[2].href).to.equal('http://localhost:2000/2020/');
    expect(archiveLinks[2].textContent).to.equal('adaptTo() 2020');

    // navigation buttons
    const buttonsContainer = mainNav.querySelector('.buttons-container');
    expect(buttonsContainer).to.exist;
    const buttons = buttonsContainer.querySelectorAll('.button-container');
    expect(buttons.length).to.eq(2);
  });
});
