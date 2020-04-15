import { action } from 'mobx'

import Store from './store'

class Organisation extends Store {
  @action
  async inviteUser(data) {
    const url = `${this.url}/invitation`
    await this.request(url, {
      method: 'POST',
      body: new URLSearchParams(data),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  }
}

export default Organisation
