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
    return this.options.request.call(this, ...args)
  }
}

export default Store
