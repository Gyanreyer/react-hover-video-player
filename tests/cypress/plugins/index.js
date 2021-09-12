const injectDevServer = require('@cypress/react/plugins/babel');
const injectCodeCoverage = require('@cypress/code-coverage/task');
const path = require('path');

// `on` is used to hook into various events Cypress emits
// `config` is the resolved Cypress config
module.exports = (on, config) => {
  if (config.testingType === 'component') {
    injectDevServer(on, config, {
      setWebpackConfig: (webpackConfig) => {
        const isProductionSmokeTest = process.env.BABEL_ENV === 'production';
        // If this is a production smoke test, we should run our tests against
        // the /dist directory; otherwise we'll use /src.
        // (NOTE that a production build will need to have been performed before
        // running smoke tests to ensure /dist exists and has up-to-date contents)
        const componentDirectoryName = isProductionSmokeTest ? 'dist' : 'src';

        // We'll alias `react-hover-video-player` imports in the test files
        // to whatever component directory we're using
        webpackConfig.resolve.alias = {
          'react-hover-video-player': path.resolve(
            __dirname,
            `../../../${componentDirectoryName}`
          ),
        };

        // Inject babel presets and plugins so we can transpile the component for cypress tests
        // without needing to create an entire babelrc file that's only for tests
        const babelConfigRule = webpackConfig.module.rules.find(
          ({ loader }) => loader === 'babel-loader'
        );

        babelConfigRule.options = {
          // Standard babel presets for a react + typescript project
          presets: [
            '@babel/preset-env',
            '@babel/preset-typescript',
            '@babel/preset-react',
          ],
          // Use istanbul plugin to instrument the component code for checking code coverage
          plugins: ['istanbul'],
        };
        return webpackConfig;
      },
    });
  }

  injectCodeCoverage(on, config);

  return config; // IMPORTANT to return a config
};
