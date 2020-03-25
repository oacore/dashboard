import request from 'api'

class Store {
  static defaultOptions = {
    request,
  }

  constructor(url, options) {
    this.url = url
    this.options = { ...this.constructor.defaultOptions, ...options }
    this.request = this.options.request
  }
}

export default Store
