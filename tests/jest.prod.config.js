/* eslint-disable @typescript-eslint/no-var-requires */
const baseConfig = require('./jest.base.config');

module.exports = {
  ...baseConfig,
  moduleNameMapper: {
    'react-hover-video-player': '<rootDir>/dist/es/index.js',
  },
};
