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

  @observable duplicateList = {}

  @observable duplicateListDetails = {}

  @observable outputData = []

  @observable workData = {}

  constructor(dataProviderInit, options) {
    super(dataProviderInit, options)
    this.duplicatesUrl = `${process.env.API_URL}/data-providers/${dataProviderInit.id}/duplicates?accept=text/csv`
  }

  @action
  handleTextareaChange = (input) => {
    this.recordValue = input
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
  getDeduplicationData = async (id) => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/data-providers/${id}/duplicates`
      )

      if (response.ok) {
        const data = await response.json()
        this.setDuplicateList(data)
      } else throw new Error('Failed to fetch deduplication data')
    } catch (error) {
      console.error('Error fetching deduplication data:', error)
      this.setDuplicateList([])
    }
  }

  setDuplicateList(data) {
    this.duplicateList = data
  }

  @action
  getDeduplicationInfo = async (workId) => {
    try {
      const response = await fetch(`${process.env.API_URL}/versions/${workId}`)
      const data = await response.json()
      this.setDuplicateListDetails(data)
    } catch (error) {
      console.error('Error fetching deduplication data:', error)
    }
  }

  setDuplicateListDetails(data) {
    this.duplicateListDetails = data
  }

  @action
  getOutputsData = async (id) => {
    try {
      const url = new URL(`/v3/outputs/${id}`, process.env.API_URL).href
      const data = await apiRequest(url)
      this.setOutputData([...this.outputData, data])
    } catch (error) {
      console.error('Error fetching deduplication data:', error)
    }
  }

  setOutputData(data) {
    this.outputData = data
  }

  @action
  clearOutputsData = () => {
    this.outputData = []
  }

  @action
  getWorksData = async (id) => {
    try {
      const url = new URL(`/v3/works/${id}`, process.env.API_URL).href
      const data = await apiRequest(url)
      this.setWorkData(data)
    } catch (error) {
      console.error('Error fetching deduplication data:', error)
    }
  }

  setWorkData(data) {
    this.workData = data
  }

  @action
  // eslint-disable-next-line consistent-return
  updateWork = async (workId, outputId, type) => {
    try {
      const url = `${process.env.API_URL}/versions/${workId}`
      const body = { workId, outputId, type }
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error(error)
    }
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
      const founded = members.find((member) => {
        if (member.repo_id?.toString() === this.id?.toString()) return true

        return !!(
          Array.isArray(member.repo_id) &&
          member.repo_id.find(
            (element) => element?.toString() === this.id?.toString()
          )
        )
      })
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
