import { observable, action, computed } from 'mobx'
import escapeString from 'escape-string-regexp'

import Store from './store'
import User from './user'
import Organisation from './organisation'
import { AccessError, AuthorizationError, PaymentRequiredError } from './errors'
import DataProvider from './data-provider'

import apiRequest from 'api'
import * as NetworkErrors from 'api/errors'

const REPEATED_REQUEST_TIMEOUT = 30000
const REPEATED_REQUEST_LIMIT = 5

class Root extends Store {
  static defaultOptions = {
    allowAnonymousAccess: false,

    request(url, options) {
      let attemptCount = 0

      const requestContinuously = () => {
        attemptCount += 1
        if (attemptCount < 2) this.requestsInProgress += 1

        return apiRequest(url, options)
          .finally(() => {
            if (attemptCount < 2) this.requestsInProgress -= 1
          })
          .then((response) =>
            response.status === 202 && attemptCount < REPEATED_REQUEST_LIMIT
              ? new Promise((resolve, reject) => {
                  const repeatedRequest = () =>
                    requestContinuously(url, options).then(resolve, reject)
                  setTimeout(repeatedRequest, REPEATED_REQUEST_TIMEOUT)
                })
              : response
          )
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
  }

  contactUrl = `${process.env.API_URL}/contact`

  @observable user = new User({}, this.options)

  @observable organisation = null

  @observable dataProvider = null

  @observable depositDates = null

  @observable requestsInProgress = 0

  @computed
  get isLoading() {
    return this.requestsInProgress > 0
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
      if (!this.options.allowAnonymousAccess)
        throw new AuthorizationError('Anonymous users are not allowed')
    }

    this.organisation = new Organisation(this.user.affiliationUrl, this.options)
    this.organisation.retrieve()
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
    this.dataProvider = new DataProvider(dataProviderInit, {
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
      const url = `/data-providers/${this.dataProvider.id}`
      const { data } = await this.options.request(url, {
        method: 'PATCH',
        body: patch,
      })
      Object.assign(this.dataProvider, data)
      return {
        message: 'Settings were updated successfully!',
      }
    } catch (networkOrAccessError) {
      return {
        message: 'Something went wrong. Please try it again later!',
      }
    }
  }

  @action
  updateOrganization = (patch) => {
    const { name: institution } = patch
    return this.updateDataProvider({ institution })

    // TODO: Should be a method without cross-call to another method
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

  requestResetToken(data) {
    return this.request('/auth/reset', {
      method: 'POST',
      body: data,
    })
  }
}

export default Root
