/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import { getSiteRoot } from '../../../scripts/utils/site.js';

describe('utils/site', () => {
  it('getSiteRoot', () => {
    expect(getSiteRoot('/')).to.equal('/');
    expect(getSiteRoot('/2021/')).to.equal('/2021/');
    expect(getSiteRoot('/2021/mypage')).to.equal('/2021/');
    expect(getSiteRoot('/2021/mypage/mysubpage/')).to.equal('/2021/');
  });
});
