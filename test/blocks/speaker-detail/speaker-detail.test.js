/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setWindowLocationHref, sleep, stubFetchUrlMap } from '../../scripts/test-utils.js';

// simulate current talk and redirect some fetch calls to mock data
setWindowLocationHref('/speakers/konrad-windszus#2020');
stubFetchUrlMap({
  '/query-index.json': '/test/test-data/query-index-sample.json',
});

document.head.innerHTML = await readFile({ path: './head.html' });
document.body.innerHTML = await readFile({ path: './body.html' });

await import('../../../scripts/scripts.js');
await sleep();

const main = document.body.querySelector('main');

describe('blocks/speaker-detail', () => {
  it('speakerMetadata', async () => {
    expect(main.querySelector('h1')?.textContent).to.eq('Speaker Name');
    expect(main.querySelector('.speaker-data .affiliation')?.textContent).to.eq('The Company');
  });

  it('talkOverview', async () => {
    const talkList = main.querySelector('.talk-list');
    expect(talkList).to.exist;

    expect(Array.from(talkList.querySelectorAll('a')).map((a) => a.href)).to.eql([
      'http://localhost:2000/2020/schedule/dummy-talk',
      'http://localhost:2000/2021/schedule/lightning-talks/precompiled-bundled-scripts-from-content-package',
      'http://localhost:2000/2021/schedule/panel-discussion-aem-as-a-cloud-service',
    ]);
  });
});
