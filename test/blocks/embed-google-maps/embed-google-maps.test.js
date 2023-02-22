/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import decorate from '../../../blocks/embed-google-maps/embed-google-maps.js';
import { buildBlock } from '../../../scripts/lib-franklin.js';
import { setConsentManagementEnabled } from '../../../scripts/utils/usercentrics.js';

describe('blocks/embed-google-maps', () => {
  it('block', () => {
    setConsentManagementEnabled(false);

    const link = document.createElement('a');
    link.href = 'https://google-maps/';
    const block = buildBlock('embed-google-maps', link);
    decorate(block);

    expect(block.querySelector('iframe')?.src).to.eq('https://google-maps/');
  });
});
