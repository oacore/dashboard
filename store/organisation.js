import { action, observable } from 'mobx'

import Resource from './resource'
import { NotAcceptableError } from '../api/errors'

class Organisation extends Resource {
  @observable organisationUserInvites = []

  @observable urlOrganisation = ''

  constructor(baseUrl, options) {
    super(baseUrl, options)
    this.urlOrganisation = `${baseUrl}`
  }

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

  @action
  listUserInvites = async () => {
    const url = `${this.urlOrganisation}/invitation`
    const { data } = await this.options.request(url)
    this.organisationUserInvites = data
  }
}

export default Organisation
