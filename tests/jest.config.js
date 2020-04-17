module.exports = {
  rootDir: '../',
  collectCoverage: true,
  coverageDirectory: './coverage',
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
  snapshotSerializers: ['jest-emotion'],
  setupFiles: ['<rootDir>/tests/jest.init.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
};
