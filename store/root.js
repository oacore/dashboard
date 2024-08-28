import { observable, action, computed } from 'mobx'
import escapeString from 'escape-string-regexp'

import Store from './store'
import User from './user'
import Organisation from './organisation'
import Invitation from './invitation'
import { AccessError, AuthorizationError, PaymentRequiredError } from './errors'
import DataProvider from './data-provider'

import apiRequest from 'api'
import * as NetworkErrors from 'api/errors'

const REPEATED_REQUEST_TIMEOUT = 30000
const REPEATED_REQUEST_LIMIT = 5

class Root extends Store {
  static defaultOptions = {
    allowAnonymousAccess: false,

    request(url, options = {}) {
      let attemptCount = 0

      const requestContinuously = () => {
        attemptCount += 1
        if (attemptCount < 2) this.requestsInProgress += 1

        return apiRequest(url, options)
          .finally(() => {
            if (attemptCount < 2) this.requestsInProgress -= 1
          })
          .then((response) => {
            if (options.skipStatusCheck || response.status === 201)
              return response

            return response.status === 202 &&
              attemptCount < REPEATED_REQUEST_LIMIT
              ? new Promise((resolve, reject) => {
                  const repeatedRequest = () =>
                    requestContinuously(url, options).then(resolve, reject)
                  setTimeout(
                    repeatedRequest,
                    options.additionalTimeout || REPEATED_REQUEST_TIMEOUT
                  )
                })
              : response
          })
      }

      return requestContinuously().catch((error) => {
        if (error instanceof NetworkErrors.UnauthorizedError) {
          throw new AuthorizationError(
            `Authorization required for accessing to ${url}`
          )
        }

        if (error instanceof NetworkErrors.PaymentRequiredError) {
          const targetError = new PaymentRequiredError(
            `Payment required for accessing to ${url}`
          )
          targetError.data = error.data
          throw targetError
        }

        if (error instanceof NetworkErrors.ForbiddenError)
          throw new AccessError(`${this.user} does not have access to ${url}`)

        throw error
      })
    },
  }

  constructor(options) {
    super(null, options)
    this.options.request = this.options.request.bind(this)
    //  TODO Check if harvesting works, removed because wrong api call
    // this.issues = new Issues(process.env.API_URL, this.options)
  }

  contactUrl = `${process.env.API_URL}/contact`

  @observable user = new User({}, this.options)

  @observable organisation = null

  @observable dataProvider = null

  @observable depositDates = null

  @observable harvestNotifications = null

  @observable licencingData = null

  @observable deduplicationNotifications = null

  @observable loadingSets = false

  @observable loadingWholeSets = false

  @observable loadingWholeSetsBtn = false

  @observable loadingRemoveItem = false

  @observable setsList = []

  @observable enabledList = []

  @observable disabledList = []

  @observable wholeSetData = []

  @observable tutorial = {
    currentStep: 1,
    isModalOpen: false,
    openModal() {
      this.isModalOpen = true
    },
    closeModal() {
      this.isModalOpen = false
      this.currentStep = 0
    },
    nextStep() {
      this.currentStep += 1
    },
    prevStep() {
      this.currentStep -= 1
    },
  }

  @observable notificationGuide = {
    isModalOpen: false,
    openModal() {
      this.isModalOpen = true
    },
    closeModal() {
      this.isModalOpen = false
    },
  }

  @observable acceptedTCVersion = 0

  @observable requestsInProgress = 0

  @observable seenAll = []

  @observable responseData = null

  @observable setSelectedItem = ''

  @observable selectedSetName = ''

  @action
  updateSelectedSetSpec = (value) => {
    this.setSelectedItem = value
  }

  @action
  updateSelectedSetName = (value) => {
    this.selectedSetName = value
  }

  @action
  setHarvestNotifications = (data) => {
    this.harvestNotifications = data
  }

  @action
  setDeduplicationNotifications = (data) => {
    this.deduplicationNotifications = data
  }

  @action
  setResponseData = (data) => {
    this.responseData = data
  }

  @action
  setLicencing = (data) => {
    this.licencingData = data
  }

  @computed
  get isLoading() {
    return this.requestsInProgress > 0
  }

  @computed
  get organisationId() {
    return this.organisation ? this.organisation.id : ''
  }

  @action
  setSetsList(data) {
    this.setsList = data
  }

  @action
  setEnabledList(data) {
    this.enabledList = data
  }

  @action
  setDisabledList(data) {
    this.disabledList = data
  }

  @action
  setWholeSetData(data) {
    this.wholeSetData = data
  }

  @action
  setLoadingWholeSetsBtn = (value) => {
    this.loadingWholeSetsBtn = value
  }

