/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import decorate from '../../../blocks/embed-youtube/embed-youtube.js';
import { buildBlock } from '../../../scripts/lib-franklin.js';
import { setConsentManagementEnabled } from '../../../scripts/utils/usercentrics.js';

/**
 * @param {string} url
 * @returns {Element}
 */
function createEmbedBlock(url) {
  const link = document.createElement('a');
  link.href = url;
  const block = buildBlock('embed-youtube', link);
  decorate(block);
  return block;
}

/**
 * Assert block with given URL and expected video ID
 * @param {string} url YouTube URL (any variant)
 * @param {string} vid Expected Video ID
 */
function assertVideoPlayer(url, vid) {
  setConsentManagementEnabled(false);
  const block = createEmbedBlock(url);

  expect(block.querySelector('iframe')?.getAttribute('src')).to.eq(`https://www.youtube.com/embed/${vid}`);
}

describe('blocks/embed-youtube', () => {
  it('url-variant-1', () => {
    assertVideoPlayer('https://www.youtube.com/watch?v=XX1-ABC1234', 'XX1-ABC1234');
  });

  it('url-variant-2', () => {
    assertVideoPlayer('https://m.youtube.com/watch?v=XX2-ABC1234&feature=em-uploademail', 'XX2-ABC1234');
  });

  it('url-variant-3', () => {
    assertVideoPlayer('https://www.youtube.com/embed/XX3-ABC1234', 'XX3-ABC1234');
  });

  it('invalid-url', () => {
    const block = createEmbedBlock('https://adapt.to');
    const placeholder = block.querySelector('.embed-placeholder');
    expect(placeholder).to.not.exist;
  });
});
