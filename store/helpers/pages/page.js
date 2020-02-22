class Page {
  retrievedAt = null

  data = []

  constructor(data, options) {
    this.data = data
    this.retrievedAt = Date.now()
    this.options = options
    this.maxSize = options.maxSize
  }

  get isLast() {
    return this.data.length < this.maxSize
  }
}

export default Page
