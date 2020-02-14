export const makeCancelable = (promise, options) => {
  let canceled = false
  let fulfilled = false

  const wrappedPromise = new Promise((resolve, reject) =>
    promise.then(
      result => {
        if (canceled) return
        fulfilled = true
        resolve(result)
      },
      error => canceled || reject(error)
    )
  )

  return {
    promise: wrappedPromise,
    cancel: () => {
      if (options.cancel && !canceled) options.cancel()
      canceled = true
    },
    cancelIfNotFulFilled: () => {
      if (options.cancel && !canceled && !fulfilled) options.cancel()
    },
    isCanceled: () => canceled,
    isFulfilled: () => fulfilled,
  }
}

export default makeCancelable
