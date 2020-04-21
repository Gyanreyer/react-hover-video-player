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
      branches: 30,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFiles: ['core-js/stable', 'regenerator-runtime/runtime'],
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
};
