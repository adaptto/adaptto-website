import { getMetadata } from '../aem.js';

/**
 * Checks fullscreen mode.
 * @returns true if fullscreen template is set.
 */
// eslint-disable-next-line import/prefer-default-export
export function isFullscreen() {
  return getMetadata('template') === 'fullscreen';
}
