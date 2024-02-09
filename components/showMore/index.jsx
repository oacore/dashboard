import React from 'react'
import { Button } from '@oacore/design/lib/elements'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'

const ShowMoreText = ({
  text,
  maxLetters,
  showMore,
  toggleShowMore,
  textRestyle,
}) => {
  const truncatedText = text?.slice(0, maxLetters)

  if (!text) return <div className={styles.notAvaliable}>Not available</div>
  if (text.length <= maxLetters) return <div>{text}</div>

  return (
    <div
      className={classNames.use({
        [styles.description]: textRestyle,
      })}
    >
      {showMore ? text : `${truncatedText}...`}
      <Button className={styles.showMoreBtn} onClick={toggleShowMore}>
        {showMore ? 'Show less' : 'Show more'}
      </Button>
    </div>
  )
}

export default ShowMoreText
