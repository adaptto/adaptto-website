# adaptTo() Website

[![Build](https://github.com/adaptto/adaptto-website/actions/workflows/build.yaml/badge.svg?branch=main)](https://github.com/adaptto/adaptto-website/actions?query=workflow%3ABuild+branch%3Amain)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=adaptto_adaptto-website&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=adaptto_adaptto-website) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=adaptto_adaptto-website&metric=coverage)](https://sonarcloud.io/summary/new_code?id=adaptto_adaptto-website)

adaptTo() Website based on Edge Delivery Services (AEM Franklin).

## Environments
- Preview: https://main--adaptto-website--adaptto.aem.page/
- Live: https://adapt.to/ (https://main--adaptto-website--adaptto.aem.live/)

## Installation

```sh
npm install
```

## Tests

```sh
npm test
```

## Linting

```sh
npm run lint
```

## Local development

1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
2. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
3. Open the `{repo}` directory in your favorite IDE and start coding :)
