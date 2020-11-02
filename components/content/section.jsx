import React, { forwardRef, useContext } from 'react'

import LevelContext from './context'

const Section = forwardRef(
  (
    { children, level: forceLevel, tag: Tag = 'section', ...restProps },
    ref
  ) => {
    const contextLevel = useContext(LevelContext)
    const level = forceLevel ?? contextLevel + 1

    return (
      <Tag ref={ref} {...restProps}>
        <LevelContext.Provider value={level}>{children}</LevelContext.Provider>
      </Tag>
    )
  }
)

export default Section
