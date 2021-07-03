const injectDevServer = require('@cypress/react/plugins/babel');

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  if (config.testingType === 'component') {
    injectDevServer(on, config);
  }

  return config; // IMPORTANT to return a config
};
