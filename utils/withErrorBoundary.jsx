import React from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'

import ErrorBoundary from 'components/error-boundary'

const withErrorBoundary = (WrappedComponent, name) => {
  const ComponentWithErrorBoundary = props => (
    <ErrorBoundary componentName={name}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  )

  return hoistNonReactStatics(ComponentWithErrorBoundary, WrappedComponent)
}

export default withErrorBoundary
