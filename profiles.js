const profiles = {
  localhost: {
    apiURL: 'https://localhost:8000',
  },
  staging: {
    apiURL: 'https://api.dev.core.ac.uk',
  },
  production: {
    apiURL: 'https://api.core.ac.uk',
  },
}

module.exports = profiles
