module.exports = {
  rootDir: '../../',
  verbose: true,
  // Clear calls to mocked functions before each test
  clearMocks: true,
  // All timers should be faked
  timers: 'fake',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/tests/jest/jest.setup.js'],
  testMatch: ['<rootDir>/**/*.test.js'],
};
