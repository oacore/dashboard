const path = require('path')

const webpack = require('webpack')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const withImages = require('next-images')
const withSourceMaps = require('@zeit/next-source-maps')
const dotenv = require('dotenv')

const profiles = require('./profiles')

dotenv.config()

const camelCaseLoader = path.join(__dirname, 'webpack/camelcase-loader.js')

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
        priority: 10,
      }

      config.optimization.splitChunks.cacheGroups.vendors = {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all',
        enforce: true,
        priority: 20,
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

    config.module.rules.push(
      {
        test: /\.ya?ml$/,
        use: [
          'json-loader',
          camelCaseLoader,
          {
            loader: 'yaml-import-loader',
            options: {
              output: 'json',
            },
          },
        ],
      },
      {
        test: /\.md$/,
        loader: ['json-loader', camelCaseLoader, 'yaml-frontmatter-loader'],
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      }
    )

    Object.assign(config.resolve.alias, {
      '@oacore/texts/dashboard': path.join(__dirname, 'texts'),
      design: path.join(__dirname, 'design'),
      components: path.join(__dirname, 'components'),
      texts: path.join(__dirname, 'texts'),
      utils: path.join(__dirname, 'utils'),
      store: path.join(__dirname, 'store'),
      api: path.join(__dirname, 'api'),
      '@sentry/node': config.isServer ? '@sentry/node' : '@sentry/browser',
    })

    config.plugins.push(
      new webpack.DefinePlugin({
        SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
        PROFILE_DATA: JSON.stringify(
          dev ? profiles.staging : profiles.production
        ),
      })
    )

    return config
  },
}

module.exports = withSourceMaps(withImages(nextConfig))
