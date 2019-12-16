const presetEnv = require('postcss-preset-env')
const extend = require('postcss-extend')
const nano = require('cssnano')

module.exports = {
  map: true,
  plugins: [
    presetEnv({
      stage: 0,
    }),
    extend(),
    nano({
      preset: [
        'default',
        {
          rawCache: false,
          discardComments: false,
          mergeLonghand: false,
          normalizeWhitespace: false,
          svgo: false,
          reduceInitial: false,
          reduceTransforms: false,
        },
      ],
    }),
  ],
}
