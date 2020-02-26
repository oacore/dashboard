import React from 'react'

import { Alert, Icon } from 'design'

const DocumentLink = React.memo(({ href, children }) => (
  <a
    href={href}
    // We want to pass referrer tag to our website
    // eslint-disable-next-line react/jsx-no-target-blank
    target="_blank"
    rel="noopener"
  >
    <Alert variant="info">
      <Alert.Header>
        <Icon src="/icons.svg#document" aria-hidden />
        {children}
      </Alert.Header>
    </Alert>
  </a>
))

export default DocumentLink
