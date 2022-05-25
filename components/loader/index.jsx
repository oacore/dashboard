import React from 'react'

import { ProgressSpinner } from 'design'

const Loader = ({ width = 50, height = width }) => (
  <ProgressSpinner
    style={{ width: `${width}px`, height: `${height}px`, margin: '1rem 0' }}
  />
)

export default Loader
