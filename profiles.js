const profiles = {
  localhost: {
    name: 'Localhost',
    apiURL: 'https://localhost:8000',
  },
  staging: {
    name: 'Staging',
    apiURL: 'https://api.dev.core.ac.uk',
  },
  production: {
    name: 'Production',
    apiURL: 'https://api.core.ac.uk',
  },
}

module.exports = profiles
