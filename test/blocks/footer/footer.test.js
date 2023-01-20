/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setWindowLocationHref, sleep, stubFetchUrlMap } from '../../scripts/test-utils.js';

// simulate current talk and redirect some fetch calls to mock data
setWindowLocationHref('/2021/');
stubFetchUrlMap({
  '/2021/footer.plain.html': '/test/blocks/footer/footer.plain.html',
  '/query-index.json': '/test/test-data/query-index-sample.json',
});

document.body.innerHTML = await readFile({ path: '../../scripts/body.html' });

await import('../../../scripts/scripts.js');
await sleep();

describe('blocks/footer', () => {
  it('Footer Nav', async () => {
    const footerNavItems = document.querySelectorAll('.footer .section-footernav > ul > li');
    expect(footerNavItems.length, 'footer nav items').to.eq(2);

    const conferenceLinks = Array.from(footerNavItems[0].querySelectorAll(':scope > ul > li > a'));
    expect(conferenceLinks.map((a) => a.href), 'conferenceLinks').to.eql([
      'http://localhost:2000/2021/conference',
      'http://localhost:2000/2021/schedule',
    ]);

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
