/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import { getTalkArchive } from '../../../scripts/services/TalkArchive.js';
import TalkArchiveFilter from '../../../scripts/services/TalkArchiveFilter.js';
import { stubFetchUrlMap } from '../test-utils.js';

stubFetchUrlMap({ '/query-index.json': '/test/test-data/query-index-schedule-samename.json' });
const talkArchive = await getTalkArchive();

describe('services/TalkArchive same-name speakers', () => {
  it('resolves speaker document names to display names in filter options', () => {
    expect(talkArchive.getSpeakerFilterOptions()).to.eql([
      'Konrad Windszus',
      'Nitin Gupta',
    ]);
  });

  it('resolves speaker document names to display names on talks', () => {
    talkArchive.applyFilter(undefined);
    const talks = talkArchive.getFilteredTalks();
    const talkOne = talks.find((talk) => talk.path === '/2024/schedule/talk-one');
    const talkTwo = talks.find((talk) => talk.path === '/2024/schedule/talk-two');
    expect(talkOne.speakers).to.eql(['Nitin Gupta']);
    expect(talkTwo.speakers).to.eql(['Nitin Gupta']);
  });

  it('filters both same-name speaker variants by display name', () => {
    const filter = new TalkArchiveFilter();
    filter.speakers = ['Nitin Gupta'];
    talkArchive.applyFilter(filter);
    const talks = talkArchive.getFilteredTalks();
    expect(talks.map((talk) => talk.path).sort()).to.eql([
      '/2024/schedule/talk-one',
      '/2024/schedule/talk-two',
    ]);
  });
});
