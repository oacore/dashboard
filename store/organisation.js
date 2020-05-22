import { action } from 'mobx'

import Store from './store'
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

      return { message: 'Something went wrong. Please try it later.' }
    }

    return { message: 'Invitation has been sent.' }
  }
}

export default Organisation
