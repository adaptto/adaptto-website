/**
 * Teaser Bar.
 * @param {Element} block
 */
export default async function decorate(block) {
  block.querySelectorAll('div > p').forEach((p) => {
    if (p.querySelector('img')) {
      p.classList.add('image');
    } else if (p.querySelector('a')) {
      p.classList.add('link');
    } else {
      p.classList.add('text');
    }
  });
}
