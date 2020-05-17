module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    cjs: true,
    umd: false,
  },
  webpack: {
    html: {
      template: 'demo/src/index.html',
    },
  },
  babel: {
    plugins: 'babel-plugin-jsx-remove-data-test-id',
  },
};
