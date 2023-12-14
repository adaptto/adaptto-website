/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import {
  buildTwitterHandle,
  buildTwitterUrl,
  parseCSVArray,
  parseJsonArray,
  removeTitleSuffix,
} from '../../../scripts/utils/metadata.js';

describe('utils/metadata', () => {
  it('parseCSVArray', () => {
    expect(parseCSVArray('Token 1')).to.eql(['Token 1']);
    expect(parseCSVArray('Token 1, Token 2 ')).to.eql(['Token 1', 'Token 2']);
    expect(parseCSVArray('')).to.eql([]);
    expect(parseCSVArray(undefined)).to.eql([]);
  });

  it('parseJsonArray', () => {
    expect(parseJsonArray('["Token 1","Token 2"]')).to.eql(['Token 1', 'Token 2']);
    expect(parseJsonArray('Token 1')).to.eql(['Token 1']);
    expect(parseJsonArray('Token 1, Token 2 ')).to.eql(['Token 1', 'Token 2']);
    expect(parseJsonArray('')).to.eql([]);
    expect(parseJsonArray(undefined)).to.eql([]);
  });

  it('removeTitleSuffix', () => {
    expect(removeTitleSuffix('My Title - adaptTo() 2021')).to.eq('My Title');
    expect(removeTitleSuffix('My Title, adaptTo() 2021')).to.eq('My Title');
    expect(removeTitleSuffix('My Title - Second One  -   adaptTo()  2020 ')).to.eq('My Title - Second One');
    expect(removeTitleSuffix('adaptTo()  2021')).to.eq('adaptTo()  2021');
    expect(removeTitleSuffix('')).to.eq('');
    expect(removeTitleSuffix(undefined)).to.not.exist;
  });

  it('buildTwitterHandle', () => {
    expect(buildTwitterHandle('@user1')).to.eq('@user1');
    expect(buildTwitterHandle('user2')).to.eq('@user2');
  });

  it('buildTwitterUrl', () => {
    expect(buildTwitterUrl('@user1')).to.eq('https://twitter.com/@user1');
    expect(buildTwitterUrl('user2')).to.eq('https://twitter.com/@user2');
  });
});