  @action
  setLoadingRemoveAction = (value, id) => {
    this.loadingRemoveItem = { value, id }
  }

  @computed
  get dataProviders() {
    // The current data provider can be loaded asynchronously to the user's
    // ones. Hence, we filter to remove this possible duplicate
    const ids = new Set()
    const list = [this.dataProvider, ...this.user.dataProviders].filter(
      (dataProvider) => {
        if (dataProvider == null || ids.has(dataProvider.id)) return false
        ids.add(dataProvider.id)
        return true
      }
    )
    list.sort((a, b) => a.name.localeCompare(b.name))
    return list
  }

  @action async init() {
    try {
      await this.user.retrieve()
    } catch (unauthorizedError) {
      if (!this?.options?.allowAnonymousAccess)
        throw new AuthorizationError('Anonymous users are not allowed')
    }
    this.invitation = new Invitation(process.env.API_URL, this.options)
    this.organisation = new Organisation(this.user.affiliationUrl, this.options)
    await this.organisation.listUserInvites()
    await this.organisation.retrieve()
  }

  @action changeDataProvider(id) {
    // Clean-up or initial request
    if (id == null) {
      this.dataProvider = null
      return
    }

    // Probably a repeated request. No need to change
    //
    // Compare strings and numbers since we do not know what type of ID
    // the API exposes
    // eslint-disable-next-line eqeqeq
    if (this.dataProvider?.id == id) return

    // Check access rights
    if (!this.user.canManage(id)) {
      const dpStr = `DataProvider#${id}`
      throw new AccessError(`${this.user} does not have access to the ${dpStr}`)
    }

    const dataProviderInit = this.findDataProvider(id)

    this.dataProvider = new DataProvider(this, dataProviderInit, {
      ...this.options,
      prefetch: true,
    })
  }

  findDataProvider(id) {
    const dataProvider = this.user.dataProviders.find(
      // Comparing string ID from the URL with whatever it is in the object
      // eslint-disable-next-line eqeqeq
      ({ id: dataProviderId }) => dataProviderId == id
    )
    return dataProvider ?? { url: `/data-providers/${id}` }
  }

  searchDataProviders(searchTerm = '') {
    return this.dataProviders.filter(
      (dataProvider) =>
        (dataProvider.name ?? '')
          .toLowerCase()
          .search(escapeString(searchTerm.toLowerCase())) !== -1
    )
  }

  @action
  updateDataProvider = async (patch) => {
    try {
      const { ...body } = patch

      const url = `/data-providers/${this.dataProvider.id}`
      const { data } = await this.options.request(url, {
        method: 'PATCH',
        body,
      })
      Object.assign(this.dataProvider, data)
      return {
        message: 'Settings were updated successfully!',
        data: {
          ror_id: data.ror_id,
          rorName: data.rorName,
          name: data.name,
        },
      }
    } catch (networkOrAccessError) {
      return {
        message: 'Something went wrong. Please try it again later!',
      }
    }
  }

  @action
  updateUser = async (patch) => {
    try {
      const url = `/user`
      const { data } = await this.options.request(url, {
        method: 'PATCH',
        body: patch,
      })
      if (patch.acceptedTCVersion && Number.isInteger(patch.acceptedTCVersion))
        this.user.acceptedTCVersion = patch.acceptedTCVersion

      Object.assign(this.dataProvider, data)
      return {
        message: 'User were updated successfully!',
      }
    } catch (networkOrAccessError) {
      return {
        message: 'Something went wrong. Please try it again later!',
      }
    }
  }

  @action
  updateOrganization = async (patch) => {
    try {
      const { ...body } = patch

      const url = `/organisations/${this.organisationId}`
      const { data } = await this.options.request(url, {
        method: 'PATCH',
        body,
      })
      Object.assign(this.organisation, data)

      return {
        message: 'Settings were updated successfully!',
        data: {
          ror_id: data.ror_id,
          rorName: data.rorName,
          name: data.name,
        },
      }
    } catch (networkOrAccessError) {
      return {
        message: 'Something went wrong. Please try again later!',
      }
    }
  }

  async sendContactRequest(data) {
    try {
      await this.request(this.contactUrl, { method: 'POST', body: data })
      return true
    } catch (anyError) {
      if (process.env.NODE_ENV !== 'production') console.error(anyError)
      return false
    }
  }

  @action
  updateOaiSettings = async (body) => {
    try {
      const url = `/data-providers/${this.dataProvider.id}/oairesolver/settings`
      await this.options.request(url, {
        skipStatusCheck: true,
        method: 'PATCH',
        body: {
          ...body,
          activated: Boolean(body.activated) || false,
        },
      })

      await this.dataProvider.retrieveOaiMapping()

      Object.assign(this.dataProvider.oaiMapping, body)

      return {
        type: 'success',
        message: 'Settings were updated successfully!',
      }
    } catch (error) {
      return {
        type: 'danger',
        message: 'Something went wrong. Please try it again later!',
      }
    }
  }

