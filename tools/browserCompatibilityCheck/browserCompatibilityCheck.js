// To determine if various browsers support the page's styling,
// all css files will be run trough postcss-preset-env
// and checked if the css needs any modification (vendor prefix, polyfill, converting syntax),
// these changes will be printed out in the cli.
// This still won't guarantee that the browser even when supporting some css properties,
// will render them correct. As there is always browser bugs or ambiguity in the spec.
// same will be applied to the javascript syntax and api usage
// run this node script from command line from root folder

/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
const { readFile } = require('fs');
const { promisify } = require('util');
const { basename } = require('path');

const globby = require('globby');
const postcss = require('postcss');
const postcssPresetEnv = require('postcss-preset-env');
const babel = require('@babel/core');
const recast = require('recast');
const Diff = require('diff');

const readFileAsync = promisify(readFile);

// most common browsers by usage
const BROWSERS = [
  ['last 2 chrome versions', 'last 2 chromeAndroid versions'],
  ['last 2 safari versions', 'last 2 ios_saf versions'],
  'last 2 firefox versions',
  'last 2 samsung versions',
];

// text color for cmd log
const COLORS = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  gray: '\x1b[90m',
};

const cssSetup = {
  // all css files which will be used on the client. e.g. css for test is ignored
  files: ['styles/*.css', 'blocks/**/*.css'],

  async transformer(code, browser) {
    const result = await postcss([
      postcssPresetEnv({
        browsers: browser,
        enableClientSidePolyfills: true,
        // don't remove any unnecessary vendor prefixes,
        // as they might still be necessary for other browser not in the current browser item
        autoprefixer: { remove: false },
      }),
    ]).process(code, { from: undefined });

    result.warnings().forEach((warn) => {
      console.warn(warn.toString());
    });
    return result.css;
  },

  diff(code, result) {
    return Diff.diffCss(code, result);
  },
};

const jsSetup = {
  files: ['scripts/**/*.js', 'blocks/**/schedule.js', '!scripts/3rdparty/**/*.js'],

  async transformer(code, browser) {
    // unfortunately `babel.transform` alone will also have some small code changes
    // such as removing dangling commas, parenthesis etc
    // this workaround preserve the code style
    // {@see https://github.com/babel/babel/issues/8974#issuecomment-435813406}
    const ast = recast.parse(code, {
      parser: {
        parse: (source) => babel.parse(source, {}),
      },
    });

    const opts = {
      ast: true,
      code: false,
      configFile: false,
      plugins: [
        [
          function setAst(_babel, arg) {
            return {
              visitor: {
                Program(path) {
                  path.replaceWith(arg.ast.program);
                },
              },
            };
          }, { ast },
        ],
      ],
      sourceType: 'module',
      presets: [
        [
          '@babel/preset-env',
          {
            useBuiltIns: 'usage',
            modules: false,
            corejs: '3.28.0',
            targets: browser,
            debug: false,
          },
        ],
      ],
    };

    const output = await babel.transformAsync('', opts);

    // eslint-disable-next-line prefer-template
    return recast.print(output.ast, { lineTerminator: '\n' }).code + '\n';
  },

  diff(code, result) {
    return Diff.diffLines(code, result);
  },
};

(async () => {
  for (const setup of [jsSetup, cssSetup]) {
    const files = await globby(setup.files);
    for (const file of files) {
      let filenamePrinted = false;
      const code = await readFileAsync(file, 'utf8');

      for (const browser of BROWSERS) {
        let browserNamePrinted = false;

        const result = await setup.transformer(code, browser);

        // css/js didn't need any modification to support the browsers
        // ignore empty files
        // eslint-disable-next-line no-continue
        if (code.trim() === result.trim()) continue;
        if (!filenamePrinted) {
          console.log('\n########################################################');
          console.log(basename(file));
          console.log('########################################################');
          filenamePrinted = true;
        }
        if (!browserNamePrinted) {
          console.log('\n\n======================================================');
          console.log(browser);
          console.log('======================================================\n');
          browserNamePrinted = true;
        }

        const diff = setup.diff(code, result);

        const output = [];

        diff.forEach((part) => {
          // use the common git diff colors: green for added, red for removed to the console output
          // eslint-disable-next-line no-nested-ternary
          const color = part.added
            ? COLORS.green
            : part.removed
              ? COLORS.red
              : COLORS.gray;
          let { value } = part;
          // only show couple of lines of the original css/js when not modified
          if (!part.added && !part.removed) {
            const lines = value.split('\n');
            if (lines.length > 10) {
              value = [
                ...lines.slice(0, 5),
                '\n...\n',
                ...lines.slice(-5),
              ].join('\n');
            }
          }
          output.push(color, value);
        });

        console.log(output.join(''), COLORS.reset);
      }
    }
  }
})();
