import { action, computed, observable } from 'mobx'

import Resource from '../resource'
import Works from './works'
import DepositDates from './deposit-dates'
import Membership from './membership'
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

  @observable membership = {}

  @observable allMembers = []

  @observable recordValue = ''

  @observable myData = ''

  @observable validationResult = {}

  @action
  handleTextareaChange = (event) => {
    this.recordValue = event.target.value
  }

  @action
  rioxValidation = async (id) => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/${id}/rioxx/validate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ record: this.recordValue }),
        }
      )
      const result = await response.json()
      this.setValidationResult(result)
    } catch (error) {
      console.error(error)
    }
  }

  @action
  repositoryValidator = async (id) => {
    const response = await fetch(
      `${process.env.API_URL}/data-providers/${id}/rioxx/aggregation`
    )
    const data = await response.json()
    this.myData = data
    return data
  }

  @action
  setValidationResult = (result) => {
    this.validationResult = result
  }

  @action retrieve() {
    super.retrieve().then(
      () => {
        this.reset()
        this.retrieveStatistics()
        // this.retrieveInternalStatistics()
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
        this.allMembers = new Membership(url, this.options)
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
  async retrieveInternalStatistics() {
    const url = new URL(
      `/internal/data-providers/${this.id}/statistics`,
      process.env.API_URL
    ).href

    try {
      const { data } = await await apiRequest(url)

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

  @computed
  get membershipPlan() {
    const plan = {}
    const members = this.allMembers?.members
    if (members && members.length > 0) {
      const founded = members.find((member) => +member.repo_id === this.id)
      if (!founded) {
        Object.assign(plan, {
          repo_id: this.id,
          billing_type: 'starting',
        })
      }
      Object.assign(plan, founded)
    }
    return plan
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
      const logoUrl = process.env.API_URL.replace(
        '/internal',
        `/data-providers/${this.id}/logo`
      )
      await apiRequest(logoUrl)

      this.logo = logoUrl
    } catch (networkOrAccessError) {
      this.logo = null
    }
  }

  @action
  reset() {
    this.irus = null
    this.rioxx = null
  }
}

export default DataProvider
