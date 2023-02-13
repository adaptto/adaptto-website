import html from '../../scripts/utils/htmlTemplateTag.js';

/**
 * Embed Hubspot newsletter signup form.
 * @param {Element} block
 */
export default function decorate(block) {
  // add hubspot script to HTML head
  const script = document.createElement('script');
  script.src = '//js.hsforms.net/forms/v2.js';
  script.type = 'text/javascript';
  script.onload = () => {
    try {
      hbspt.forms.create({
        portalId: "3937475",
        formId: "4d3174fb-0e39-4596-b6a8-4b63caeae340"
      });
    }
    catch (e) {
      block.insertAdjacentHTML('beforeend', `<p class="text-warning">
        Newsletter registration form cannot be displayed - please give consent to 'HubSpot Forms' service.<br>
        <small>${e}</small>
      </p>`);
    }
  }
  block.append(script);
}
