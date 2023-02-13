/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import decorate from '../../../blocks/embed-newsletter/embed-newsletter.js';
import { buildBlock } from '../../../scripts/lib-franklin.js';

describe('blocks/embed-pretix', () => {
  it('block', () => {
    const block = buildBlock('embed-newsletter', []);
    decorate(block);

    expect(block.querySelector('script[src=\'//js.hsforms.net/forms/v2.js\']')).to.exist;
  });
});
