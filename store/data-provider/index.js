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
  rootStore = null

  constructor(rootStore, init, options) {
    super(init, options)
    this.rootStore = rootStore
  }

  @observable id = ''

  @observable name = ''

  @observable rorGlobalName = ''

  @observable rorGlobalId = ''

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

  @observable apiUserData = []

  @observable datasetUserData = []

  @observable logo = ''

  @observable membership = {}

  @observable allMembers = []

  @observable recordValue = ''

  @observable myData = ''

  @observable validationResult = {}

  @observable uploadResults = {}

  @observable duplicateList = {}

  @observable duplicateListDetails = {}

  @observable outputData = []

  @observable workData = {}

  @observable rrsList = []

  @observable rrsAdditionalData = {}

  @observable rrsDataLoading = false

  @observable rrsAdditionalDataLoading = false

  @observable rrsPdfLoading = false

  @observable statusUpdate = []

  @action
  handleTextareaChange = (input) => {
    this.recordValue = input
  }

  @action
  setDuplicateList(data) {
    this.duplicateList = data
  }

  @action
  setRrsList(data) {
    this.rrsList = data
  }

  @action
  setRrsAdditionalData(data) {
    this.rrsAdditionalData = data
  }

  @action
  setStatusUpdate = (result) => {
    this.statusUpdate = result
  }

  @action
  setValidationResult = (result) => {
    this.validationResult = result
  }

  @action
  setUploadResult = (result) => {
    this.uploadResults = result
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

  // TEMP
  @action
  getDeduplicationData = async (id, refresh = false) => {
    try {
      const specData = this.rootStore.setSelectedItem
      let url = `${process.env.API_URL}/data-providers/${id}/duplicates/${
        specData ? `?set=${specData}` : ''
      }`
      if (refresh) url += '?refresh=true'

      const options = refresh ? { cache: 'reload' } : {}

      const response = await fetch(url, options)

      if (response.ok) {
        const data = await response.json()
        this.setDuplicateList(data)
      } else throw new Error('Failed to fetch deduplication data')
    } catch (error) {
      console.error('Error fetching deduplication data:', error)
      this.setDuplicateList([])
    }
  }

  @action
  getRrslistData = async (id) => {
    this.rrsDataLoading = true
    try {
      const response = await fetch(
        `${process.env.API_URL}/data-providers/${id}/rights-retention`
      )

      if (response.ok && response.status === 200) {
        const data = await response.json()
        this.setRrsList(data)
      } else throw new Error('Failed to fetch rrs data')
    } catch (error) {
      console.error('Error fetching rrs data:', error)
      this.setRrsList([])
    } finally {
      this.rrsDataLoading = false
    }
  }

  @action
  getOutputsAdditionalData = async (id) => {
    this.rrsAdditionalDataLoading = true
    try {
      const response = await fetch(
        `https://api.core.ac.uk/internal/articles/${id}`
      )
      if (response.ok) {
        const data = await response.json()
        this.setRrsAdditionalData(data)
      } else throw new Error('Failed to fetch rrs data')
    } catch (error) {
      console.error('Error fetching rrs data:', error)
      this.setRrsAdditionalData([])
    } finally {
      this.rrsAdditionalDataLoading = false
    }
  }

  @action
  updateRrsStatus = async (dataProviderId, articleId, validationStatus) => {
    try {
      const url = `${process.env.API_URL}/data-providers/${dataProviderId}/rights-retention-update`
      const body = { articleId, validationStatus }
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // mode: 'no-cors',
        body: JSON.stringify(body),
      })
      const result = await response.json()
      this.setStatusUpdate(result)
    } catch (error) {
      console.error(error)
    }
  }

  @action
  uploadPdf = async (file, dataProviderId) => {
    this.rrsPdfLoading = true
    try {
      const url = `${process.env.API_URL}/data-providers/rights-retention-upload-file`
      const fd = new FormData()
      fd.set('file', file)
      fd.set('dataProviderId', dataProviderId)

      const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        body: fd,
      })

      const result = await response.json()
      this.setUploadResult(result)
    } catch (error) {
      console.error(error)
    } finally {
      this.rrsPdfLoading = false
    }
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
  setGlobalRorName = (value) => {
    this.rorGlobalName = value
  }

  @action
  setGlobalRorId = (value) => {
    this.rorGlobalId = value
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
        this.fetchApiUsers()
        this.fetchDatasetUsers()
        this.retrieveLogo()

        const url = `/data-providers/${this.id}`
        this.works = new Works(url, this.options)
        this.depositDates = new DepositDates(this.rootStore, url, this.options)
        this.doi = new DOI(this.rootStore, url, this.options)
        this.issues = new Issues(url, this.options)
        this.allMembers = new Membership(url, this.options)
        this.duplicatesUrl = `${process.env.API_URL}${url}/duplicates?accept=text/csv`
        this.rrsUrl = `${process.env.API_URL}${url}/rights-retention?accept=text/csv`
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

  @action async fetchApiUsers() {
    try {
      const url = `/settings/access_api_key`
      const { data } = await apiRequest(url)
      this.apiUserData = data
    } catch (networkOrAccessError) {
      // Ignore errors for this moment
    }
  }

  @action async fetchDatasetUsers() {
    try {
      const url = `/settings/access_dataset`
      const { data } = await apiRequest(url)
      this.datasetUserData = data
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
