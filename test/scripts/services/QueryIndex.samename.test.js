/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import { getQueryIndex } from '../../../scripts/services/QueryIndex.js';
import { stubFetchUrlMap } from '../test-utils.js';

stubFetchUrlMap({ '/query-index.json': '/test/test-data/query-index-schedule-samename.json' });
const queryIndex = await getQueryIndex();

describe('services/QueryIndex same-name speakers', () => {
  it('sorts speaker document names by resolved display name', () => {
    const speakers = queryIndex.getTalkSpeakerNames('/2024/');
    // resolve to display names to check alphabetical ordering
    const displayNames = speakers.map(
      (speaker) => queryIndex.getSpeaker(speaker, '/2024/')?.title ?? speaker,
    );
    expect(displayNames).to.eql([
      'Konrad Windszus',
      'Nitin Gupta',
      'Nitin Gupta',
    ]);
  });
});
