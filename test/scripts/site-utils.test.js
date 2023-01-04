/* eslint-disable no-unused-expressions */
/* global describe before it */

import { expect } from '@esm-bundle/chai';
import { getSiteRoot } from '../../scripts/site-utils';

describe('site-utils', () => {

  it('getSiteRoot', async () => {
    expect(getSiteRoot('/')).to.equal('/')
    expect(getSiteRoot('/2021/')).to.equal('/2021/')
    expect(getSiteRoot('/2021/mypage')).to.equal('/2021/')
  })

})
