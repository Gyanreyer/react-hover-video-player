module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    cjs: true,
    umd: false,
  },
  webpack: {
    html: {
      template: 'demo/src/templates/demo.html',
    },
    copy: {
      // Copy the README file into the demo build directory so it can be loaded
      // and parsed for the page's contents
      patterns: [{ from: './README.md' }],
    },
  },
  babel: {
    // Plugin strips data-testid attribute from elements in build since they're only needed for tests
    plugins: 'babel-plugin-jsx-remove-data-test-id',
  },
};
