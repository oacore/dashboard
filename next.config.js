const withCss = require('@zeit/next-css')
const withImages = require('next-images')

const nextConfig = {
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '[name]-[local]-[hash:base64:5]',
    camelCase: true,
  },
}

module.exports = withImages(withCss(nextConfig))
