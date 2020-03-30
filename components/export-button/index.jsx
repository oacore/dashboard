import React from 'react'

import { Button } from 'design'

const ExportButton = ({ children, href, disabled, ...restProps }) => {
  const props = disabled ? { disabled } : { href, download: true, tag: 'a' }
  return (
    <Button variant="contained" {...props} {...restProps}>
      {children}
    </Button>
  )
}

export default ExportButton
