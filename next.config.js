const path = require('path')

const withSourceMaps = require('@zeit/next-source-maps')

const camelCaseLoader = path.join(__dirname, 'webpack/camelcase-loader.js')

const envConfig = require('./config')

const nextConfig = {
  env: envConfig,

  webpack(config) {
    const { rules } = config.module

    // TODO: Remove once https://github.com/zeit/next.js/issues/10584 is solved and released
    // Find the array of "style rules" in the webpack config.
    // This is the array of webpack rules that:
    // - is inside a 'oneOf' block
    // - contains a rule that matches 'file.css'
    const styleRules = (
      rules.find(
        (m) => m.oneOf && m.oneOf.find(({ test: reg }) => reg.test('file.css'))
      ) || {}
    ).oneOf
    if (!styleRules) return config
    // Find all the webpack rules that handle CSS modules
    // Look for rules that match '.module.css'
    // but aren't being used to generate
    // error messages.
    const cssModuleRules = [
      styleRules.find(
        ({ test: reg, use }) =>
          reg.test('file.module.css') && use.loader !== 'error-loader'
      ),
    ].filter((n) => n) // remove 'undefined' values
    // Add the 'localsConvention' config option to the CSS loader config
    // in each of these rules.
    cssModuleRules.forEach((cmr) => {
      // Find the item inside the 'use' list that defines css-loader
      const cssLoaderConfig = cmr.use.find(({ loader }) =>
        loader.includes('css-loader')
      )
      if (cssLoaderConfig && cssLoaderConfig.options) {
        // Patch it with the new config
        cssLoaderConfig.options.localsConvention = 'camelCase'
      }
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
        test: /\.(txt|md)$/,
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
      'design': path.join(__dirname, 'design'),
      'components': path.join(__dirname, 'components'),
      'texts': path.join(__dirname, 'texts'),
      'modules': path.join(__dirname, 'modules'),
      'templates': path.join(__dirname, 'templates'),
      'utils': path.join(__dirname, 'utils'),
      'store': path.join(__dirname, 'store'),
      'api': path.join(__dirname, 'api'),
      'config': path.join(__dirname, 'config.js'),
      '@sentry/node': config.isServer ? '@sentry/node' : '@sentry/browser',

      'react': path.join(__dirname, 'node_modules', 'react'),
      'react-dom': path.join(__dirname, 'node_modules', 'react-dom'),
    })

    return config
  },
}

module.exports = withSourceMaps(nextConfig)
