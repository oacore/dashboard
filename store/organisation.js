import { action } from 'mobx'

import Store from './store'

class Organisation extends Store {
  @action
  inviteUser = async (data) => {
    const url = `${this.url}/invitation`
    await this.request(url, {
      method: 'POST',
      body: data,
    })
  }
}

export default Organisation
