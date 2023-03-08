import { action } from 'mobx'

import Resource from './resource'
import { NotAcceptableError } from '../api/errors'

class Invitation extends Resource {
  @action
  deleteInviteUser = async ({ code }) => {
    const url = `${this.url}/invitation/${code}`

    try {
      await this.options.request(url, {
        method: 'DELETE',
      })
    } catch (error) {
      if (error instanceof NotAcceptableError)
        return { message: 'No access to delete invitation' }

      return { message: 'Something went wrong. Please try again later.' }
    }

    return { message: 'Invitation has been deleted.' }
  }
}

export default Invitation
