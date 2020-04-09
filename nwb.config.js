module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: false,
  },
  webpack: {
    rules: {
      css: {
        modules: true,
      },
    },
  },
};
