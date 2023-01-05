# adaptTo() Website

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=adaptto_adaptto-website&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=adaptto_adaptto-website) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=adaptto_adaptto-website&metric=coverage)](https://sonarcloud.io/summary/new_code?id=adaptto_adaptto-website)

adaptTo() Website based on AEM Franklin.

## Environments
- Preview: https://main--adaptto-website--adaptto.hlx.page/
- Live: https://main--adaptto-website--adaptto.hlx.live/

## Installation

```sh
npm i
```

## Tests

```sh
npm tst
```

## Cloud development

1. Click "Use this template" and create a new repository based on the `helix-project-boilerplate` template and add a mountpoint in the `fstab.yaml`
2. Click "Code" and create a new codespace from your new repository
3. Start Franklin Proxy: `hlx up` (opens your browser at `http://localhost:3000` or a proxied version)
4. Start coding, your browser is your IDE now.

## Local development

1. Create a new repository based on the `helix-project-boilerplate` template and add a mountpoint in the `fstab.yaml`
2. Add the [helix-bot](https://github.com/apps/helix-bot) to the repository
3. Install the [Helix CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/helix-cli`
4. Start Franklin Proxy: `hlx up` (opens your browser at `http://localhost:3000`)
5. Open the `adaptto-website` directory in your favorite IDE and start coding :)
