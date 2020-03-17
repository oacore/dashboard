import { action } from 'mobx'

import Resource from '../resource'

const anonymousUser = {
  name: 'Anonymous',
  email: null,
}

class User extends Resource {
  static defaultValues = anonymousUser

  @action
  async init({ id } = {}) {
    try {
      const url = id == null ? '/user' : `/users/${id}`
      super.init(url)
    } catch (unauthorisedError) {
      throw new Error('User is unauthorised. Using Anonymous')
    }
  }

  get anonymous() {
    return this.id == null
  }

  // TODO: Should be moved to a separate entity
  requestResetToken(data) {
    return this.request('/auth/reset', {
      method: 'POST',
      body: data,
    })
  }

  toString() {
    return `${super.toString()} (${this.name})`
  }
}

export default User
