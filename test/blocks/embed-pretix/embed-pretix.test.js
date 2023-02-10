/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import decorate from '../../../blocks/embed-pretix/embed-pretix.js';
import { buildBlock } from '../../../scripts/lib-franklin.js';

describe('blocks/embed-pretix', () => {
  it('block', () => {
    const block = buildBlock('embed-pretix', [
      ['shop-url', 'https://pretix/shop-url'],
      ['shop-css-url', 'https://pretix/shop-css-url'],
      ['script-url', 'https://pretix/script-url'],
    ]);
    decorate(block);

    expect(document.head.querySelector('script[src=\'https://pretix/script-url\']')).to.exist;
    expect(block.querySelector('pretix-widget[event=\'https://pretix/shop-url\']')).to.exist;
  });
});
