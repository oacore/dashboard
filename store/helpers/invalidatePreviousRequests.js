import { CancelablePromise } from 'utils/promise'

export default function(target, propertyKey, descriptor) {
  const requests = []
  const originalMethod = descriptor.value

  descriptor.value = function decorator(...arg) {
    while (requests.length) {
      const promise = requests.pop()
      promise.cancelIfNotFulFilled()
    }
    const promise = originalMethod.apply(this, arg)
    if (!(promise instanceof CancelablePromise))
      throw new Error('invalidatePreviousRequests expected CancelablePromise')

    requests.push(promise)
    return promise
  }

  return descriptor
}
