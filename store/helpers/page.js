class Page {
  retrievedAt = null

  data = []

  constructor(data) {
    this.data = data
    this.retrievedAt = Date.now()
  }
}

export default Page
