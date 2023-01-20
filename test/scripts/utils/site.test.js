/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import {
  getArchivePath,
  getParentPath,
  getSchedulePath,
  getSiteRootPath,
  getSpeakerOverviewPath,
} from '../../../scripts/utils/site.js';

describe('utils/site', () => {
  it('getSiteRootPath', () => {
    expect(getSiteRootPath('/')).to.equal('/');
    expect(getSiteRootPath('/2021/')).to.equal('/2021/');
    expect(getSiteRootPath('/2021/mypage')).to.equal('/2021/');
    expect(getSiteRootPath('/2021/mypage/mysubpage')).to.equal('/2021/');
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
});
