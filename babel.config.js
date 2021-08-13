module.exports = function babelConfig(api) {
  api.cache.forever();
  return {
    babelrcRoots: [
      '.',
    ],
    presets: [
      ['@babel/react', { 'runtime': 'automatic' }],
      '@babel/env',
      '@babel/typescript',
    ],
    plugins: [
      '@babel/plugin-transform-runtime',
      '@babel/proposal-class-properties',
      '@babel/proposal-object-rest-spread',
      // 'i18next-extract',
    ]
  };
};
