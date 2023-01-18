/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import { getScheduleData } from '../../scripts/ScheduleData.js';

const scheduleData = await getScheduleData(
  '/test/test-data/schedule-data-sample.json',
  '/test/test-data/query-index-schedule-2020.json',
);

describe('ScheduleData', () => {
  it('getDays', () => {
    const days = scheduleData.getDays();
    expect(days.length, 'days').to.eq(3);

    const day1 = days[0];
    expect(day1.day, 'day 1').to.eq(1);
    expect(day1.start.toISOString(), 'day 1 start').to.eq('2020-09-28T10:00:00.000Z');
    expect(day1.end.toISOString(), 'day 1 end').to.eq('2020-09-28T18:30:00.000Z');
    expect(day1.entries.length, 'day 1 entries').to.eq(21);

    const other11 = day1.entries[0];
    expect(other11.day).to.eq(1);
    expect(other11.track).to.eq(0);
    expect(other11.start.toISOString()).to.eq('2020-09-28T10:00:00.000Z');
    expect(other11.end.toISOString()).to.eq('2020-09-28T10:30:00.000Z');
    expect(other11.title).to.eq('Opening Words / Status Apache Sling');
    expect(other11.duration).to.eq(30);
    expect(other11.durationFAQ).to.eq(0);
    expect(other11.type).to.eq('other');
    expect(other11.speakers).to.eql(['Robert Munteanu', 'Stefan Seifert']);
    expect(other11.talkPath).to.undefined;

    const talk12 = day1.entries[1];
    expect(talk12.day).to.eq(1);
    expect(talk12.track).to.eq(0);
    expect(talk12.start.toISOString()).to.eq('2020-09-28T10:30:00.000Z');
    expect(talk12.end.toISOString()).to.eq('2020-09-28T11:00:00.000Z');
    expect(talk12.title).to.eq('Keynote: A cloud-native AEM');
    expect(talk12.duration).to.eq(25);
    expect(talk12.durationFAQ).to.eq(5);
    expect(talk12.type).to.eq('talk');
    expect(talk12.speakers).to.eql(['Alexander Saar', 'Carsten Ziegeler']);
    expect(talk12.talkPath).to.eq('/2020/schedule/keynote-a-cloud-native-aem');

    const break13 = day1.entries[2];
    expect(break13.day).to.eq(1);
    expect(break13.track).to.eq(0);
    expect(break13.start.toISOString()).to.eq('2020-09-28T11:00:00.000Z');
    expect(break13.end.toISOString()).to.eq('2020-09-28T11:15:00.000Z');
    expect(break13.title).to.eq('Break');
    expect(break13.duration).to.eq(15);
    expect(break13.durationFAQ).to.eq(0);
    expect(break13.type).to.eq('break');
    expect(break13.speakers).to.eql([]);
    expect(break13.talkPath).to.undefined;

    const day2 = days[1];
    expect(day2.entries.length, 'day 2 entries').to.eq(20);

    const day3 = days[2];
    expect(day3.entries.length, 'day 3 entries').to.eq(19);
  });

  it('getTalkEntry', () => {
    const entry = scheduleData.getTalkEntry('/2020/schedule/filevault-validation');
    expect(entry).to.exist;
  });

  it('getTalkEntry-invalid', () => {
    const entry = scheduleData.getTalkEntry('/2020/schedule/invalid-entry');
    expect(entry).to.not.exist;
  });
});
