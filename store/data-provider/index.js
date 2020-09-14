import { action, observable, computed } from 'mobx'

import Resource from '../resource'
import Works from './works'
import DepositDates from './deposit-dates'
import DOI from './doi'
import Issues from '../issues'
import { NotFoundError } from '../errors'

import { NotFoundError as NetworkNotFoundError } from 'api/errors'
import apiRequest from 'api'

class DataProvider extends Resource {
  @observable id = ''

  @observable name = ''

  @observable acceptedTerms = false

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

  @observable revalidatingPolicies = false

  @observable policies = null

  @computed
  get areTermsAccepted() {
    return this.policies?.some((p) => p?.type === 'terms' && p?.acceptedDate)
  }

  @action retrieve() {
    super.retrieve().then(
      () => {
        this.reset()
        this.retrievePolicies()
        this.retrieveStatistics()
        this.retrievePluginConfig()
        this.retrieveIrusStats()
        this.retrieveRioxxStats()

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
    const url = `/data-providers/${this.id}/statistics`
    const { data } = await this.options.request(url)
    Object.assign(this.statistics, data)
  }

  @action
  async retrievePluginConfig() {
    const url = `/data-providers/${this.id}/plugins`
    const { data } = await this.options.request(url)

    data.forEach((plugin) => {
      this.plugins[plugin.type] = plugin
    })
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

  @action async retrievePolicies() {
    const { data } = await this.options.request(
      `/data-providers/${this.id}/policies`
    )
    this.policies = data
  }

  @action async acceptTerms() {
    this.revalidatingPolicies = true
    try {
      await this.options.request(`/data-providers/${this.id}/policies/terms`, {
        method: 'POST',
      })
      await this.retrievePolicies()
    } catch (error) {
      this.revalidatingPolicies = true
    }
  }

  @action
  reset() {
    this.irus = null
    this.rioxx = null
  }
}

export default DataProvider
