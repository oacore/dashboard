/* eslint-disable max-classes-per-file */

import NetworkError from 'api/errors'

export class AccessError extends Error {
  name = 'AccessError'
}

export class AuthorizationError extends Error {
  name = 'AuthorizationError'
}

export class PaymentRequiredError extends Error {
  name = 'PaymentRequiredError'
}

// Passing API error through to simplify error processing,
// preserve original error message
export { NetworkError }
