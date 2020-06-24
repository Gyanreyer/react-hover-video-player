const baseConfig = require('./jest.base.config');

module.exports = {
  ...baseConfig,
  collectCoverage: true,
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: ['<rootDir>/tests/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    'react-hover-video-player': '<rootDir>/src',
  },
};
