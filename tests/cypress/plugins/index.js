const injectDevServer = require('@cypress/react/plugins/babel');
const injectCodeCoverage = require('@cypress/code-coverage/task');

// `on` is used to hook into various events Cypress emits
// `config` is the resolved Cypress config
module.exports = (on, config) => {
  if (config.testingType === 'component') {
    injectDevServer(on, config);
  }

  injectCodeCoverage(on, config);

  return config; // IMPORTANT to return a config
};
