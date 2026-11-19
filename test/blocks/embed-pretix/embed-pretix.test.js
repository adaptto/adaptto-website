/* eslint-disable no-unused-expressions */
/* global describe it afterEach */

import { expect } from '@esm-bundle/chai';
import decorate from '../../../blocks/embed-pretix/embed-pretix.js';
import { buildBlock } from '../../../scripts/aem.js';
import { setConsentManagementEnabled } from '../../../scripts/utils/usercentrics.js';

describe('blocks/embed-pretix', () => {
  afterEach(() => {
    delete window.PretixWidget;
  });

  function buildPretixBlock() {
    return buildBlock('embed-pretix', [
      ['shop-url', 'https://pretix/shop-url'],
      ['shop-css-url', 'https://pretix/shop-css-url'],
      ['script-url', 'https://pretix/script-url'],
    ]);
  }

  it('block', async () => {
    setConsentManagementEnabled(false);

    const block = buildPretixBlock();
    decorate(block);

    // widget element must exist before the script is executed
    expect(block.querySelector('pretix-widget[event=\'https://pretix/shop-url\']')).to.exist;
    expect(document.head.querySelector('script[src=\'https://pretix/script-url\']')).to.exist;
  });

  it('builds widgets directly if pretix script is already loaded', async () => {
    setConsentManagementEnabled(false);
    let buildWidgetsCalls = 0;
    window.PretixWidget = { buildWidgets: () => { buildWidgetsCalls += 1; } };
    const scriptCount = document.head.querySelectorAll('script[src=\'https://pretix/script-url\']').length;

    const block = buildPretixBlock();
    decorate(block);

    expect(block.querySelector('pretix-widget[event=\'https://pretix/shop-url\']')).to.exist;
    expect(buildWidgetsCalls).to.eq(1);
    expect(document.head.querySelectorAll('script[src=\'https://pretix/script-url\']').length).to.eq(scriptCount);
  });
});
