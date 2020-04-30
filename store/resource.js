import { action, extendObservable } from 'mobx'

import apiRequest from 'api'

class Resource {
  static defaultOptions = {
    request: (...args) => apiRequest(args).then(({ data }) => data),
    prefetch: false,
  }

  static defaultValues = {}

  constructor(init, options) {
    this.options = { ...this.constructor.defaultOptions, ...options }
    extendObservable(this, this.constructor.defaultValues)

    this.init(init)
  }

  @action
  init(init) {
    const data = typeof init == 'string' ? { url: init } : init
    Object.assign(this, data)

    const { prefetch } = this.options
    if (typeof init == 'string' && prefetch) this.retrieve()
  }

  @action
  extend(object) {
    Object.assign(this, object)
  }

  retrieve(...scopes) {
    const { request } = this.options
    if (this.id == null) {
      return request(this.url).then((data) => {
        this.extend(data)
        return this.retrieve(...scopes)
      })
    }

    const requests = scopes.map((scope) => {
      const scopeUrl = `${scope}Url`

      if (this[scopeUrl] == null) {
        throw new Error(
          `Trying to retrieve non-existing nested property '${scope}' via '${scopeUrl}'`
        )
      }

      return request(this[scopeUrl]).then((data) => {
        this.extend({ [scope]: data })
        return data
      })
    })

    return Promise.allSettled(requests)
  }
}

export default Resource
