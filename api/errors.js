/* eslint-disable import/prefer-default-export */

export class NetworkError extends Error {
  constructor(message, response) {
    super(message)
    this.response = response
  }
}
