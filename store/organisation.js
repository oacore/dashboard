import { action } from 'mobx'

import Resource from './resource'
import { NotAcceptableError } from '../api/errors'

class Organisation extends Resource {
  @action
  inviteUser = async (data) => {
    const url = `${this.url}/invitation`
    try {
      await this.options.request(url, {
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
}

export default Organisation
