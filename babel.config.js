module.exports = {
    babelrcRoots: ['.', './packages/*', './apps/*'],
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
      '@babel/preset-typescript',
    ],
    plugins: ['react-refresh/babel'],
  };
  