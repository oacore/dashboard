import { Pages } from './helpers/pages'

class Works extends Pages {
  constructor(baseUrl) {
    const url = `${baseUrl}/works`
    super(url)
  }
}

export default Works
