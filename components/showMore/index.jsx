import React, { useState } from 'react'
import { Button } from '@oacore/design/lib/elements'

import styles from './styles.module.css'

const ShowMoreText = ({ text }) => {
  const [showFullText, setShowFullText] = useState(false)

  const toggleShowFullText = () => {
    setShowFullText(!showFullText)
  }

  const maxLength = 30
  let shortText = `${text.split(' ').slice(0, maxLength).join(' ')}...`
  if (text.split(' ').length <= maxLength) shortText = text

  const longText = text

  return (
    <div>
      {showFullText ? longText : shortText}
      {text.length > maxLength && (
        <Button className={styles.showMoreBtn} onClick={toggleShowFullText}>
          {showFullText ? 'Show Less' : 'Show More'}
        </Button>
      )}
    </div>
  )
}

export default ShowMoreText
