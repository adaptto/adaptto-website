/**
 * Decorates paragraphs containing a single link as buttons.
 * This is the "classic" auto-buttonization that was part of aem.js until v3.0.0.
 * It is kept as project code because existing content and styles rely on it
 * (see AEM-BOILERPLATE-SYNC.md).
 * - Link as only child of a paragraph/div: `a.button`
 * - Bold link as only content of a paragraph: `a.button.primary`
 * - Italic link as only content of a paragraph: `a.button.secondary`
 * The paragraph gets the class `button-container`.
 * @param {Element} element container element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateButtons(element) {
  element.querySelectorAll('a').forEach((a) => {
    a.title = a.title || a.textContent;
    if (a.href !== a.textContent) {
      const up = a.parentElement;
      const twoup = a.parentElement.parentElement;
      if (!a.querySelector('img')) {
        if (up.childNodes.length === 1 && (up.tagName === 'P' || up.tagName === 'DIV')) {
          a.className = 'button'; // default
          up.classList.add('button-container');
        }
        if (
          up.childNodes.length === 1
          && up.tagName === 'STRONG'
          && twoup.childNodes.length === 1
          && twoup.tagName === 'P'
        ) {
          a.className = 'button primary';
          twoup.classList.add('button-container');
        }
        if (
          up.childNodes.length === 1
          && up.tagName === 'EM'
          && twoup.childNodes.length === 1
          && twoup.tagName === 'P'
        ) {
          a.className = 'button secondary';
          twoup.classList.add('button-container');
        }
      }
    }
  });
}
