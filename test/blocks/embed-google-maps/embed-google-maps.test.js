/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import decorate from '../../../blocks/embed-google-maps/embed-google-maps.js';
import { buildBlock } from '../../../scripts/lib-franklin.js';
import { decorateConsentManagement, setConsentManagementEnabled } from '../../../scripts/utils/usercentrics.js';
import { sleep } from '../../scripts/test-utils.js';

describe('blocks/embed-google-maps', () => {
  it('noConsentManagement', () => {
    setConsentManagementEnabled(false);

    const link = document.createElement('a');
    link.href = 'https://google-maps/';
    const block = buildBlock('embed-google-maps', link);
    decorate(block);

    expect(block.querySelector('iframe')?.src).to.eq('https://google-maps/');
  });

  it('withConsentManagement', async () => {
    setConsentManagementEnabled(true);

    const link = document.createElement('a');
    link.href = 'https://google-maps/';
    const block = buildBlock('embed-google-maps', link);
    decorate(block);

    decorateConsentManagement(document.head);

    // simulate loading of UC
    window.dispatchEvent(new Event('UC_UI_INITIALIZED'));

    await sleep();
    expect(block.querySelector('.usercentrics-consent-dialog')).to.exist;
  });
});
