export function CancelablePromise(promise, options) {
  this.isCanceled = false
  this.isFulfilled = false
  this.promise = new Promise((resolve, reject) =>
    promise.then(
      result => {
        if (this.isFulfilled) return
        this.isFulfilled = true
        resolve(result)
      },
      error => this.isCanceled || reject(error)
    )
  )
  this.cancel = () => {
    if (options.cancel && !this.isCanceled) options.cancel()
    this.isCanceled = true
  }
  this.cancelIfNotFulFilled = () => {
    if (options.cancel && !this.isCanceled && !this.isFulfilled) {
      this.isCanceled = true
      options.cancel()
    }
  }
}

export default CancelablePromise
