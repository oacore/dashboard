const path = require('path')

const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const withImages = require('next-images')

const nextConfig = {
  webpack(config, options) {
    const { dev, isServer } = options

    const postcssLoader = {
      loader: 'postcss-loader',
      options: {
        config: {
          path: path.resolve(__dirname, 'postcss.config.js'),
        },
      },
    }

    const cssLoader = {
      loader: 'css-loader',
      options: {
        onlyLocals: isServer,
        modules: {
          localIdentName: '[name]-[local]-[hash:base64:5]',
        },
        sourceMap: true,
        importLoaders: 1,
        localsConvention: 'camelCase',
      },
    }

    if (!isServer) {
      config.optimization.splitChunks.cacheGroups.styles = {
        name: 'styles',
        test: new RegExp(`\\.css$`),
        chunks: 'all',
        enforce: true,
      }
    }

    if (!isServer) {
      config.plugins.push(
        new ExtractCssChunks({
          filename: dev
            ? 'static/chunks/[name].css'
            : 'static/chunks/[name].[contenthash:8].css',
          chunkFilename: dev
            ? 'static/chunks/[name].chunk.css'
            : 'static/chunks/[name].[contenthash:8].chunk.css',
        })
      )
    }

    const hotCss = !isServer && {
      loader: ExtractCssChunks.loader,
      options: {
        hot: dev,
      },
    }

    config.module.rules.push({
      test: /\.css$/,
      exclude: /\/design\/lib/,
      use: [hotCss, cssLoader, postcssLoader].filter(Boolean),
    })

    config.module.rules.push({
      test: /\.css$/,
      include: /\/design\/lib/,

      use: [
        hotCss,
        { ...cssLoader, options: { ...cssLoader.options, modules: false } },
        postcssLoader,
      ].filter(Boolean),
    })
    return config
  },
}

module.exports = withImages(nextConfig)
