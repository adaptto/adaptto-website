/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import { parseCSVArray, parseJsonArray } from '../../../scripts/utils/metadata.js';

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
});
