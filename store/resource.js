import { action, extendObservable } from 'mobx'

import apiRequest from 'api'

class Resource {
  static defaultOptions = {
    request: apiRequest,
    prefetch: false,
  }

  static defaultValues = {}

  constructor(init, options) {
    this.options = { ...this.constructor.defaultOptions, ...options }

    this.extend(this.constructor.defaultValues)
    this.init(init)
  }

  @action
  init(init) {
    const data = typeof init == 'string' ? { url: init } : init
    this.extend(data)

    const { prefetch } = this.options
    if (typeof init == 'string' && prefetch) this.retrieve()
  }

  @action
  extend(object) {
    const toAssign = {}
    const toExtend = {}

    Object.entries(object).forEach(([key, value]) => {
      ;(key in this ? toAssign : toExtend)[key] = value
    })

    extendObservable(this, toExtend)
    Object.assign(this, toAssign)
  }

  retrieve(...scopes) {
    const { request } = this.options
    if (this.id == null) {
      return request(this.url).then(({ data }) => {
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

      return request(this[scopeUrl]).then(({ data }) => {
        this.extend({ [scope]: data })
        return data
      })
    })

    return Promise.allSettled(requests)
  }

  valueOf() {
    return this.id
  }

  toString() {
    const name = this.constructor.name || 'Resource'
    return `${name}#${this.id}`
  }
}

export default Resource
