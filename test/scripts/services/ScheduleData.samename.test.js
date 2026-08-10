/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import { getScheduleData } from '../../../scripts/services/ScheduleData.js';
import { stubFetchUrlMap } from '../test-utils.js';

stubFetchUrlMap({ '/query-index.json': '/test/test-data/query-index-schedule-samename.json' });
const scheduleData = await getScheduleData('/test/test-data/schedule-data-samename.json');

describe('services/ScheduleData same-name speakers', () => {
  it('resolves speaker document names to display names', () => {
    const talkOne = scheduleData.getTalkEntry('/2024/schedule/talk-one');
    const talkTwo = scheduleData.getTalkEntry('/2024/schedule/talk-two');
    expect(talkOne.speakers).to.eql(['Nitin Gupta']);
    expect(talkTwo.speakers).to.eql(['Nitin Gupta']);
  });
});
