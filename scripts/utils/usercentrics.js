/**
 * Integration of Usercentrics Consent Management.
 * Based on Web CMP v2, but without Smart Data Protector.
 * Web CMP v2 is still a very big script (~180k), so special treatment is applied
 * to be performant. If a block is rendered before UC is actually initialized
 * a loading spinner is displayed. Once loaded, the spinner is replaced with
 * the block content, or a consent dialog message.
 * Via the decorateWithConsent all blocks depending on consent are registering
 * themselves with a decorate method and the block parent element. If consent
 * status changes (event triggered), the block is re-rendered automatically.
 */
import { isFullscreen } from './fullscreen.js';
import html from './htmlTemplateTag.js';

const settingsId = 'o544Hdz9e';
const serviceIds = {
  youtube: 'BJz7qNsdj-7',
  googleMaps: 'S1pcEj_jZX',
  hubspot: 'r1Fhc4iOoWX',
  pretix: '4gBcUVFgPUn-Zs',
};

let enabled = false;
let isInitialized = false;
const lastServiceConsentStatus = new Map();
const serviceElementDecorators = new Map();

/**
 * Checks if user has given consent to given service
 * @param {string} service Service name
 * @returns {boolean} true if consent is given
 */
function isConsentGiven(service) {
  if (!window.UC_UI) {
    return false;
  }
  const serviceId = serviceIds[service];
  return window.UC_UI.getServicesBaseInfo()
    .find((item) => item.id === serviceId && item.consent?.status) !== undefined;
}

/**
 * Get full service information for consent dialog message.
 * @param {string} service Service name
 * @return {Promise} Service info
 */
async function getServiceInfo(service) {
  if (!window.UC_UI) {
    return undefined;
  }
  const serviceId = serviceIds[service];
  const fullInfos = await window.UC_UI.getServicesFullInfo();
  return fullInfos.find((item) => item.id === serviceId);
}

/**
 * Renders the consent dialog message if consent for a service is not given.
 * @param {string} service Service name
 * @param {Element} parent Parent element
 */
async function decorateConsentDialogMessage(service, parent) {
  const serviceInfo = await getServiceInfo(service) || { name: service, description: '' };
  parent.innerHTML = html`
  <div class="usercentrics-consent-dialog usercentrics-placeholder">
    <h3>We need your consent to load the ${serviceInfo.name} service!</h3>
    <p>${serviceInfo.description}</p>
    <button class="more-info">More Information</button>
    <button class="accept">Accept</button>
  </div>
  `;
  parent.querySelector('button.more-info').addEventListener('click', () => {
    window.UC_UI.showSecondLayer(serviceInfo.id);
  });
  parent.querySelector('button.accept').addEventListener('click', () => {
    window.UC_UI.acceptService(serviceInfo.id);
  });
}

/**
 * Checks current consent status and re-Decorates block either with
 * actual content, or with consent message.
 * If Usercentrics is not initialized yet, render a loading spinner.
 * @param {string} service Service
 * @param {Element} parent Parent element
 * @param {function} decorator Decorator method
 */
function decorateDependingOnConsent(service, parent, decorator) {
  parent.innerHTML = '';
  if (isConsentGiven(service)) {
    decorator(parent);
  } else if (isInitialized) {
    decorateConsentDialogMessage(service, parent);
  } else {
    parent.innerHTML = html`<img class="usercentrics-loading-spinner usercentrics-placeholder" src="/resources/img/spinner.svg" alt=""/>`;
  }
}

/**
 * Updates the consent status for all configured services.
 * Detects actual changes in consent status and triggers a re-display of the affected block(s).
 */
function updateConsentStatus() {
  Object.keys(serviceIds).forEach((service) => {
    const currentStatus = isConsentGiven(service);
    const lastStatus = lastServiceConsentStatus.get(service);
    if (currentStatus !== lastStatus) {
      // change in consent status detected - re-decorate all affected blocks
      const items = serviceElementDecorators.get(service) || [];
      items.forEach((item) => {
        decorateDependingOnConsent(service, item.parent, item.decorator);
      });
    }
    lastServiceConsentStatus.set(service, currentStatus);
  });
}

/**
 * Decorates block with given decorator method when consent is given.
 * If consent is not given, a dialog message is displayed to ask for consent.
 * If consent is given at any time, the decorator methods is executed.
 * @param {string} service Service name
 * @param {Element} parent Parent element (content is removed automatically)
 * @param {function} decorator Method to render the actual block content
 */
export function decorateWithConsent(service, parent, decorator) {
  if (!enabled) {
    decorator(parent);
    return;
  }
  // save decorator for later use
  const items = serviceElementDecorators.get(service) || [];
  items.push({ parent, decorator });
  serviceElementDecorators.set(service, items);
  // check current consent status
  decorateDependingOnConsent(service, parent, decorator);
}

/**
 * Activates Usercentrics Consent Management (if enabled).
 * @param {Element} head HTML Head
 */
export function decorateConsentManagement(head) {
  if (!enabled || isFullscreen()
      || document.querySelector('head script[src="https://app.Usercentrics.eu/browser-ui/latest/loader.js"]')) {
    return;
  }

  window.addEventListener('UC_UI_INITIALIZED', () => {
    isInitialized = true;
    updateConsentStatus();
  });
  window.addEventListener('UC_UI_CMP_EVENT', () => {
    if (isInitialized) {
      updateConsentStatus();
    }
  });

  // Usercentrics Web CMP v2
  const script = document.createElement('script');
  script.id = 'usercentrics-cmp';
  script.dataset.settingsId = settingsId;
  script.src = 'https://app.Usercentrics.eu/browser-ui/latest/loader.js';
  head.append(script);
}

/**
 * Allows to explicitly disable consent management (for unit tests).
 * @param {boolean} isEnabled Enabled
 */
export function setConsentManagementEnabled(isEnabled) {
  enabled = isEnabled;
}
