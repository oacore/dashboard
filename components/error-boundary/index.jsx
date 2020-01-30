import React from 'react'

import { Sentry } from 'utils/sentry'
import { Label } from 'design'

export default class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    const { componentName } = this.props
    Sentry.withScope(scope => {
      scope.setExtra('errorStack', error.stack)
      scope.setExtra('componentStack', info.componentStack)
      scope.setLevel('fatal')
      scope.setTag('component', componentName)
      Sentry.captureException(error)
    })
  }

  render() {
    const { children } = this.props
    const { hasError } = this.state

    if (hasError) {
      return (
        <Label color="danger">
          Unexpected error occurred. We were notified and we will fix it soon.
        </Label>
      )
    }
    return children
  }
}
