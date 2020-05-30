module.exports = {
  rootDir: '../',
  collectCoverage: true,
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: ['<rootDir>/tests/', '<rootDir>/node_modules/'],
  verbose: true,
  transform: {
    '^.+\\.js$': '<rootDir>/tests/jest.transform.js',
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.jsx?$',
  moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  setupFiles: ['core-js/stable', 'regenerator-runtime/runtime'],
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
};
