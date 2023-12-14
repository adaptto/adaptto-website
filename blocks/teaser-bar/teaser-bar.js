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

  // put link around image if no anchor around image present in markup
  block.querySelectorAll('div').forEach((div) => {
    const img = div.querySelector('.image > picture');
    const link = div.querySelector('.link a');
    if (img && link) {
      const imgContainer = img.parentElement;
      const imgAnchor = document.createElement('a');
      imgAnchor.href = link.href;
      imgAnchor.target = link.target;
      imgAnchor.append(img);
      imgContainer.append(imgAnchor);
    }
  });
}
