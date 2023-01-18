/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import QueryIndex, { getQueryIndex } from '../../scripts/QueryIndex.js';
import QueryIndexItem from '../../scripts/QueryIndexItem.js';

/** @type {QueryIndex} */
const queryIndex = await getQueryIndex('/test/scripts/query-index-sample.json');

describe('QueryIndex', () => {
  it('getItem-all-properties', () => {
    /** @type {QueryIndexItem} */
    const item = queryIndex.getItem('/sample-all-properties');
    expect(item).to.exist;
    expect({
      path: '/sample-all-properties',
      title: 'Sample Title',
      robots: 'no-index, no-follow',
      image: '/sample-image.jpg',
      tags: '["Tag1","Tag2"]',
      affiliation: 'Company 1',
      twitter: '@twitter1',
      'speaker-alias': 'speaker-1',
      uptoyear: '2020',
      speakers: 'Speaker 1, Speaker 2',
    }).to.eql(item);
    expect(item.getRobots()).to.eql(['no-index', 'no-follow']);
    expect(item.getTags()).to.eql(['Tag1', 'Tag2']);
    expect(item.getSpeakers()).to.eql(['Speaker 1', 'Speaker 2']);
  });

  it('getItem-missing-properties', () => {
    /** @type {QueryIndexItem} */
    const item = queryIndex.getItem('/sample-missing-properties');
    expect(item).to.exist;
    expect(item.getRobots()).to.eql([]);
    expect(item.getTags()).to.eql([]);
  });

  it('getItem-tags-csv-fallback', () => {
    /** @type {QueryIndexItem} */
    const item = queryIndex.getItem('/sample-tags-csv-fallback');
    expect(item).to.exist;
    expect(item.getTags()).to.eql(['Tag1', 'Tag2']);
  });

  it('getItem-invalid-path', () => {
    /** @type {QueryIndexItem} */
    const item = queryIndex.getItem('/invalid-path');
    expect(item).to.not.exist;
  });

  it('getAllSiteRoots', () => {
    /** @type {QueryIndexItem[]} */
    const result = queryIndex.getAllSiteRoots();
    expect(result.map((item) => item.path)).to.eql(['/2021/', '/2020/']);
  });
});
