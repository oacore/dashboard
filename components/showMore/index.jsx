import React, { useState } from 'react'
import { Button } from '@oacore/design/lib/elements'

import styles from './styles.module.css'

const ShowMoreText = ({ text, maxLetters }) => {
  const [showMore, setShowMore] = useState(false)

  const toggleShowMore = () => {
    setShowMore(!showMore)
  }

  const truncatedText = text.slice(0, maxLetters)

  if (text.length <= maxLetters) return <div>{text}</div>

  return (
    <div>
      {showMore ? text : `${truncatedText}...`}
      <Button className={styles.showMoreBtn} onClick={toggleShowMore}>
        {showMore ? 'Show less' : 'Show more'}
      </Button>
    </div>
  )
}

export default ShowMoreText
