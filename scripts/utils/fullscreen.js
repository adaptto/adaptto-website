import { getMetadata } from '../lib-franklin.js';

/**
 * Checks fullscreen mode.
 * @returns true if fullscreen template is set.
 */
export function isFullscreen() {
  return getMetadata('template') === 'fullscreen';
}
