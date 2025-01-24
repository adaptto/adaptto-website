/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import { stubFetchUrlMap } from '../test-utils.js';
import {
  addArchiveLinks,
  getArchivePath,
  getParentPath,
  getSchedulePath,
  getSiteRootPath,
  getSiteRootPathAlsoForSpeakerPath,
  getSpeakerDetailPath,
  getSpeakerOverviewPath,
  isSpeakerDetailPath,
} from '../../../scripts/utils/site.js';
import { append } from '../../../scripts/utils/dom.js';

stubFetchUrlMap({ '/query-index.json': '/test/test-data/query-index-sample.json' });

describe('utils/site', () => {
  it('getSiteRootPath', () => {
    expect(getSiteRootPath('/')).to.equal('/');
    expect(getSiteRootPath('/2021/')).to.equal('/2021/');
    expect(getSiteRootPath('/2021/mypage')).to.equal('/2021/');
    expect(getSiteRootPath('/2021/mypage/mysubpage')).to.equal('/2021/');
  });

  it('getSiteRootPathAlsoForSpeakerPath', async () => {
    expect(await getSiteRootPathAlsoForSpeakerPath('/')).to.equal('/');
    expect(await getSiteRootPathAlsoForSpeakerPath('/2021/')).to.equal('/2021/');
    expect(await getSiteRootPathAlsoForSpeakerPath('/2021/mypage')).to.equal('/2021/');
    expect(await getSiteRootPathAlsoForSpeakerPath('/2021/mypage/mysubpage')).to.equal('/2021/');
    expect(await getSiteRootPathAlsoForSpeakerPath('/speakers/konrad-windszus')).to.equal('/2021/');
    expect(await getSiteRootPathAlsoForSpeakerPath('/speakers/konrad-windszus', '#2019')).to.equal('/2019/');
  });

  it('getParentPath', () => {
    expect(getParentPath('/')).to.undefined;
    expect(getParentPath('/2021/')).to.undefined;
    expect(getParentPath('/2021/mypage')).to.equal('/2021/');
    expect(getParentPath('/2021/mypage/mysubpage')).to.equal('/2021/mypage');
    expect(getParentPath('/2021/mypage/mysubpage/sub2')).to.equal('/2021/mypage/mysubpage');
  });

  it('getSchedulePath', () => {
    expect(getSchedulePath('/2021/mypage')).to.equal('/2021/schedule');
  });

  it('getArchivePath', () => {
    expect(getArchivePath('/2021/mypage')).to.equal('/2021/archive');
  });

  it('getSpeakerOverviewPath', () => {
    expect(getSpeakerOverviewPath('/2021/mypage')).to.equal('/2021/conference/speaker');
  });

  it('getSpeakerDetailPath', () => {
    expect(getSpeakerDetailPath({ path: '/speakers/xyz' }, '/2021/')).to.equal('/speakers/xyz#2021');
  });

  it('isSpeakerDetailPath', () => {
    expect(isSpeakerDetailPath('/speakers/xyz')).to.true;
    expect(isSpeakerDetailPath('/2021/schedule')).to.false;
  });

  it('addArchiveLinks', async () => {
    const nav = document.createElement('nav');
    const ul = append(nav, 'ul');
    const li1 = append(ul, 'li');
    li1.textContent = 'Item 1';
    const li2 = append(ul, 'li');
    li2.textContent = 'Item 2';

    await addArchiveLinks(nav);

    expect(ul.children.length).to.eq(2);
    const archiveUl = li2.querySelector(':scope > ul');
    expect(archiveUl).to.not.undefined;
    expect(archiveUl.children.length).to.eq(2);
  });
});
