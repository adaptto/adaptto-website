/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import { detachElement, getSiteRoot } from '../../scripts/site-utils.js';

describe('site-utils', () => {
  it('getSiteRoot', () => {
    expect(getSiteRoot('/')).to.equal('/');
    expect(getSiteRoot('/2021/')).to.equal('/2021/');
    expect(getSiteRoot('/2021/mypage')).to.equal('/2021/');
    expect(getSiteRoot('/2021/mypage/mysubpage/')).to.equal('/2021/');
  });

  it('detachElement-simple', () => {
    const div = document.createElement('div');
    const a = document.createElement('a');
    div.append(a);
    expect(detachElement(a)).to.eq(a);
    expect(div.children.length).to.eq(0);
  });

  it('detachElement-paragraph', () => {
    const div = document.createElement('div');
    const p = document.createElement('p');
    div.append(p);
    const a = document.createElement('a');
    p.append(a);
    expect(detachElement(a)).to.eq(a);
    expect(div.children.length, 'div.children').to.eq(0);
  });

  it('detachElement-otherWrapper', () => {
    const div = document.createElement('div');
    const div2 = document.createElement('div');
    div.append(div2);
    const a = document.createElement('a');
    div2.append(a);
    expect(detachElement(a)).to.eq(a);
    expect(div.children.length, 'div.children').to.eq(1);
    expect(div2.children.length, 'div2.children').to.eq(0);
  });
});
