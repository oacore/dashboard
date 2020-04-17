import React from 'react'

import ErrorBoundary from 'components/error-boundary'

const withErrorBoundary = (WrappedComponent, name) => (props) => (
  <ErrorBoundary componentName={name}>
    <WrappedComponent {...props} />
  </ErrorBoundary>
)

export default withErrorBoundary
