import { action, extendObservable } from 'mobx'

import apiRequest from 'api'

const initialStore = {
  metadataCount: 0,
  fullTextCount: 0,
  doiCount: 0,
}

class Statistics {
  constructor(rootStore) {
    this.rootStore = rootStore
    extendObservable(this, initialStore)
  }

  retrieveStatistics = async (dataProviderId = this.rootStore.dataProvider) => {
    try {
      const { data } = await apiRequest(
        `/data-providers/${dataProviderId}/statistics`,
        'GET',
        {},
        null,
        true
      )

      return data || {}
    } catch (e) {
      if (e.statusCode !== 404) throw e
      return {}
    }
  }

  @action
  onDataProviderChange = async (
    dataProviderId = this.rootStore.dataProvider
  ) => {
    const statistics = await this.retrieveStatistics(dataProviderId)
    Object.assign(this, statistics)
  }
}

export default Statistics
