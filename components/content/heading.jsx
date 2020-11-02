import React, { forwardRef, useContext } from 'react'

import LevelContext from './context'

import { Heading } from 'design'

const SectionHeading = forwardRef(({ children, ...passProps }, ref) => {
  const level = useContext(LevelContext)

  return (
    <Heading ref={ref} level={level} {...passProps}>
      {children}
    </Heading>
  )
})

export default SectionHeading
