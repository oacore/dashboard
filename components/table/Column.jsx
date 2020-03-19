import React from 'react'
import { observer } from 'mobx-react'

@observer
class Column extends React.Component {
  render() {
    const { context, getter, id } = this.props
    const value = getter ? getter(context) : context[id]
    return value !== undefined ? value : null
  }
}

export default Column
