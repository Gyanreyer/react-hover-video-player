module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    cjs: true,
    umd: {
      global: 'HoverVideoPlayer',
      externals: {
        react: 'React',
      },
    },
  },
};
