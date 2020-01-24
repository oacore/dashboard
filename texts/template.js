import Mustache from 'mustache'

class Template extends String {
  render(data) {
    return Mustache.render(this.toString(), data)
  }
}

export default Template
