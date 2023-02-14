/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import { getTalkArchive } from '../../../scripts/services/TalkArchive.js';
import TalkArchiveFilter from '../../../scripts/services/TalkArchiveFilter.js';
import { stubFetchUrlMap } from '../test-utils.js';

stubFetchUrlMap({ '/query-index.json': '/test/test-data/query-index-schedule-2020.json' });
const talkArchive = await getTalkArchive();

describe('services/TalkArchive', () => {
  it('filterOptions', () => {
    expect(talkArchive.getTagFilterOptions()).to.eql([
      'AEM',
      'Analytics',
      'Commerce',
      'DevOps',
      'Frontend',
      'OSGi',
      'Oak JCR',
      'Sling',
      'Target',
      'Testing',
      'Tooling',
      'wcm-io',
    ]);
    expect(talkArchive.getYearFilterOptions()).to.eql(['2020']);
    expect(talkArchive.getSpeakerFilterOptions().length).to.eq(49);
  });

  it('getFilteredTalks-unfiltered', () => {
    talkArchive.applyFilter(undefined);
    const talks = talkArchive.getFilteredTalks();
    expect(talks.length).to.eq(46);
    expect(talks[0].path).to.eq('/2020/schedule/a-hackers-perspective-on-aem-applications-security');
    expect(talks[0].title).to.eq('A Hacker\'s perspective on AEM applications security');
    expect(talks[45].path).to.eq('/2020/schedule/use-the-adobe-client-data-layer-to-track-data-on-your-website');
  });

  it('getFilteredTalks-filtered', () => {
    const filter = new TalkArchiveFilter();
    filter.tags = ['OSGi'];
    talkArchive.applyFilter(filter);
    const talks = talkArchive.getFilteredTalks();
    expect(talks.length).to.eq(1);
    expect(talks[0].path).to.eq('/2020/schedule/future-proof-your-applications-with-api-regions');
  });

  it('getFilteredTalksFullTextSearch-unfiltered', () => {
    talkArchive.applyFilter(undefined);
    const talks = talkArchive.getFilteredTalksFullTextSearch('API');
    expect(talks.length).to.eq(1);
    expect(talks[0].path).to.eq('/2020/schedule/future-proof-your-applications-with-api-regions');
  });

  it('getFilteredTalksFullTextSearch-filtered', () => {
    const filter = new TalkArchiveFilter();
    filter.tags = ['OSGi'];
    talkArchive.applyFilter(filter);
    const talks = talkArchive.getFilteredTalksFullTextSearch('API');
    expect(talks.length).to.eq(1);
    expect(talks[0].path).to.eq('/2020/schedule/future-proof-your-applications-with-api-regions');
  });
});
