/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import decorate from '../../../blocks/embed-newsletter/embed-newsletter.js';
import { buildBlock } from '../../../scripts/lib-franklin.js';
import { setConsentManagementEnabled } from '../../../scripts/utils/usercentrics.js';

describe('blocks/embed-newsletter', () => {
  it('block', async () => {
    setConsentManagementEnabled(false);

    const block = buildBlock('embed-newsletter', []);
    decorate(block);

    const script = block.querySelector('script[src=\'https://js.hsforms.net/forms/v2.js\']');
    expect(script).to.exist;
  });
});
