/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { blockLoaded, setWindowLocationHref, stubFetchUrlMap } from '../../scripts/test-utils.js';

// simulate current talk and redirect some fetch calls to mock data
setWindowLocationHref('/2020/schedule/graphql-services-in-the-aem-world');
stubFetchUrlMap({
  '/2020/schedule-data.json': '/test/test-data/schedule-data-2020.json',
  '/query-index.json': '/test/test-data/query-index-schedule-2020.json',
});

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
    const tagLinks = Array.from(block.querySelectorAll('ul.talk-tags a'));
    expect(tagLinks.map((a) => a.textContent)).to.eql([
      'Tag1',
      'Tag2',
    ]);
    expect(tagLinks.map((a) => a.href)).to.eql([
      'http://localhost:2000/2020/archive#tags=Tag1',
      'http://localhost:2000/2020/archive#tags=Tag2',
    ]);

    // time info
    expect(block.querySelector('p').textContent).to.eq('Monday, 28 September 2020 11:45 - 12:15 (30 min)');

    // video embed
    const embed = block.querySelector('.embed-youtube');
    expect(embed).to.exist;
    await blockLoaded(embed);
  });

  it('talk-detail-after-outline', async () => {
    const block = document.body.querySelector('.talk-detail-after-outline');
    expect(block).to.exist;
    await blockLoaded(block);

    // speakers
    const speakerLinks = Array.from(block.querySelectorAll('ul.speakers a'));
    expect(speakerLinks.map((a) => a.href)).to.eql([
      'http://localhost:2000/speakers/mark-becker#2020',
      'http://localhost:2000/speakers/mark-becker#2020',
      'http://localhost:2000/speakers/markus-haack#2020',
      'http://localhost:2000/speakers/markus-haack#2020',
    ]);
    const speakerImages = Array.from(block.querySelectorAll('ul.speakers img'));
    expect(speakerImages.map((img) => img.src)).to.eql([
      'http://localhost:2000/speakers/mark-becker.jpeg?width=150&format=jpeg&optimize=medium',
      'http://localhost:2000/speakers/markus-haack.jpeg?width=150&format=jpeg&optimize=medium',
    ]);

    // talk links
    const presentationLink = block.querySelector('ul.talk-links li.download a');
    expect(presentationLink?.href).to.eq('http://localhost:2000/2021/presentations/file1.pdf');
    expect(presentationLink?.hasAttribute('download')).to.true;
    const codeLink = block.querySelector('ul.talk-links li.code a');
    expect(codeLink?.href).to.eq('http://localhost:2000/2021/presentations/file1.zip');
    expect(codeLink?.hasAttribute('download')).to.true;
    const videoLink = block.querySelector('ul.talk-links li.video a');
    expect(videoLink?.href).to.eq('https://myhost/video');
    expect(videoLink?.target).to.eq('_blank');
  });

  it('talk-detail-footer', async () => {
    const block = document.body.querySelector('.talk-detail-footer');
    expect(block).to.exist;
    await blockLoaded(block);

    expect(block.querySelector('a')?.href).to.eq('http://localhost:2000/2020/schedule');
  });
});
