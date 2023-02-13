/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import decorate from '../../../blocks/embed-newsletter/embed-newsletter.js';
import { buildBlock } from '../../../scripts/lib-franklin.js';

describe('blocks/embed-newsletter', () => {
  it('block', async () => {
    const block = buildBlock('embed-newsletter', []);
    decorate(block);

    const script = block.querySelector('script[src=\'//js.hsforms.net/forms/v2.js\']');
    expect(script).to.exist;

    script.dispatchEvent(new Event('load'));
    expect(block.querySelector('p.text-warning')).to.exist;
  });
});
