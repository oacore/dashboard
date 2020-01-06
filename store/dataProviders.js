import { action, observable } from 'mobx'

class DataProviders {
  @observable selectedProvider = {
    id: 1,
    name: 'Open Research Online',
  }

  allProviders = new Map([])

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @action
  retrieveDataProviders = async term => {
    // TODO: Invalidate cache after some time
    //       Move to @oacore/api
    if (this.allProviders.get(term)) return this.allProviders.get(term)
    const r = await fetch(
      `https://api.core.ac.uk/internal/organisations?q=${term}`
    )

    const providers = r.json()
    this.allProviders.set(term, providers)
    return providers
  }
}

export default DataProviders
