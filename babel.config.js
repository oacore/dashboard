module.exports = (api) => {
  api.cache(true)

  const presets = [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: '3',
      },
    ],
    '@babel/react',
  ]
  const plugins = [
    '@babel/plugin-proposal-export-default-from',
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    '@babel/transform-runtime',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
  ]

  return {
    presets,
    plugins,
  }
}
