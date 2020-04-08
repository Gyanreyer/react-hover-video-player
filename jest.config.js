module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  verbose: true,
  transform: {
    '^.+\\.js$': '<rootDir>/jest.transform.js',
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.jsx?$',
  moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
  moduleNameMapper: {
    '\\.(css|less|scss|sss|styl)$': '<rootDir>/node_modules/jest-css-modules',
  },
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFiles: ['<rootDir>/jest.init.js'],
};
