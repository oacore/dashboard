import React, { useState } from 'react'
import { Button } from '@oacore/design/lib/elements'

import styles from './styles.module.css'

const ShowMoreText = ({ text, maxWords }) => {
  const [showMore, setShowMore] = useState(false)

  const toggleShowMore = () => {
    setShowMore(!showMore)
  }

  const words = text.split(' ')
  const truncatedWords = words.slice(0, maxWords)

  if (words.length <= maxWords) return <div>{text}</div>

  return (
    <div>
      {showMore ? text : `${truncatedWords.join(' ')}...`}
      <Button className={styles.showMoreBtn} onClick={toggleShowMore}>
        {showMore ? 'Show less' : 'Show more'}
      </Button>
    </div>
  )
}

export default ShowMoreText
