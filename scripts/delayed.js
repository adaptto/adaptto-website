// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './aem.js';
import { decorateConsentManagement } from './utils/usercentrics.js';

// enable UserCentrics consent management
decorateConsentManagement(document.head);

// Core Web Vitals RUM collection
sampleRUM('cwv');
