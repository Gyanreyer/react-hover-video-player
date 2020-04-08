module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: false,
  },
  webpack: {
    rules: {
      'sass-css': {
        modules: true,
      },
    },
  },
};
