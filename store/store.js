import request from 'api'

class Store {
  static defaultOptions = {
    request,
  }

  constructor(url, options) {
    this.url = url
    this.options = { ...this.constructor.defaultOptions, ...options }
  }

  request(...args) {
    return this.options.request(...args)
  }
}

export default Store
