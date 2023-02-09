/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import TalkArchiveFilter, { getFilterFromHash } from '../../../scripts/services/TalkArchiveFilter.js';
import TalkArchiveItem from '../../../scripts/services/TalkArchiveItem.js';

const talkNoProps = new TalkArchiveItem();

const talk1 = new TalkArchiveItem();
talk1.path = '/2021/schedule/talk1';
talk1.year = '2021';
talk1.title = 'Talk 1';
talk1.description = 'Talk 1 Description';
talk1.keywords = ['Keyword 1', 'Keyword 2'];
talk1.tags = ['Tag1', 'Tag2'];
talk1.speakers = ['Speaker 1', 'Speaker 2'];

const talk2 = new TalkArchiveItem();
talk2.path = '/2020/schedule/talk2';
talk2.year = '2020';
talk2.title = 'Talk 2';
talk2.description = 'Talk 2 Description';
talk2.keywords = ['Keyword 2', 'Keyword 3'];
talk2.tags = ['Tag2', 'Tag3'];
talk2.speakers = ['Speaker 1', 'Speaker 3'];

describe('services/TalkArchiveFilter', () => {
  it('matchesAll', () => {
    const filter = new TalkArchiveFilter();
    expect(filter.buildHash()).to.eq('#');
    expect(filter.matches(talkNoProps)).to.true;
    expect(filter.matches(talk1)).to.true;
    expect(filter.matches(talk2)).to.true;
  });

  it('matchesTags', () => {
    const filter = new TalkArchiveFilter();

    filter.tags = ['Tag1'];
    expect(filter.matches(talkNoProps)).to.false;
    expect(filter.matches(talk1)).to.true;
    expect(filter.matches(talk2)).to.false;

    filter.tags = ['Tag2'];
    expect(filter.matches(talkNoProps)).to.false;
    expect(filter.matches(talk1)).to.true;
    expect(filter.matches(talk2)).to.true;

    filter.tags = ['Tag3'];
    expect(filter.matches(talkNoProps)).to.false;
    expect(filter.matches(talk1)).to.false;
    expect(filter.matches(talk2)).to.true;

    filter.tags = ['Tag1', 'Tag2'];
    expect(filter.buildHash()).to.eq('#tags=Tag1,Tag2');
    expect(filter.matches(talkNoProps)).to.false;
    expect(filter.matches(talk1)).to.true;
    expect(filter.matches(talk2)).to.true;
  });

  it('matchesYears', () => {
    const filter = new TalkArchiveFilter();
    filter.years = ['2021'];
    expect(filter.matches(talkNoProps)).to.false;
    expect(filter.matches(talk1)).to.true;
    expect(filter.matches(talk2)).to.false;

    filter.years = ['2020'];
    expect(filter.matches(talkNoProps)).to.false;
    expect(filter.matches(talk1)).to.false;
    expect(filter.matches(talk2)).to.true;

    filter.years = ['2021', '2020'];
    expect(filter.buildHash()).to.eq('#years=2021,2020');
    expect(filter.matches(talkNoProps)).to.false;
    expect(filter.matches(talk1)).to.true;
    expect(filter.matches(talk2)).to.true;
  });

  it('matchesSpeakers', () => {
    const filter = new TalkArchiveFilter();
    filter.speakers = ['Speaker 1'];
    expect(filter.matches(talkNoProps)).to.false;
    expect(filter.matches(talk1)).to.true;
    expect(filter.matches(talk2)).to.true;

    filter.speakers = ['Speaker 2'];
    expect(filter.matches(talkNoProps)).to.false;
    expect(filter.matches(talk1)).to.true;
    expect(filter.matches(talk2)).to.false;

    filter.speakers = ['Speaker 3'];
    expect(filter.matches(talkNoProps)).to.false;
    expect(filter.matches(talk1)).to.false;
    expect(filter.matches(talk2)).to.true;

    filter.speakers = ['Speaker 1', 'Speaker 2'];
    expect(filter.buildHash()).to.eq('#speakers=Speaker%201,Speaker%202');
    expect(filter.matches(talkNoProps)).to.false;
    expect(filter.matches(talk1)).to.true;
    expect(filter.matches(talk2)).to.true;
  });

  it('matchesCombined', () => {
    const filter = new TalkArchiveFilter();
    filter.speakers = ['Speaker 1'];
    filter.tags = ['Tag1', 'Tag2'];
    filter.years = ['2020'];
    expect(filter.buildHash()).to.eq('#tags=Tag1,Tag2/years=2020/speakers=Speaker%201');
    expect(filter.matches(talkNoProps)).to.false;
    expect(filter.matches(talk1)).to.false;
    expect(filter.matches(talk2)).to.true;
  });

  it('getFilterFromHash-empty', () => {
    const filter = getFilterFromHash('');
    expect(filter.tags).to.not.exist;
  });

  it('getFilterFromHash-options', () => {
    const filter = getFilterFromHash('#speakers=Speaker%201,Speaker%202/tags=Tag1,Tag2,Tag3/years=2020');
    expect(filter.tags).to.eql(['Tag1', 'Tag2', 'Tag3']);
    expect(filter.years).to.eql(['2020']);
    expect(filter.speakers).to.eql(['Speaker 1', 'Speaker 2']);
  });
});
