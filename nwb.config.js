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
};
