import { action } from 'mobx'

import Store from './store'
import Resource from './resource'
import { NotAcceptableError } from '../api/errors'

class Organisation extends Store {
  @action
  inviteUser = async (data) => {
    const url = `${this.url}/invitation`
    try {
      await this.request(url, {
        method: 'POST',
        body: data,
      })
    } catch (error) {
      if (error instanceof NotAcceptableError)
        return { message: 'Email for this organisation is already registered.' }

      return { message: 'Something went wrong. Please try again later.' }
    }

    return { message: 'Invitation has been sent.' }
  }

  @action
  async init() {
    const { data } = await this.request(this.url)
    // TODO: Consider migrating to Resource (instead Store)
    Resource.prototype.extend.call(this, data)
  }
}

export default Organisation
