import React from 'react'
import { observer } from 'mobx-react'

@observer
class Action extends React.Component {
  render() {
    const { children } = this.props
    return children
  }
}

export default Action
