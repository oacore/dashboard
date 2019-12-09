const path = require('path')

const presetEnv = require('postcss-preset-env')
const extend = require('postcss-extend')
const nano = require('cssnano')
const postcssCustomMedia = require('postcss-custom-media')

module.exports = {
  map: true,
  plugins: [
    presetEnv(),
    postcssCustomMedia({
      importFrom: path.resolve(
        __dirname,
        'components/layout/media-queries.css'
      ),
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
