import React from 'react'

class Column extends React.Component {
  render() {
    const { context, getter, id } = this.props
    const value = getter ? getter(context) : context[id]
    return value !== undefined ? value : null
  }
}

export default Column
