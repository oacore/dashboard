export const makeCancelable = (promise, options) => {
  let canceled = false

  const wrappedPromise = new Promise((resolve, reject) =>
    promise.then(
      result => canceled || resolve(result),
      error => canceled || reject(error)
    )
  )

  return {
    promise: wrappedPromise,
    cancel: () => {
      if (options.cancel && !canceled) options.cancel()
      canceled = true
    },
    isCanceled: () => canceled,
  }
}

export default makeCancelable