  @action
  updateLogo = async (body) => {
    try {
      const url = `/data-providers/${this.dataProvider.id}/settings`
      await this.options.request(url, {
        method: 'POST',
        body,
      })
      Object.assign(this.dataProvider, {
        logo: body.logoBase64,
      })
    } catch (networkOrAccessError) {
      // Ignore errors for this moment
    }
  }

  @action
  getSetsWholeList = async () => {
    this.loadingWholeSets = true
    try {
      const response = await fetch(
        `https://api-dev.core.ac.uk/internal/data-providers/${this.dataProvider.id}/set/available`
      )
      if (response.ok) {
        const data = await response.json()
        this.setWholeSetData(data)
      } else throw new Error('Failed to fetch rrs data')
    } catch (error) {
      console.error('Error fetching rrs data:', error)
      this.setWholeSetData([])
    } finally {
      this.loadingWholeSets = false
    }
  }

  @action
  getSetsEnabledList = async () => {
    this.loadingSets = true
    try {
      const response = await fetch(
        `https://api-dev.core.ac.uk/internal/data-providers/${this.dataProvider.id}/set`
      )
      if (response.ok) {
        const data = await response.json()
        this.setEnabledList(data)
      } else throw new Error('Failed to fetch rrs data')
    } catch (error) {
      console.error('Error fetching rrs data:', error)
      this.setEnabledList([])
    } finally {
      this.loadingSets = false
    }
  }

  @action
  enableSet = async (body) => {
    try {
      const response = await fetch(
        `https://api-dev.core.ac.uk/internal/data-providers/${this.dataProvider.id}/set/settings`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      )

      if (!response.ok) throw new Error('Failed to patch settings')
    } catch (error) {
      console.error('Error patching settings:', error)
      throw error
    }
  }

  @action
  deleteSet = async (idSet) => {
    this.loadingSets = true
    try {
      const response = await fetch(
        `https://api-dev.core.ac.uk/internal/data-providers/${this.dataProvider.id}/set/settings/${idSet}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      if (!response.ok) throw new Error('Failed to patch settings')
    } catch (error) {
      console.error('Error patching settings:', error)
      throw error
    } finally {
      this.loadingSets = false
    }
  }

  @action
  getNotifications = async (userId, organisationId, type) => {
    try {
      const url = `/user/${this.user.id}/settings/${this.organisation.id}/${type}`
      const response = await this.options.request(url)

      if (type === 'harvest-completed') this.setHarvestNotifications(response)
      else if (type === 'deduplication-completed')
        this.setDeduplicationNotifications(response)
    } catch (error) {
      console.error('Error making GET request:', error)
      throw error
    }
  }

  @action
  getLicencing = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/data-providers/${this.dataProvider.id}/licencing`
      )
      const data = await response.json()
      this.setLicencing(data)
    } catch (error) {
      console.error('Error making GET request:', error)
      throw error
    }
  }

  @action
  updateLicencing = async (licenseType) => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/data-providers/${this.dataProvider.id}/licencing`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ licence: licenseType }),
        }
      )

      if (!response.ok) throw new Error('Network response was not ok')
      await this.getLicencing()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  @action
  updateNotifications = async (body, notificationType) => {
    try {
      const url = `${process.env.API_URL}/user/${this.user.id}/settings`
      await this.options.request(url, {
        skipStatusCheck: true,
        method: 'POST',
        body,
      })
      await this.getNotifications(
        body.userId,
        body.organisationId,
        notificationType
      )
    } catch (networkOrAccessError) {
      console.error('Error updating notifications:', networkOrAccessError)
      throw new Error('Something went wrong. Please try again later!')
    }
  }

  @action
  deleteNotifications = async (body, notificationType) => {
    try {
      const url = `${process.env.API_URL}/user/${this.user.id}/settings`
      await this.options.request(url, {
        skipStatusCheck: true,
        method: 'DELETE',
        body,
      })

      await this.getNotifications(
        body.userId,
        body.organisationId,
        notificationType
      )
    } catch (networkOrAccessError) {
      throw new Error('Something went wrong. Please try again later!')
    }
  }

  requestResetToken(data) {
    return this.request('/auth/reset', {
      method: 'POST',
      body: data,
    })
  }

  @action
  sendHarvestingRequest = async (message) => {
    const url = `/data-providers/${this.dataProvider.id}/harvesting/request`
    const response = await this.request(url, {
      method: 'POST',
      body: {
        message,
      },
    })
    this.setResponseData(response)
  }
}

export default Root
