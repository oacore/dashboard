import { action } from 'mobx'

import Resource from '../resource'

const anonymousUser = {
  name: 'Anonymous',
  email: null,
  acceptedTCVersion: 0,
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

  toString() {
    return `${super.toString()} (${this.name})`
  }
}

export default User
