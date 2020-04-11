module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    cjs: false,
    umd: false,
  },
  webpack: {
    html: {
      template: 'demo/src/index.html',
    },
  },
};
