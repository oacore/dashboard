import { classNames } from '@oacore/design/lib/utils'
import React, { useState } from 'react'

import styles from './styles.module.css'

const ReadMore = ({ children, maxTextLength = 200, className }) => {
  const text = children
  const [isReadMore, setIsReadMore] = useState(true)
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore)
  }
  return (
    <p className={classNames.use(styles.text).join(className)}>
      {isReadMore ? text.slice(0, maxTextLength) : text}
      {text.length > 200 && (
        <span
          onClick={toggleReadMore}
          role="presentation"
          className={styles.toggle}
        >
          {isReadMore ? '...Show more' : ' Show less'}
        </span>
      )}
    </p>
  )
}

export default ReadMore
