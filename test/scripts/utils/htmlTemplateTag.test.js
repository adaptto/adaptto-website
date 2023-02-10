// derived from https://github.com/AntonioVdlC/html-template-tag
/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import html from '../../../scripts/utils/htmlTemplateTag.js';

describe('html-template-tag', () => {
  it('should return a string when passed a string literal', () => {
    expect(typeof html`Hello, world!`).to.equal('string');
  });

  it('should preserve the string literal value', () => {
    expect(html`Hello, world!`).to.equal('Hello, world!');
  });

  it('should interpolate variables', () => {
    const name = 'Antonio';
    expect(html`Hello, ${name}!`).to.equal('Hello, Antonio!');
  });

  it('should escape HTML special characters', () => {
    const chars = {
      '&': '&amp;',
      '>': '&gt;',
      '<': '&lt;',
      '"': '&quot;',
      '\'': '&#39;',
      '`': '&#96;',
    };

    Object.keys(chars).forEach((key) => {
      expect(html`${key}`).to.equal(chars[key]);
    });
  });

  it('should skip escaping HTML special characters for substituitions with double $', () => {
    const safeString = '<strong>Antonio</strong>';
    expect(html`Hello, $${safeString}!`).to.equal(
      'Hello, <strong>Antonio</strong>!',
    );
  });

  it('should escape HTML special characters if previous substituition ended with $', () => {
    const insertedDollar = 'I :heart: $';
    const unsafeString = ' & €';
    const emptyString = '';
    expect(html`${insertedDollar}${unsafeString}!`).to.equal(
      'I :heart: $ &amp; €!',
    );
    expect(html`${insertedDollar}${emptyString}${unsafeString}!`).to.equal(
      'I :heart: $ &amp; €!',
    );
    expect(html`${insertedDollar}$${emptyString}${unsafeString}!`).to.equal(
      'I :heart: $ &amp; €!',
    );
    expect(html`$${insertedDollar}${emptyString}${unsafeString}!`).to.equal(
      'I :heart: $ &amp; €!',
    );
  });

  it('should generate valid HTML with an array of values', () => {
    const names = ['Megan', 'Tiphaine', 'Florent', 'Hoan'];

    expect(
      html`<div>
        My best friends are:
        <ul>
          ${names.map((name) => html`<li>${name}</li>`)}
        </ul>
      </div>`,
    ).to.equal(
      `<div>
        My best friends are:
        <ul>
          <li>Megan</li><li>Tiphaine</li><li>Florent</li><li>Hoan</li>
        </ul>
      </div>`,
    );
  });
});
