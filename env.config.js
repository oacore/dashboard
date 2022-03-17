const NODE_ENV = process.env.NODE_ENV || 'development'

const local = {
  API_URL: 'http://127.0.0.1:8000/internal',
  IDP_URL: 'http://127.0.0.1:8000',
}

// TODO Temporary switch to prod. It is experiment wis issue login tp api-dev
const development = {
  API_URL: 'https://api.core.ac.uk/internal',
  IDP_URL: 'https://api.core.ac.uk',
}

const production = {
  API_URL: 'https://api.core.ac.uk/internal',
  IDP_URL: 'https://api.core.ac.uk',
}

const validate = (config) =>
  ['API_URL', 'IDP_URL'].forEach((param) => {
    if (config[param] == null) throw new Error(`${param} is not configured.`)
  })

const env = { local, development, production }
const config = {
  ...env.production,
  ...env[NODE_ENV],
  SENTRY_DSN: process.env.SENTRY_DSN,
  GA_TRACKING_CODE: process.env.GA_TRACKING_CODE,
}

validate(config)
module.exports = config
