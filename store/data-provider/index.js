import { action, observable } from 'mobx'

import Resource from '../resource'
import Works from './works'
import DepositDates from './deposit-dates'
import DOI from './doi'
import Issues from '../issues'
import apiRequest from '../../api'
import { NotFoundError as NetworkNotFoundError } from '../../api/errors'
import { NotFoundError } from '../errors'

class DataProvider extends Resource {
  @observable id = ''

  @observable name = ''

  @observable irus = null

  @observable rioxx = null

  @observable works = null

  @observable issues = null

  @observable depositDates = null

  @observable doi = null

  @observable statistics = {
    metadataCount: null,
    fullTextCount: null,
  }

  @observable plugins = {
    discovery: null,
    recommender: null,
  }

  @observable location = {}

  @observable oaiMapping = {}

  @observable logo = ''

  @action retrieve() {
    super.retrieve().then(
      () => {
        this.reset()
        this.retrieveStatistics()
        this.retrievePluginConfig()
        this.retrieveIrusStats()
        this.retrieveRioxxStats()
        this.retrieveOaiMapping()
        this.retrieveLogo()

        const url = `/data-providers/${this.id}`
        this.works = new Works(url, this.options)
        this.depositDates = new DepositDates(url, this.options)
        this.doi = new DOI(url, this.options)
        this.issues = new Issues(url, this.options)
      },
      (error) => {
        if (error instanceof NetworkNotFoundError) {
          this.error = new NotFoundError(
            `DataProvider(${this.url}) could not be found.`
          )
          throw this.error
        }
        throw error
      }
    )
  }

  @action
  async retrieveStatistics() {
    const url = new URL(
      `/v3/data-providers/${this.id}/stats?depositHistory=true`,
      process.env.API_URL
    ).href

    const body = {
      rawStats: true,
      depositHistory: true,
    }

    try {
      const { data } = await await apiRequest(url, {
        body,
        method: 'POST',
      })
      Object.assign(this.statistics, data)
    } catch (error) {
      // Ignore errors for this moment
    }
  }

  @action
  async retrievePluginConfig() {
    const url = `/data-providers/${this.id}/plugins`
    const { data } = await this.options.request(url)

    if (data) {
      data.forEach((plugin) => {
        this.plugins[plugin.type] = plugin
      })
    }
  }

  @action
  async retrieveIrusStats() {
    try {
      const url = `/data-providers/${this.id}/irus`
      const { data } = await apiRequest(url)
      this.irus = data
    } catch (networkOrAccessError) {
      // Ignore errors for this moment
    }
  }

  @action async retrieveRioxxStats() {
    try {
      const url = `/data-providers/${this.id}/rioxx/aggregation`
      const { data } = await apiRequest(url)
      const {
        compliantRecordBasic: partiallyCompliantCount,
        compliantRecordFull: compliantCount,
        totalRecords: totalCount,
        ...rest
      } = data

      this.rioxx = {
        partiallyCompliantCount,
        compliantCount,
        totalCount,
        ...rest,
      }
    } catch (networkOrAccessError) {
      // Ignore errors for this moment
    }
  }

  @action async retrieveOaiMapping() {
    try {
      const url = `/data-providers/${this.id}/oairesolver/settings`
      const { data } = await apiRequest(url)
      this.oaiMapping = data
    } catch (networkOrAccessError) {
      // Ignore errors for this moment
    }
  }

  @action async retrieveLogo() {
    try {
      const url = `/data-providers/${this.id}/logo`
      const { data } = await apiRequest(url)
      this.logo = data
    } catch (networkOrAccessError) {
      // Ignore errors for this moment
    }
  }

  @action
  reset() {
    this.irus = null
    this.rioxx = null
  }
}

export default DataProvider
