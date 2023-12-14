/**
 * Sponsor Teaser.
 * @param {Element} block
 */
export default async function decorate(block) {
  // put link around image if no anchor around image present in markup
  block.querySelectorAll('div').forEach((div) => {
    const img = div.querySelector('p > picture');
    const link = div.querySelector('p a');
    if (img && link) {
      const imgContainer = img.parentElement;
      const imgAnchor = document.createElement('a');
      imgAnchor.href = link.href;
      imgAnchor.target = link.target;
      imgAnchor.append(img);
      imgContainer.append(imgAnchor);
      link.parentElement.remove();
    }
  });
}
