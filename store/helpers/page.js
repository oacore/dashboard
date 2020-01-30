class Page {
  retrievedAt = null

  data = []

  constructor(data, options) {
    this.data = data
    this.retrievedAt = Date.now()
    this.options = options
  }
}

export default Page
