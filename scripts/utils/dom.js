/**
 * Creates a new document element.
 * @param {Document} document
 * @param {string} tagName
 * @param {string[]} classNames
 * @returns {Element} Created element
 */
function create(document, tagName, ...classNames) {
  const el = document.createElement(tagName);
  if (classNames && classNames.length > 0) {
    el.classList.add(...classNames);
  }
  return el;
}

/**
 * Creates a new document element and appends it to given parent.
 * @param {Element} parentElement
 * @param {string} tagName
 * @param {string[]} classNames
 * @returns {Element} Created element
 */
export function append(parentElement, tagName, ...classNames) {
  const el = create(parentElement.ownerDocument, tagName, ...classNames);
  parentElement.append(el);
  return el;
}

/**
 * Creates a new document element and prepends it to given parent.
 * @param {Element} parentElement
 * @param {string} tagName
 * @param {string[]} classNames
 * @returns {Element} Created element
 */
export function prepend(parentElement, tagName, ...classNames) {
  const el = create(parentElement.ownerDocument, tagName, ...classNames);
  parentElement.prepend(el);
  return el;
}
